import Observable, { Observer } from 'zen-observable';
import { load, check, Result, Rejected } from './helpers';
import { observe } from '../src';

it('should have fulfilled values', async () => {
  const observable = Observable.of(1, 2, 3);
  const store = observe(observable);

  const values = await load(store);
  const states = await check(values);

  expect(states).toMatchSnapshot();
});

it('should have rejected error values', async () => {
  const observable = new Observable((observer: Observer) => {
    observer.error(new Error('Uh oh.'));
  });
  const store = observe(observable);

  const values = await load(store);
  const states = (await check(values)) as Result<any>[];

  expect((states[0] as Rejected).rejected).toBe(true);
  expect((states[0] as Rejected).error.message).toBe('Uh oh.');
});

it('should have readable passthrough if not Observable', async () => {
  const store = observe(4);

  const values = await load(store);
  expect(values[0]).toBe(4);
});

it('should have initial value', async () => {
  const observable = Observable.of(1, 2, 3);
  const store = observe(observable, 0);

  const values = await load(store);
  const states = await check(values);

  expect(states).toMatchSnapshot();
});
