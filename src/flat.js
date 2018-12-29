import { readable } from 'svelte/store';
import { isObservable, pending, fulfilled, rejected } from './utils';
import observe from './observe';

export default function flat(store) {
  const is_observable = isObservable(store);

  return readable(
    set => {
      let inner_unsubscribe;
      let outer_unsubscribe;

      const fulfill = is_observable
        ? value => set(fulfilled(value))
        : value => set(value);

      function next(value) {
        if (inner_unsubscribe) inner_unsubscribe();
        if (isObservable(value)) value = observe(value);

        if (isStore(value)) {
          inner_unsubscribe = value.subscribe(inner => fulfill(inner));
        } else {
          fulfill(value);
        }
      }
      function error(err) {
        set(rejected(err));
      }

      if (is_observable) {
        const subscription = store.subscribe({ next, error });
        outer_unsubscribe = () => subscription.unsubscribe();
      } else {
        outer_unsubscribe = store.subscribe(next);
      }

      return () => {
        if (inner_unsubscribe) inner_unsubscribe();
        outer_unsubscribe();
      };
    },
    is_observable ? pending() : undefined
  );
}

function isStore(value) {
  return value && typeof value.subscribe === 'function';
}
