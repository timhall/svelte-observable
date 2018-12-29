import Observable from 'zen-observable';
import { readable } from 'svelte/store';
import { load, check, tick } from '../__helpers__';
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

it('should flatten stores', async () => {
  let store = Store.of(1, 2, 3);
  let flattened = flat(store);
  let values = await load(flattened, 3);

  expect(values).toEqual([1, 2, 3]);

  store = readable(async set => {
    set(Store.of(1, 2, 3));
    await tick(1);
    set(Store.of(4, 5, 6));
    await tick(1);
    set(Store.of(7, 8, 9));
  });
  flattened = flat(store);
  values = await load(flattened, 5);

  expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

it('should flatten observables', async () => {
  let observable = Observable.of(1, 2, 3);
  let flattened = flat(observable);

  let values = await load(flattened);
  let states = await check(values);

  expect(states[0].pending).toBe(true);
  expect(states[1].value).toEqual(1);
  expect(states[2].value).toEqual(2);
  expect(states[3].value).toEqual(3);

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

  expect(states).toMatchSnapshot();
});
