import {
  fetchRouletteConfig,
  fetchRouletteStats,
  getNextGame,
  getSpinById,
  getHistoryByConfigId,
} from "@/services/rouletteService";
import {
  clearCurrentCountdown,
  setCurrentCountdownIntervalId,
  mapNumbersToColors,
  processRouletteStatisticsData,
  mapPreviousGamesToHistoryTable,
} from "./mutations";
import { store, updateState } from "./state";
import {
  updateConfigurationId,
  fetchConfiguration,
  fetchStatistics,
  fetchNextGame,
  getSpinByUuid,
  getSpinByInstanceId,
  logAction,
  logEvent,
  selectRouletteNumber,
  getHistoryByConfigurationId,
} from "./actions";
import { delayWhen, switchMap, tap } from "rxjs/operators";
import { LogActionEntry, LogEventEntry } from "@/interfaces/interfaces";
import { timer } from "rxjs";

const storeConfId = store.value.configurationId;

logAction
  .pipe(
    tap((message) => {
      const newLog: LogActionEntry = {
        timestamp: new Date(),
        message,
      };
      const updatedLogs = [...(store.value.actionLogs || []), newLog];
      updateState({ actionLogs: updatedLogs });
    })
  )
  .subscribe();

logEvent
  .pipe(
    tap(([gameId, result]) => {
      const newLog: LogEventEntry = {
        message: `Game ${gameId} has ended, result is ${result}`,
      };
      const updatedLogs = [...(store.value.eventLogs || []), newLog];
      updateState({ eventLogs: updatedLogs });
    })
  )
  .subscribe();

selectRouletteNumber
  .pipe(
    tap((selectedRouletteNumber) => updateState({ selectedRouletteNumber }))
  )
  .subscribe();

updateConfigurationId
  .pipe(
    tap((configurationId) => {
      logAction.next("Roulette board changed!");
      clearCurrentCountdown();
      updateState({
        configurationId,
        configuration: null,
        statistics: null,
        rouletteNumbers: null,
        statisticsNumbers: null,
        nextGame: null,
        gameResults: null,
        countdownValue: null,
        loading: false,
        selectedRouletteNumber: null,
      });
      fetchConfiguration.next(configurationId);
    })
  )
  .subscribe();

fetchConfiguration
  .pipe(
    switchMap((configurationId) => {
      logAction.next("Loading game board");
      return fetchRouletteConfig(configurationId);
    }),
    tap((configuration) => {
      logAction.next("Checking for new game");
      const rouletteNumbers = mapNumbersToColors(configuration);
      updateState({ configuration, rouletteNumbers });
      fetchStatistics.next(storeConfId);
    })
  )
  .subscribe();

fetchStatistics
  .pipe(
    switchMap((configurationId) => {
      logAction.next("Spinning the wheel");
      return fetchRouletteStats(configurationId);
    }),
    tap((statistics) => {
      const statisticsNumbers = processRouletteStatisticsData({
        ...store.value,
        statistics,
      });
      updateState({ statistics, statisticsNumbers });
      fetchNextGame.next(storeConfId);
    })
  )
  .subscribe();

fetchNextGame
  .pipe(
    switchMap((configurationId) => {
      updateState({ loading: true });
      return getNextGame(configurationId);
    }),
    tap((nextGame) => {
      clearCurrentCountdown();
      const fakeStartDelta = nextGame.fakeStartDelta;
      logAction.next(`sleeping for fakeStartDelta ${fakeStartDelta} sec`);
      updateState({ loading: false, nextGame, countdownValue: fakeStartDelta });
      let countdown = fakeStartDelta;
      const intervalId = setInterval(() => {
        countdown -= 1;
        updateState({ countdownValue: countdown });
        if (countdown <= 0) {
          clearCurrentCountdown();
        }
      }, 1000);
      setCurrentCountdownIntervalId(intervalId);
    }),
    delayWhen((nextGame) => timer(nextGame.fakeStartDelta * 1000)),
    tap((nextGame) => getSpinByInstanceId.next(nextGame.id))
  )
  .subscribe();

getSpinByInstanceId
  .pipe(
    switchMap((instanceId) => getSpinById(storeConfId, instanceId.toString())),
    tap((gameResults) => {
      updateState({ gameResults });
      logAction.next(`Result is ${gameResults.result}`);
      logEvent.next([gameResults.id, gameResults.result]);
      fetchStatistics.next(storeConfId);
      if (store.value.eventLogs) {
        getHistoryByConfigurationId.next([
          storeConfId,
          store.value.eventLogs.length,
        ]);
      }
    })
  )
  .subscribe();

// TODO: this is not being used
getSpinByUuid
  .pipe(
    switchMap((uuid) => (uuid ? getSpinById(storeConfId, uuid) : [])),
    tap((nextGame) => updateState({ nextGame }))
  )
  .subscribe();

getHistoryByConfigurationId
  .pipe(
    switchMap(([configId, limit]) => getHistoryByConfigId(configId, limit)),
    tap((unmappedPreviousGames) => {
      const previousGames = mapPreviousGamesToHistoryTable(
        unmappedPreviousGames
      );
      updateState({ previousGames });
    })
  )
  .subscribe();
