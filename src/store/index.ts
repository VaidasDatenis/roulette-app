import {
  AppState,
  CategorizedData,
  RouletteNumberProps,
} from "@/interfaces/interfaces";
import {
  fetchRouletteConfig,
  fetchRouletteStats,
} from "@/services/rouletteService";
import { mapStatsToNumbers } from "@/utils/utils";
import { BehaviorSubject, Subject } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

const initialState: AppState = {
  configurationId: null,
  configuration: null,
  statistics: null,
  rouletteNumbers: null,
  statisticsNumbers: null,
};

// Actions
const updateConfigurationId = new Subject<string>();
const fetchConfiguration = new Subject<string>();
const fetchStatistics = new Subject<string>();
const store = new BehaviorSubject<AppState>(initialState);

const updateState = (partialState: Partial<AppState>) => {
  store.next({ ...store.value, ...partialState });
};

// Mapper function
export const mapNumbersToColors = (state: AppState): RouletteNumberProps[] => {
  if (!state.configuration) return [];
  return state.configuration.positionToId.map((num, index) => ({
    number: num,
    color: state.configuration?.colors[index] ?? "white",
  }));
};

export const processRouletteStatisticsData = (
  state: AppState
): CategorizedData => {
  if (!state.statistics || !state.rouletteNumbers) {
    return { cold: [], neutral: [], hot: [] };
  }
  const sortedStats = [...state.statistics].sort((a, b) => a.count - b.count);
  const coldStats = sortedStats.slice(0, 5);
  const neutralStats = sortedStats.slice(5, -5);
  const hotStats = sortedStats.slice(-5);
  return {
    cold: mapStatsToNumbers(state.rouletteNumbers, coldStats),
    neutral: mapStatsToNumbers(state.rouletteNumbers, neutralStats),
    hot: mapStatsToNumbers(state.rouletteNumbers, hotStats),
  };
};

// Effects
updateConfigurationId
  .pipe(
    tap((configurationId) => {
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

// Export actions and the store for components to interact with
export const actions = {
  updateConfigurationId,
  fetchConfiguration,
  fetchStatistics,
};

export const state$ = store.asObservable();
