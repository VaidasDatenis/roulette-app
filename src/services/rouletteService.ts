import { BASE_URL } from "@/utils/utils";
import { from, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

interface RouletteConfig {
  colors: string[];
  positionToId: number[];
  name: string;
  results: string[];
  slots: number;
}

export const fetchRouletteConfig = (
  configurationId: string
): Observable<RouletteConfig> => {
  return from(fetch(`${configurationId}/configuration`)).pipe(
    switchMap(async (response) => {
      if (response.ok) {
        return response.json() as Promise<RouletteConfig>;
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    })
  );
};
