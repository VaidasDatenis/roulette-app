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
import { switchMap, tap } from "rxjs/operators";
import { LogEntry } from "@/interfaces/interfaces";

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
  .pipe(tap((configurationId) => updateState({ configurationId })))
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
    switchMap((configurationId) => getNextGame(configurationId)),
    tap((nextGame) => {
      updateState({ nextGame });
      getSpinByInstanceId.next(nextGame.id);
    })
  )
  .subscribe();

getSpinByInstanceId
  .pipe(
    switchMap((instanceId) =>
      instanceId ? getSpinById(confId, instanceId) : []
    ),
    tap((nextGame) => {
      updateState({ nextGame });
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
