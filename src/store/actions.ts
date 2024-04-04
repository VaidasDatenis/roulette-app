import { Subject } from "rxjs";

export const updateConfigurationId = new Subject<string>();
export const fetchConfiguration = new Subject<string>();
export const fetchStatistics = new Subject<string>();
export const fetchNextGame = new Subject<string>();
export const getSpinByUuid = new Subject<string>();
export const getSpinByInstanceId = new Subject<number>();
export const logAction = new Subject<string>();
export const logEvent = new Subject<[number, number]>();
export const selectRouletteNumber = new Subject<number>();
export const getHistoryByConfigurationId = new Subject<[string, number]>();
