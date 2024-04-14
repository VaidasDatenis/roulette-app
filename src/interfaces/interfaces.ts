export interface RouletteConfiguration {
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
  rouletteNumberCount?: number;
}

export interface RouletteStats {
  result: number;
  count: number;
}

export interface AppState {
  configurationId: string;
  configuration: RouletteConfiguration | null;
  rouletteNumbers: RouletteNumberProps[] | null;
  statisticsNumbers: CategorizedData | null;
  nextGame: NextGame | null;
  gameResults: NextGame | null;
  actionLogs: LogActionEntry[] | null;
  eventLogs: LogEventEntry[] | null;
  countdownValue: number | null;
  loading: boolean;
  selectedRouletteNumber: string | null;
  previousGames: HistoryTableData[] | null;
  gamesPlayed: GamesPlayed;
  isSpinning: boolean;
}

export type ConfigId = 1 | 2;

export interface GamesPlayed extends Record<ConfigId, number> {}

export interface CategorizedData {
  cold: RouletteNumberProps[];
  neutral: RouletteNumberProps[];
  hot: RouletteNumberProps[];
}

export interface ErrorMsg {
  status: number;
  message: string;
}

export interface NextGame {
  uuid: string;
  id: number;
  startTime: string;
  startDelta: number;
  startDeltaUs: number;
  fakeStartDelta: number;
  duration: number;
  result: number;
  outcome: string;
}

export interface HistoryTableData {
  date: string;
  gameId: number;
  gameResult: string;
}

export interface LogActionEntry {
  timestamp: Date;
  message: string;
}

export interface LogEventEntry {
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
