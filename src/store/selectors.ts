import {
  AppState,
  CategorizedData,
  ConfigId,
  HistoryTableData,
  NextGame,
  RouletteConfiguration,
  RouletteNumberProps,
  RouletteStats,
} from "@/interfaces/interfaces";
import { formatDateString } from "@/utils/utils";
import { store, updateState } from "./state";
import {
  Observable,
  catchError,
  delayWhen,
  retryWhen,
  tap,
  throwError,
  timer,
} from "rxjs";

let currentCountdownIntervalId: number | null = null;

export const getConfigurationId = (state: AppState) => state.configurationId;
export const getRouletteNumbers = (state: AppState) => state.rouletteNumbers;
export const getWinningNumber = (state: AppState) => state.gameResults?.result;
export const getUserSelectedNumber = (state: AppState) =>
  state.selectedRouletteNumber;
export const getStatisticsNumbers = (state: AppState) =>
  state.statisticsNumbers;
export const getCountdown = (state: AppState) => state.countdownValue;
export const getCurrentGameResult = (state: AppState) => state.nextGame;
export const getActionLogs = (state: AppState) => state.actionLogs;
export const getEventLogs = (state: AppState) => state.eventLogs;
export const isLoading = (state: AppState) => state.loading;
export const getHistoryRecords = (state: AppState) => state.previousGames;
export const getShowSpinner = (state: AppState) => state.isSpinning;

export const clearCurrentCountdown = () => {
  if (currentCountdownIntervalId !== null) {
    clearInterval(currentCountdownIntervalId);
    currentCountdownIntervalId = null;
    updateState({ countdownValue: null });
  }
};

export const setCurrentCountdownIntervalId = (intervalId: number | null) => {
  currentCountdownIntervalId = intervalId;
};

export const handleCountdown = (fakeStartDelta: number) => {
  clearCurrentCountdown();
  let countdown = fakeStartDelta;
  const intervalId = setInterval(() => {
    countdown -= 1;
    updateState({ countdownValue: countdown });
    if (countdown <= 0) {
      clearInterval(intervalId);
      updateState({ countdownValue: null });
    }
  }, 1000);
  setCurrentCountdownIntervalId(intervalId);
};

export const mapNumbersToColors = (
  configuration: RouletteConfiguration,
): RouletteNumberProps[] => {
  if (!configuration) return [];
  const uniquePositionToId = Array.from(new Set(configuration.positionToId));
  return uniquePositionToId.map((id) => {
    const isDoubleZero = configuration.slots === 38 && id === 37;
    const rouletteNumber = isDoubleZero ? "00" : id.toString();
    const index = configuration.results.findIndex(
      (result) => result === rouletteNumber,
    );
    return {
      rouletteResult: id,
      rouletteNumber,
      rouletteColor: configuration.colors[index],
    };
  });
};

export const mapStatsToNumbers = (
  rouletteNumbers: RouletteNumberProps[],
  rouletteStats: RouletteStats[],
  slots: number,
): RouletteNumberProps[] => {
  const numberLookup = rouletteNumbers.reduce(
    (acc, cur) => {
      const key = cur.rouletteResult.toString();
      acc[key] = cur;
      return acc;
    },
    {} as Record<string, RouletteNumberProps>,
  );
  if (slots === 38) {
    numberLookup["00"] = {
      rouletteNumber: "00",
      rouletteColor: "green",
      rouletteResult: 37,
    };
  }
  return rouletteStats.map((stats) => {
    const key = stats.result.toString();
    const isDoubleZero = slots === 38 && stats.result === 37;
    const lookupKey = isDoubleZero ? "00" : key;
    return {
      rouletteNumberCount: stats.count,
      rouletteResult: stats.result,
      rouletteNumber: numberLookup[lookupKey].rouletteNumber,
      rouletteColor: numberLookup[lookupKey].rouletteColor,
    };
  });
};

export const processRouletteStatisticsData = (
  rouletteNumbers: RouletteNumberProps[],
  slots: number,
  statistics: RouletteStats[],
): CategorizedData => {
  if (!statistics || !rouletteNumbers || !slots) {
    return { cold: [], neutral: [], hot: [] };
  }
  const sortedStats = [...statistics].sort((a, b) => a.count - b.count);
  const coldStats = sortedStats.slice(0, 5);
  const neutralStats = sortedStats.slice(5, -5);
  const hotStats = sortedStats.slice(-5);
  return {
    cold: mapStatsToNumbers(rouletteNumbers, coldStats, slots),
    neutral: mapStatsToNumbers(rouletteNumbers, neutralStats, slots),
    hot: mapStatsToNumbers(rouletteNumbers, hotStats, slots),
  };
};

export const incrementGameCount = () => {
  const currentState = store.value;
  const currentConfigId = parseInt(currentState.configurationId) as ConfigId;
  const currentGamesCount = currentState.gamesPlayed[currentConfigId] ?? 0;
  currentState.gamesPlayed[currentConfigId] = currentGamesCount + 1;
  updateState({ gamesPlayed: currentState.gamesPlayed });
};

export const mapPreviousGamesToHistoryTable = (
  previousGames: NextGame[],
): HistoryTableData[] => {
  return previousGames.map((game) => ({
    date: formatDateString(game.startTime),
    gameId: game.id,
    gameResult: game.outcome,
  }));
};

export function applyRetryStrategy<T>(
  sourceObservable: Observable<T>,
  { retryDelay = 1000, retryStatusCodes = [0, 502, 503, 504] } = {},
): Observable<T> {
  return sourceObservable.pipe(
    retryWhen((errors) =>
      errors.pipe(
        tap((err) => {
          if (retryStatusCodes.includes(err.status)) {
            console.error(
              `Temporary error (${err.status}): ${err.message}. Retrying in ${retryDelay}ms...`,
            );
          } else {
            throw err;
          }
        }),
        delayWhen(() => timer(retryDelay)),
      ),
    ),
    catchError((error) =>
      throwError(() => new Error(`Final Error: ${error.message}`)),
    ),
  );
}
