import { Subject } from "rxjs";

export const updateConfigurationId = new Subject<string>();
export const fetchConfiguration = new Subject<string>();
export const fetchStatistics = new Subject<string>();
export const fetchNextGame = new Subject<string>();
export const getSpinByUuid = new Subject<number>();
export const getSpinByInstanceId = new Subject<number>();
