import {
  CategorizedData,
  HistoryTableData,
  NextGame,
  RouletteConfiguration,
  RouletteNumberProps,
  RouletteStats,
} from "@/interfaces/interfaces";
import { formatDateString } from "@/utils/utils";
import { updateState } from "./state";

let currentCountdownIntervalId: number | null = null;

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

export const mapNumbersToColors = (
  configuration: RouletteConfiguration
): RouletteNumberProps[] => {
  if (!configuration) return [];
  const uniquePositionToId = Array.from(new Set(configuration.positionToId));
  return uniquePositionToId.map((id) => {
    const isDoubleZero = configuration.slots === 38 && id === 37;
    const rouletteNumber = isDoubleZero ? "00" : id.toString();
    const index = configuration.results.findIndex(
      (result) => result === rouletteNumber
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
  slots: number
): RouletteNumberProps[] => {
  const numberLookup = rouletteNumbers.reduce((acc, cur) => {
    const key = cur.rouletteResult.toString();
    acc[key] = cur;
    return acc;
  }, {} as Record<string, RouletteNumberProps>);
  if (slots === 38) {
    numberLookup["00"] = {
      rouletteNumber: "00",
      rouletteColor: "green",
      rouletteResult: 37,
    };
  }
  return rouletteStats.map((stats) => {
    const key = stats.result.toString();
    const isDoubleZero = slots === 38 && stats.result === 36;
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
  statistics: RouletteStats[]
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

export const mapPreviousGamesToHistoryTable = (
  previousGames: NextGame[]
): HistoryTableData[] => {
  return previousGames.map((game) => ({
    date: formatDateString(game.startTime),
    gameId: game.id,
    gameResult: game.outcome,
  }));
};
