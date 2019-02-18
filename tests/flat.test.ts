import Observable, { Observer } from 'zen-observable';
import { readable } from 'svelte/store';
import { load, check, tick } from './helpers';
import { flat } from '../src';

type Setter<T> = (value: T) => void;

const Store = {
  of<T>(initial: T, ...values: T[]) {
    return readable((set: Setter<T>) => {
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

  store = readable((set: Setter<any>) => {
    (async () => {
      set(Store.of(1, 2, 3));
      await tick(1);
      set(Store.of(4, 5, 6));
      await tick(1);
      set(Store.of(7, 8, 9));
    })();
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

  expect(states).toMatchSnapshot();

  observable = new Observable(async (observer: Observer) => {
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

it('should have initial value', async () => {
  const observable = new Observable(async (observer: Observer) => {
    observer.next(Observable.of(1, 2, 3));
    await tick();
    observer.next(Observable.of(4, 5, 6));
    await tick();
    observer.next(Observable.of(7, 8, 9));
  });
  const flattened = flat(observable, 0);

  const values = await load(flattened, 5);
  const states = await check(values);

  expect(states).toMatchSnapshot();
});
