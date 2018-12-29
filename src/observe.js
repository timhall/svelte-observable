import { readable } from 'svelte/store';
import { isObservable, pending, fulfilled, rejected, noop } from './utils';

export default function observe(observable) {
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
