import Observable from 'zen-observable';
import observe from '../observe';
import { SVELTE_OBSERVABLE } from '../utils';

it('should return deferred', () => {
  const observable = Observable.of(1, 2, 3);
  const observer = observe(observable);

  expect(isDeferred(observer)).toBe(true);
});

it('should set observable on observer', () => {
  const observable = Observable.of(1, 2, 3);
  const observer = observe(observable);

  expect(observer[SVELTE_OBSERVABLE]).toBe(observable);
});

it('should pass value through if not Observable', () => {
  const value = {};
  expect(observe(value)).toBe(value);
});

function isDeferred(value) {
  return (
    value &&
    typeof value.resolve === 'function' &&
    typeof value.reject === 'function'
  );
}
