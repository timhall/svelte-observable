let OBSERVABLE;

export function isObservable(value) {
  // Lazy-load Symbol to give polyfills a chance to run
  if (!OBSERVABLE) {
    OBSERVABLE =
      (typeof Symbol === 'function' && Symbol.observable) || '@@observable';
  }

  return value && value[OBSERVABLE] && value[OBSERVABLE]() === value;
}

export function deferred(set, initial) {
  let initialized = initial !== undefined;
  let resolve, reject;

  // Set initial value
  set(
    initialized
      ? initial
      : new Promise((_resolve, _reject) => {
          resolve = _resolve;
          reject = _reject;
        })
  );

  return {
    fulfill(value) {
      if (initialized) return set(Promise.resolve(value));

      initialized = true;
      resolve(value);
    },
    reject(error) {
      if (initialized) return set(Promise.reject(value));

      initialized = true;
      reject(error);
    }
  };
}
