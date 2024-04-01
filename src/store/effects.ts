import {
  fetchRouletteConfig,
  fetchRouletteStats,
  getNextGame,
  getSpinById,
} from "@/services/rouletteService";
import { mapNumbersToColors, processRouletteStatisticsData } from "./mutations";
import { store, updateState } from "./state";
import {
  updateConfigurationId,
  fetchConfiguration,
  fetchStatistics,
  fetchNextGame,
  getSpinByUuid,
  getSpinByInstanceId,
  logAction,
} from "./actions";
import { delayWhen, switchMap, tap } from "rxjs/operators";
import { LogEntry } from "@/interfaces/interfaces";
import { of, timer } from "rxjs";

const confId = store.value.configurationId;

logAction
  .pipe(
    tap((message) => {
      const newLog: LogEntry = {
        timestamp: new Date(),
        message,
      };
      const updatedLogs = [...(store.value.logs || []), newLog];
      updateState({ logs: updatedLogs });
    })
  )
  .subscribe();

updateConfigurationId
  .pipe(
    tap((configurationId) => {
      updateState({ configurationId });
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
      const rouletteNumbers = mapNumbersToColors(configuration);
      updateState({ configuration, rouletteNumbers });
      fetchStatistics.next(confId);
    })
  )
  .subscribe();

fetchStatistics
  .pipe(
    switchMap((configurationId) => fetchRouletteStats(configurationId)),
    tap((statistics) => {
      const statisticsNumbers = processRouletteStatisticsData({
        ...store.value,
        statistics,
      });
      updateState({ statistics, statisticsNumbers });
      fetchNextGame.next(confId);
    })
  )
  .subscribe();

fetchNextGame
  .pipe(
    switchMap((configurationId) => {
      logAction.next("Checking for new game");
      return getNextGame(configurationId);
    }),
    switchMap((nextGame) => {
      updateState({ nextGame });
      const fakeStartDelta = nextGame.fakeStartDelta;
      logAction.next(`sleeping for fakeStartDelta ${fakeStartDelta} sec`);
      return of(nextGame).pipe(delayWhen(() => timer(fakeStartDelta * 1000)));
    }),
    tap((nextGame) => {
      getSpinByInstanceId.next(nextGame.id);
    })
  )
  .subscribe();

getSpinByInstanceId
  .pipe(
    switchMap((instanceId) => {
      logAction.next("Spinning the wheel");
      return instanceId ? getSpinById(confId, instanceId) : [];
    }),
    tap((gameResults) => {
      updateState({ gameResults });
      fetchStatistics.next(confId);
    })
  )
  .subscribe();

getSpinByUuid
  .pipe(
    switchMap((uuid) => (uuid ? getSpinById(confId, uuid) : [])),
    tap((nextGame) => {
      updateState({ nextGame });
    })
  )
  .subscribe();
