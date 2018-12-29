import test from 'ava';
import Observable from 'zen-observable';
import { readable } from 'svelte/store';
import { load, check, tick } from './helpers';
import { flat } from '../';

const Store = {
  of(initial, ...values) {
    return readable(set => {
      (async () => {
        for (const value of values) {
          await tick();
          set(value);
        }
      })();
    }, initial);
  }
};

test('should flatten stores', async t => {
  let store = Store.of(1, 2, 3);
  let flattened = flat(store);
  let values = await load(flattened, 3);

  t.deepEqual(values, [1, 2, 3]);

  store = readable(async set => {
    set(Store.of(1, 2, 3));
    await tick(1);
    set(Store.of(4, 5, 6));
    await tick(1);
    set(Store.of(7, 8, 9));
  });
  flattened = flat(store);
  values = await load(flattened, 5);

  t.deepEqual(values, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('should flatten observables', async t => {
  let observable = Observable.of(1, 2, 3);
  let flattened = flat(observable);

  let values = await load(flattened);
  let states = await check(values);

  t.snapshot(states);

  observable = new Observable(async observer => {
    observer.next(Observable.of(1, 2, 3));
    await tick();
    observer.next(Observable.of(4, 5, 6));
    await tick();
    observer.next(Observable.of(7, 8, 9));
  });
  flattened = flat(observable);

  values = await load(flattened, 5);
  states = await check(values);

  t.snapshot(states);
});
