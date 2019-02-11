let OBSERVABLE;

export function isObservable(value) {
  // Lazy-load Symbol to give polyfills a chance to run
  if (!OBSERVABLE) {
    OBSERVABLE =
      (typeof Symbol === 'function' && Symbol.observable) || '@@observable';
  }

  return value && value[OBSERVABLE] && value[OBSERVABLE]() === value;
}

export function deferred(set) {
  let initial = true;
  let resolve, reject;

  // Set initial pending value
  set(
    new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    })
  );

  return {
    fulfill(value) {
      if (!initial) return set(Promise.resolve(value));

      initial = false;
      resolve(value);
    },
    reject(error) {
      if (!initial) return set(Promise.reject(value));

      initial = false;
      reject(error);
    }
  };
}
