import test from 'ava';
import Observable from 'zen-observable';
import { load, check } from './helpers';
import { observe } from '../';

test('should have initial pending value', async t => {
  const observable = Observable.of(1, 2, 3);
  const store = observe(observable);

  const values = await load(store);
  const states = await check(values);

  t.true(states[0].pending);
});

test('should have fulfilled values', async t => {
  const observable = Observable.of(1, 2, 3);
  const store = observe(observable);

  const values = await load(store);
  const states = await check(values);

  t.snapshot(states);
});

test('should have rejected error values', async t => {
  const observable = new Observable(observer => {
    observer.error(new Error('Uh oh.'));
  });
  const store = observe(observable);

  const values = await load(store);
  const states = await check(values);

  t.true(states[1].rejected);
  t.is(states[1].error.message, 'Uh oh.');
});

test('should have readable passthrough if not Observable', async t => {
  const store = observe(4);

  const values = await load(store);
  t.is(values[0], 4);
});
