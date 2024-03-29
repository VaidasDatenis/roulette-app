import {
  CombinedRouletteTypes,
  RouletteNumberProps,
  RouletteStats,
} from "@/interfaces/interfaces";

export const BASE_URL = "https://dev-games-backend.advbet.com/v1/ab-roulette/";

export const mapStatsToNumbers = (
  rouletteNumbers: RouletteNumberProps[],
  stats: RouletteStats[]
): CombinedRouletteTypes[] => {
  return stats.map((stat) => ({
    ...stat,
    color:
      rouletteNumbers.find((num) => num.number === stat.result)?.color ||
      "unknown",
  }));
};
