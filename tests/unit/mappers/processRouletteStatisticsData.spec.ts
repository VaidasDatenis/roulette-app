import { processRouletteStatisticsData } from "@/store/selectors";
import {
  expectedColdCategorizedMock,
  expectedConfigurationMock,
  rouletteStatsMock,
} from "@tests/tests.utils";

describe("processRouletteStatisticsData", () => {
  const rouletteNumbers = expectedConfigurationMock;
  const slots = 38;
  const statistics = rouletteStatsMock;
  const categorizedData = processRouletteStatisticsData(
    rouletteNumbers,
    slots,
    statistics,
  );
  const emptyStatisticsData = processRouletteStatisticsData([], 0, []);
  const expectedColdNumbers = expectedColdCategorizedMock;

  it("should categorize statistics array into cold, neutral, and hot object", () => {
    expect(categorizedData.cold).toHaveLength(5);
    expect(categorizedData.cold).not.toHaveLength(6);
    expect(categorizedData.neutral).toHaveLength(8);
    expect(categorizedData.hot).toHaveLength(5);
    expect(categorizedData.hot).not.toHaveLength(4);
  });

  it("should COLD hold 5 mapped objects in the list", () => {
    expect(categorizedData.cold).toEqual(expectedColdNumbers);
  });

  it("should return empty categorized arrays", () => {
    expect(emptyStatisticsData.cold).toEqual([]);
    expect(emptyStatisticsData.neutral).toEqual([]);
    expect(emptyStatisticsData.hot).toEqual([]);
  });

  it("ensures cold numbers are sorted correctly", () => {
    const counts = categorizedData.cold
      .map((item) => item.rouletteNumberCount)
      .filter((count) => count !== undefined) as number[];
    const sorted = [...counts].sort((a, b) => a - b);
    expect(counts).toEqual(sorted);
  });
});
