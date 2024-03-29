import {
  AppState,
  CategorizedData,
  RouletteNumberProps,
} from "@/interfaces/interfaces";
import { mapStatsToNumbers } from "@/utils/utils";

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
