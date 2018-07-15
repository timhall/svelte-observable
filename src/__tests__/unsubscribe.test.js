import { SVELTE_OBSERVABLE } from '../utils';
import unsubscribe from '../unsubscribe';

it('should unsubscribe existing subscriptions', () => {
  const a = { unsubscribe: jest.fn() };
  const b = { unsubscribe: jest.fn() };

  const component = {
    [SVELTE_OBSERVABLE]: { a, b }
  };

  unsubscribe(component);

  expect(a.unsubscribe).toHaveBeenCalled();
  expect(b.unsubscribe).toHaveBeenCalled();
});

it('should remove subscriptions', () => {
  const a = { unsubscribe: jest.fn() };
  const b = { unsubscribe: jest.fn() };

  const component = {
    [SVELTE_OBSERVABLE]: { a, b }
  };

  unsubscribe(component);

  expect(component[SVELTE_OBSERVABLE]).toBeNull();
});

it('should be callable with this = component', () => {
  const a = { unsubscribe: jest.fn() };
  const b = { unsubscribe: jest.fn() };

  const component = {
    [SVELTE_OBSERVABLE]: { a, b }
  };

  unsubscribe.call(component);

  expect(a.unsubscribe).toHaveBeenCalled();
  expect(b.unsubscribe).toHaveBeenCalled();
});

it('should not fail for no subscriptions', () => {
  expect(() => unsubscribe({})).not.toThrow();
});
