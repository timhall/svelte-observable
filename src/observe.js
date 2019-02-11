import { readable } from 'svelte/store';
import { isObservable, deferred } from './utils';

const noop = () => {};

export default function observe(observable, initial) {
  if (!isObservable(observable)) {
    return readable(noop, observable);
  }

  return readable(set => {
    const { fulfill, reject } = deferred(set, initial);

    const subscription = observable.subscribe({
      next(value) {
        fulfill(value);
      },
      error(err) {
        reject(err);
      }
    });

    return () => subscription.unsubscribe();
  });
}
