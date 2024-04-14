import {
  fetchRouletteConfig,
  fetchRouletteStats,
  getNextGame,
  getSpinById,
  getHistoryByConfigId,
} from "@/services/rouletteService";
import {
  mapNumbersToColors,
  processRouletteStatisticsData,
  mapPreviousGamesToHistoryTable,
  applyRetryStrategy,
  clearCurrentCountdown,
  handleCountdown,
  incrementGameCount,
} from "./selectors";
import { store, updateState } from "./state";
import {
  fetchConfiguration$,
  fetchStatistics$,
  fetchNextGame$,
  getSpinByInstanceId$,
  logAction$,
  logEvent$,
  selectRouletteNumber$,
  getHistoryByConfigurationId$,
  configurationChange$,
} from "./actions";
import {
  delay,
  delayWhen,
  distinctUntilChanged,
  shareReplay,
  switchMap,
  tap,
} from "rxjs/operators";
import {
  ConfigId,
  LogActionEntry,
  LogEventEntry,
} from "@/interfaces/interfaces";
import { timer } from "rxjs";

logAction$
  .pipe(
    tap((message) => {
      if (message) {
        const newLog: LogActionEntry = {
          timestamp: new Date(),
          message,
        };
        const updatedLogs = [...(store.value.actionLogs || []), newLog];
        updateState({ actionLogs: updatedLogs });
      }
    }),
  )
  .subscribe();

logEvent$
  .pipe(
    tap(([gameId, result]) => {
      if (gameId && result) {
        const newLog: LogEventEntry = {
          message: `Game ${gameId} has ended, result is ${result}`,
        };
        const updatedLogs = [...(store.value.eventLogs || []), newLog];
        updateState({ eventLogs: updatedLogs });
      }
    }),
  )
  .subscribe();

selectRouletteNumber$
  .pipe(
    tap((selectedRouletteNumber) => updateState({ selectedRouletteNumber })),
  )
  .subscribe();

configurationChange$
  .pipe(
    distinctUntilChanged(),
    tap((configurationId) => {
      logAction$.next("Roulette board changed!");
      clearCurrentCountdown();
      updateState({
        configurationId,
        configuration: null,
        rouletteNumbers: null,
        statisticsNumbers: null,
        nextGame: null,
        gameResults: null,
        countdownValue: null,
        loading: false,
        selectedRouletteNumber: null,
      });
      fetchConfiguration$.next(configurationId);
    }),
  )
  .subscribe();

fetchConfiguration$
  .pipe(
    switchMap((configurationId) => {
      logAction$.next("Loading game board");
      return applyRetryStrategy(fetchRouletteConfig(configurationId));
    }),
    tap((configuration) => {
      logAction$.next("Checking for new game");
      const rouletteNumbers = mapNumbersToColors(configuration);
      updateState({ configuration, rouletteNumbers });
      fetchStatistics$.next(store.value.configurationId);
    }),
  )
  .subscribe();

fetchStatistics$
  .pipe(
    switchMap((configurationId) =>
      applyRetryStrategy(fetchRouletteStats(configurationId)),
    ),
    tap((statistics) => {
      logAction$.next("Spinning the wheel");
      if (
        statistics &&
        store.value.rouletteNumbers &&
        store.value.configuration
      ) {
        const statisticsNumbers = processRouletteStatisticsData(
          store.value.rouletteNumbers,
          store.value.configuration.slots,
          statistics,
        );
        updateState({ statisticsNumbers, selectedRouletteNumber: null });
        fetchNextGame$.next();
      }
    }),
  )
  .subscribe();

fetchNextGame$
  .pipe(
    switchMap(() => {
      updateState({ loading: true });
      return applyRetryStrategy(getNextGame(store.value.configurationId)).pipe(
        tap((nextGame) => {
          clearCurrentCountdown();
          logAction$.next(
            `Starting countdown for ${nextGame.fakeStartDelta} seconds`,
          );
          updateState({
            nextGame,
            loading: false,
            countdownValue: nextGame.fakeStartDelta,
          });
          handleCountdown(nextGame.fakeStartDelta);
        }),
        delayWhen((nextGame) => timer(nextGame.fakeStartDelta * 1000)),
      );
    }),
    tap((nextGame) => {
      updateState({ isSpinning: true });
      getSpinByInstanceId$.next(nextGame.id);
    }),
    shareReplay(1),
  )
  .subscribe();

getSpinByInstanceId$
  .pipe(
    delay(3000),
    switchMap((instanceId) =>
      applyRetryStrategy(
        getSpinById(store.value.configurationId, instanceId.toString()),
      ),
    ),
    tap((gameResults) => {
      if (gameResults.result) {
        updateState({ isSpinning: false });
        incrementGameCount();
        updateState({ gameResults });
        logAction$.next(`Result is ${gameResults.result}`);
        logEvent$.next([gameResults.id, gameResults.outcome]);
        fetchStatistics$.next(store.value.configurationId);
      }
    }),
  )
  .subscribe();

getHistoryByConfigurationId$
  .pipe(
    switchMap(() => {
      const currentState = store.getValue();
      const currentConfigId = parseInt(
        currentState.configurationId,
      ) as ConfigId;
      const gamesPlayed = currentState.gamesPlayed[currentConfigId];
      return applyRetryStrategy(
        getHistoryByConfigId(currentConfigId.toString(), gamesPlayed),
      ).pipe(
        tap((unmappedPreviousGames) => {
          const previousGames = mapPreviousGamesToHistoryTable(
            unmappedPreviousGames,
          );
          updateState({ previousGames });
        }),
      );
    }),
  )
  .subscribe();
