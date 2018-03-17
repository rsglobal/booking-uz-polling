const trainList = window.UITrainList._instance;
const trainSearch = window.UITrainSearch._instance;

function subscribe(fn) {
  if (!trainList.__onListResult) {
    trainList.__onListResult = trainList._onListResult;
  }

  trainList._onListResult = (...args) => {
    fn(...args);
    trainList.__onListResult(...args);
  };
}

function submit() {
  trainSearch._onSubmit();
}

export { subscribe, submit };
