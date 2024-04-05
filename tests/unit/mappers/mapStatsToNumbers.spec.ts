import { mapStatsToNumbers } from "@/store/mutations";
import {
  expectedConfigurationMock,
  expectedRouletteStatisticsTableMock,
  rouletteStatsMock,
} from "@tests/tests.utils";

describe("mapStatsToNumbers", () => {
  it("maps statistics to roulette numbers correctly", () => {
    const rouletteNumbers = expectedConfigurationMock;
    const rouletteStats = rouletteStatsMock;
    const slots = 38;

    const expectedRouletteStats = expectedRouletteStatisticsTableMock;

    const result = mapStatsToNumbers(rouletteNumbers, rouletteStats, slots);
    expect(result).toEqual(expectedRouletteStats);
  });
});
