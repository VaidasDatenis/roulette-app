import {
  AppState,
  CategorizedData,
  RouletteConfig,
  RouletteNumberProps,
} from "@/interfaces/interfaces";
import { mapStatsToNumbers } from "@/utils/utils";
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
  configuration: RouletteConfig
): RouletteNumberProps[] => {
  if (!configuration) return [];
  return configuration.positionToId.map((num, index) => ({
    rouletteResult: num,
    rouletteNumber:
      configuration.slots === 38 && num === 37 ? "00" : num.toString(),
    rouletteColor:
      configuration.slots === 38 && num === 37
        ? "green"
        : configuration?.colors[index],
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
