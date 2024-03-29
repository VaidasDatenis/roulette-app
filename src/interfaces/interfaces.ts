export interface RouletteConfig {
  name: string;
  slot?: number;
  results: string[];
  colors: string[];
  positionToId: number[];
}

export interface RouletteNumberProps {
  number?: number;
  color: string;
}

export interface RouletteStats {
  result: number;
  count: number;
}

export type CombinedRouletteTypes = RouletteNumberProps & RouletteStats;

export interface AppState {
  configurationId: string | null;
  configuration: RouletteConfig | null;
  statistics: RouletteStats[] | null;
  rouletteNumbers: RouletteNumberProps[] | null;
  statisticsNumbers: CategorizedData | null;
}

export interface CategorizedData {
  cold: CombinedRouletteTypes[];
  neutral: CombinedRouletteTypes[];
  hot: CombinedRouletteTypes[];
}

export interface ErrorMsg {
  status: number;
  message: string;
}

export enum StatsCategories {
  COLD = "cold",
  NEUTRAL = "neutral",
  HOT = "hot",
}

export enum RouletteColors {
  RED = "red",
  BLACK = "black",
  GREEN = "green",
}
