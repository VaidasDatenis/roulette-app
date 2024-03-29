import {
  fetchRouletteConfig,
  fetchRouletteStats,
} from "@/services/rouletteService";
import { mapNumbersToColors, processRouletteStatisticsData } from "./mutations";
import { store, updateState } from "./state";
import {
  updateConfigurationId,
  fetchConfiguration,
  fetchStatistics,
} from "./actions";
import { switchMap, tap } from "rxjs/operators";

updateConfigurationId
  .pipe(
    tap((configurationId) => {
      console.log(configurationId); // initialId
      updateState({ configurationId });
      fetchConfiguration.next(configurationId);
      fetchStatistics.next(configurationId);
    })
  )
  .subscribe();

fetchConfiguration
  .pipe(
    switchMap((configurationId) => fetchRouletteConfig(configurationId)),
    tap((configuration) => {
      const rouletteNumbers = mapNumbersToColors({
        ...store.value,
        configuration,
      });
      updateState({ configuration, rouletteNumbers });
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
    })
  )
  .subscribe();
