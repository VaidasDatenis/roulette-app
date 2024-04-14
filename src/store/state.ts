import { AppState } from "@/interfaces/interfaces";
import { BehaviorSubject } from "rxjs";

export const initialState: AppState = {
  configurationId: "1",
  configuration: null,
  rouletteNumbers: null,
  statisticsNumbers: null,
  nextGame: null,
  gameResults: null,
  actionLogs: null,
  eventLogs: null,
  countdownValue: null,
  loading: false,
  selectedRouletteNumber: null,
  previousGames: null,
  gamesPlayed: {
    1: 0,
    2: 0,
  },
  isSpinning: false,
};

export const store = new BehaviorSubject<AppState>(initialState);
export const state$ = store.asObservable();
export const updateState = (partialState: Partial<AppState>) => {
  store.next({ ...store.value, ...partialState });
};
