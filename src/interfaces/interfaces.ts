export interface RouletteConfig {
  name: string;
  slots: number;
  results: string[];
  colors: string[];
  positionToId: number[];
}

export interface RouletteNumberProps {
  rouletteNumber: string;
  rouletteColor: string;
  rouletteResult: number;
}

export interface RouletteStats {
  result: number;
  count: number;
}

export type CombinedRouletteStats = RouletteNumberProps & RouletteStats;

export interface AppState {
  configurationId: string;
  configuration: RouletteConfig | null;
  statistics: RouletteStats[] | null;
  rouletteNumbers: RouletteNumberProps[] | null;
  statisticsNumbers: CategorizedData | null;
  nextGame: NextGame | null;
  gameResults: NextGame | null;
  actionLogs: LogActionEntry[] | null;
  eventLogs: LogEventEntry[] | null;
  countdownValue: number | null;
  loading: boolean;
  selectedRouletteNumber: number | null;
}

export interface CategorizedData {
  cold: CombinedRouletteStats[];
  neutral: CombinedRouletteStats[];
  hot: CombinedRouletteStats[];
}

export interface ErrorMsg {
  status: number;
  message: string;
}

export interface NextGame {
  uuid: string;
  id: number;
  startTime: Date;
  startDelta: number;
  startDeltaUs: number;
  fakeStartDelta: number;
  duration: number;
  result: number;
  outcome: string;
}

export interface LogActionEntry {
  timestamp: Date;
  message: string;
}

export interface LogEventEntry {
  message: string;
}

export enum BoardTypes {
  SINGLE = "singleZero",
  DOUBLE = "doubleZero",
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
