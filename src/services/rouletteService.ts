import { RouletteConfig, RouletteStats } from "@/interfaces/interfaces";
import { from, Observable, throwError } from "rxjs";
import { catchError, retry, switchMap } from "rxjs/operators";
import { retryDelayStrategy } from "./errorHandling";
import { BASE_URL } from "@/utils/utils";

export const fetchRouletteConfig = (
  configurationId: string
): Observable<RouletteConfig> => {
  return from(fetch(`${BASE_URL}${configurationId}/configuration`)).pipe(
    switchMap(async (response) => {
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
  return from(fetch(`${BASE_URL}${configurationId}/stats?limit=200`)).pipe(
    switchMap(async (response) => {
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
