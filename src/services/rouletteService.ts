import {
  ErrorMsg,
  NextGame,
  RouletteConfiguration,
  RouletteStats,
} from "@/interfaces/interfaces";
import { Observable } from "rxjs";
import { BASE_URL } from "@/utils/utils";
import { logAction$ } from "@/store";

export const fetchRouletteConfig = (
  configurationId: string,
): Observable<RouletteConfiguration> => {
  logAction$.next("GET .../configuration");
  return new Observable<RouletteConfiguration>((subscriber) => {
    fetch(`${BASE_URL}${configurationId}/configuration`)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => subscriber.next(data as RouletteConfiguration));
        } else {
          subscriber.error(
            new Error(
              `${response.status} -> Network response was not ok: ${response.statusText}`,
            ),
          );
        }
      })
      .catch((error) => {
        subscriber.error({
          status: 0,
          message: error.message || "Network error",
        } as ErrorMsg);
      });
  });
};

export const fetchRouletteStats = (
  configurationId: string,
): Observable<RouletteStats[]> => {
  logAction$.next("GET .../stats?limit=200");
  return new Observable<RouletteStats[]>((subscriber) => {
    fetch(`${BASE_URL}${configurationId}/stats?limit=200`)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => subscriber.next(data as RouletteStats[]));
        } else {
          subscriber.error({
            status: response.status,
            message: `Network response was not ok: ${response.statusText}`,
          } as ErrorMsg);
        }
      })
      .catch((error: ErrorMsg) => subscriber.error(new Error(error.message)));
  });
};

export const getNextGame = (configurationId: string): Observable<NextGame> => {
  logAction$.next("GET .../nextGame");
  return new Observable<NextGame>((subscriber) => {
    fetch(`${BASE_URL}${configurationId}/nextGame`)
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => subscriber.next(data as NextGame));
        } else {
          subscriber.error({
            status: response.status,
            message: `Network response was not ok: ${response.statusText}`,
          } as ErrorMsg);
        }
      })
      .catch((error) => {
        subscriber.error({
          status: 0,
          message: error.message || "Network error",
        } as ErrorMsg);
      });
  });
};

export const getSpinById = (
  configurationId: string,
  id: string,
): Observable<NextGame> => {
  logAction$.next(`GET .../game/${id}`);
  return new Observable<NextGame>((subscriber) => {
    fetch(`${BASE_URL}${configurationId}/game/${id}`)
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => subscriber.next(data as NextGame));
        } else {
          subscriber.error({
            status: response.status,
            message: `Network response was not ok: ${response.statusText}`,
          } as ErrorMsg);
        }
      })
      .catch((error) => {
        subscriber.error({
          status: 0,
          message: error.message || "Network error",
        } as ErrorMsg);
      });
  });
};

export const getHistoryByConfigId = (
  configurationId: string,
  loadLimit: number,
): Observable<NextGame[]> => {
  logAction$.next(`GET .../history?limit=${loadLimit}`);
  return new Observable<NextGame[]>((subscriber) => {
    fetch(`${BASE_URL}${configurationId}/history?limit=${loadLimit}`)
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => subscriber.next(data as NextGame[]));
        } else {
          subscriber.error({
            status: response.status,
            message: `Network response was not ok: ${response.statusText}`,
          } as ErrorMsg);
        }
      })
      .catch((error) => {
        subscriber.error({
          status: 0,
          message: error.message || "Network error",
        } as ErrorMsg);
      });
  });
};
