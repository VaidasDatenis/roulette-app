import {
  NextGame,
  RouletteConfig,
  RouletteStats,
} from "@/interfaces/interfaces";
import { from, Observable, throwError } from "rxjs";
import { catchError, retry, switchMap } from "rxjs/operators";
import { retryDelayStrategy } from "./errorHandling";
import { BASE_URL } from "@/utils/utils";
import { logAction } from "@/store";

export const fetchRouletteConfig = (
  configurationId: string
): Observable<RouletteConfig> => {
  logAction.next("GET .../configuration");
  return from(fetch(`${BASE_URL}${configurationId}/configuration`)).pipe(
    switchMap((response) => {
      if (response.ok) {
        return response.json() as Promise<RouletteConfig>;
      } else {
        throw {
          status: response.status,
          message: `Network response was not ok: ${response.statusText}`,
        };
      }
    }),
    retry(retryDelayStrategy(3000)),
    catchError((error) => throwError(() => new Error(error.message)))
  );
};

export const fetchRouletteStats = (
  configurationId: string
): Observable<RouletteStats[]> => {
  logAction.next("GET .../stats?limit=200");
  return from(fetch(`${BASE_URL}${configurationId}/stats?limit=200`)).pipe(
    switchMap((response) => {
      if (response.ok) {
        return response.json() as Promise<RouletteStats[]>;
      } else {
        throw {
          status: response.status,
          message: `Network response was not ok: ${response.statusText}`,
        };
      }
    }),
    retry(retryDelayStrategy(3000)),
    catchError((error) => throwError(() => new Error(error.message)))
  );
};

export const getNextGame = (configurationId: string): Observable<NextGame> => {
  logAction.next("GET .../nextGame");
  return from(fetch(`${BASE_URL}${configurationId}/nextGame`)).pipe(
    switchMap((response) => {
      if (response.ok) {
        return response.json() as Promise<NextGame>;
      } else {
        throw {
          status: response.status,
          message: `Network response was not ok: ${response.statusText}`,
        };
      }
    }),
    retry(retryDelayStrategy(3000)),
    catchError((error) => throwError(() => new Error(error.message)))
  );
};

export const getSpinById = (
  configurationId: string,
  id: number
): Observable<NextGame> => {
  return from(fetch(`${BASE_URL}${configurationId}/game/${id}`)).pipe(
    switchMap((response) => {
      if (response.ok) {
        return response.json() as Promise<NextGame>;
      } else {
        throw {
          status: response.status,
          message: `Network response was not ok: ${response.statusText}`,
        };
      }
    }),
    retry(retryDelayStrategy(3000)),
    catchError((error) => throwError(() => new Error(error.message)))
  );
};
