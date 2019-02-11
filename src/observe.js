import { readable } from 'svelte/store';
import { isObservable, deferred } from './utils';

const noop = () => {};

export default function observe(observable) {
  if (!isObservable(observable)) {
    return readable(noop, observable);
  }

  return readable(set => {
    const { fulfill, reject } = deferred(set);

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
