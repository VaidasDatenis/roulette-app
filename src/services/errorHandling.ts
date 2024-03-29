import { ErrorMsg } from "@/interfaces/interfaces";
import { throwError, timer } from "rxjs";

export const retryDelayStrategy = (scalingDuration = 3000) => ({
  delay: (error: ErrorMsg, retryCount: number) => {
    if (isRetryAllowed(error) && retryCount) {
      console.log(`Attempt ${retryCount}: retrying in ${scalingDuration}ms`);
      return timer(scalingDuration);
    }
    return throwError(() => new Error(`Failed after ${retryCount} attempts.`));
  },
});

const isRetryAllowed = (error: { status: number }) => {
  return error.status === 404 || error.status === 502;
};
