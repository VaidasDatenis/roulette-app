import { AppState } from "@/interfaces/interfaces";
import { BehaviorSubject } from "rxjs";

export const initialState: AppState = {
  configurationId: "1",
  configuration: null,
  statistics: null,
  rouletteNumbers: null,
  statisticsNumbers: null,
  nextGame: null,
  gameResults: null,
  logs: null,
};

export const store = new BehaviorSubject<AppState>(initialState);
export const state$ = store.asObservable();
export const updateState = (partialState: Partial<AppState>) => {
  store.next({ ...store.value, ...partialState });
};
