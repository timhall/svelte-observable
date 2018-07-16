export const SVELTE_OBSERVABLE =
  typeof Symbol === 'function'
    ? Symbol('svelte-observable')
    : '@@svelte-observable';

let OBSERVABLE;

export function isObservable(value) {
  // Lazy-load Symbol to give polyfills a chance to run
  if (!OBSERVABLE) {
    OBSERVABLE =
      (typeof Symbol === 'function' && Symbol.observable) || '@@observable';
  }

  return value && value[OBSERVABLE] && value[OBSERVABLE]() === value;
}

export function deferred() {
  let resolve, reject;
  const later = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  later.resolve = resolve;
  later.reject = reject;

  return later;
}

export function nonenumerable(target, name, value) {
  Object.defineProperty(target, name, {
    enumerable: false,
    value
  });
}
