import {
  CombinedRouletteStats,
  RouletteNumberProps,
  RouletteStats,
} from "@/interfaces/interfaces";

export const BASE_URL = "https://dev-games-backend.advbet.com/v1/ab-roulette/";

export const mapStatsToNumbers = (
  rouletteNumbers: RouletteNumberProps[],
  rouletteStats: RouletteStats[]
): CombinedRouletteStats[] => {
  return rouletteStats.map((stats) => {
    const numberString = stats.result.toString();
    const foundNumber = rouletteNumbers.find(
      (num) => num.rouletteNumber === numberString
    );
    return {
      ...stats,
      rouletteNumber: stats.result === 37 ? "00" : numberString,
      rouletteColor:
        stats.result === 37
          ? "green"
          : foundNumber?.rouletteColor || "defaultColor",
    };
  });
};
