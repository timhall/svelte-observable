import Observable from 'zen-observable';
import { load, check } from './helpers';
import { observe } from '../';

it('should have fulfilled values', async () => {
  const observable = Observable.of(1, 2, 3);
  const store = observe(observable);

  const values = await load(store);
  const states = await check(values);

  expect(states).toMatchSnapshot();
});

it('should have rejected error values', async () => {
  const observable = new Observable(observer => {
    observer.error(new Error('Uh oh.'));
  });
  const store = observe(observable);

  const values = await load(store);
  const states = await check(values);

  expect(states[0].rejected).toBe(true);
  expect(states[0].error.message).toBe('Uh oh.');
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
