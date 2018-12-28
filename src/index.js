import { readable } from 'svelte/store';

export const isObservable = (() => {
  let OBSERVABLE;

  return value => {
    // Lazy-load Symbol to give polyfills a chance to run
    if (!OBSERVABLE) {
      OBSERVABLE =
        (typeof Symbol === 'function' && Symbol.observable) || '@@observable';
    }

    return value && value[OBSERVABLE] && value[OBSERVABLE]() === value;
  };
})();

export function observe(observable) {
  if (!isObservable(observable)) {
    return readable(noop, observable);
  }

  return readable(set => {
    const subscription = observable.subscribe({
      next(value) {
        set(fulfilled(value));
      },
      error(error) {
        set(rejected(error));
      }
    });

    return () => subscription.unsubscribe();
  }, pending());
}

function pending() {
  return new Promise(noop);
}

function fulfilled(value) {
  return Promise.resolve(value);
}

function rejected(error) {
  return Promise.reject(error);
}

function noop() {}
