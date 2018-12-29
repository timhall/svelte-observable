let OBSERVABLE;

export function isObservable(value) {
  // Lazy-load Symbol to give polyfills a chance to run
  if (!OBSERVABLE) {
    OBSERVABLE =
      (typeof Symbol === 'function' && Symbol.observable) || '@@observable';
  }

  return value && value[OBSERVABLE] && value[OBSERVABLE]() === value;
}

export function pending() {
  return new Promise(noop);
}

export function fulfilled(value) {
  return Promise.resolve(value);
}

export function rejected(error) {
  return Promise.reject(error);
}

export function noop() {}
