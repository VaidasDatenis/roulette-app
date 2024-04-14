import { RouletteConfiguration } from "@/interfaces/interfaces";
import { mapNumbersToColors } from "@/store/selectors";
import {
  expectedConfigurationMock,
  mockConfigurationMock,
} from "@tests/tests.utils";

describe("mapNumbersToColors", () => {
  it("should map numbers to colors correctly", () => {
    const configurationMock = mockConfigurationMock;
    const expected = expectedConfigurationMock;
    const result = mapNumbersToColors(configurationMock);

    expect(result).toEqual(expected);
  });

  it("should map numbers to colors without duplicates", () => {
    const mockConfiguration: RouletteConfiguration = {
      slots: 38,
      positionToId: [0, 37, 1, 2, 2, 37], // Duplicates
      results: ["0", "00", "1", "2"],
      colors: ["green", "green", "red", "black"],
      name: "doubleZero",
    };

    const mappedResults = mapNumbersToColors(mockConfiguration);
    const rouletteNumbers = mappedResults.map((item) => item.rouletteNumber);
    const uniqueRouletteNumbers = Array.from(new Set(rouletteNumbers));
    expect(rouletteNumbers).toEqual(uniqueRouletteNumbers);
  });
});
