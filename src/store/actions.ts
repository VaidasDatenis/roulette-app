import { Subject } from "rxjs";

export const configurationChange$ = new Subject<string>();
export const fetchConfiguration$ = new Subject<string>();
export const fetchStatistics$ = new Subject<string>();
export const fetchNextGame$ = new Subject<void>();
export const getSpinByInstanceId$ = new Subject<number>();
export const logAction$ = new Subject<string>();
export const logEvent$ = new Subject<[number, string]>();
export const selectRouletteNumber$ = new Subject<string>();
export const getHistoryByConfigurationId$ = new Subject<void>();
