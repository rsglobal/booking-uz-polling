import { subscribe, submit } from "./search-api.js";
import notify from "./notify.js";
import _resultToString from "./resultToString.js";

const DEFAULT_POLLING_INTERVAL = 1 * 60 * 1000;

function startPolling({
  pollingIntervalMs = DEFAULT_POLLING_INTERVAL,
  resultToString = _resultToString,
  onResult,
  onResultChanged
} = {}) {
  let prevResult;
  let prevResultStr;

  subscribe(result => {
    const resultStr = resultToString(result, prevResult);

    console.log(resultStr);

    if (resultStr !== prevResultStr) {
      prevResult = result;
      prevResultStr = resultStr;

      if (typeof onResult === "function") {
        onResult(resultStr, result);
      }

      if (typeof onResultChanged === "function") {
        onResultChanged(resultStr, result);
      }

      notify(resultStr);
    }
  });

  let interval = setInterval(submit, pollingIntervalMs);

  notify(
    `Subscribed with interval in ${pollingIntervalMs / 1000 / 60} minutes`
  );
  submit();

  return function stopPolling() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };
}

export { startPolling };
