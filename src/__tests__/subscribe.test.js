import Observable from 'zen-observable';
import { SVELTE_OBSERVABLE } from '../utils';
import subscribe from '../subscribe';

const changed = { a: 1 };

it('should create subscriptions and destroy listener on first call', () => {
  const component = createComponent();
  subscribe.call(component, { changed: {}, current: {} });

  expect(component[SVELTE_OBSERVABLE]).toBeDefined();
  expect(component.on).toHaveBeenCalled();
  expect(component.on.mock.calls[0][0]).toEqual('destroy');
});

it('should subscribe to Observable', () => {
  const component = createComponent();
  const { observer, subscription } = createObserver();

  subscribe.call(component, { changed, current: { a: observer } });

  expect(observer[SVELTE_OBSERVABLE].subscribe).toHaveBeenCalled();
  expect(component[SVELTE_OBSERVABLE].a).toBe(subscription);
});

it('should reuse matching Observable', () => {
  const component = createComponent();
  const { observer, subscription } = createObserver();

  subscribe.call(component, { changed, current: { a: observer } });

  expect(observer[SVELTE_OBSERVABLE].subscribe).toHaveBeenCalled();
  expect(component[SVELTE_OBSERVABLE].a).toBe(subscription);

  const updated = {};
  updated[SVELTE_OBSERVABLE] = observer[SVELTE_OBSERVABLE];
  subscribe.call(component, {
    changed,
    current: { a: updated },
    previous: { a: observer }
  });

  expect(subscription.unsubscribe).not.toHaveBeenCalled();
  expect(component[SVELTE_OBSERVABLE].a).toBe(subscription);
});

it('should unsubscribe from changed Observable', () => {
  const component = createComponent();
  const { observer, subscription } = createObserver();

  subscribe.call(component, { changed, current: { a: observer } });

  const replaced = createObserver();
  subscribe.call(component, {
    changed,
    current: { a: replaced.observer },
    previous: { a: observer }
  });

  expect(subscription.unsubscribe).toHaveBeenCalled();
  expect(replaced.observer[SVELTE_OBSERVABLE].subscribe).toHaveBeenCalled();
  expect(component[SVELTE_OBSERVABLE].a).toBe(replaced.subscription);
});

it('should resolve observer on initial value', async () => {
  const component = createComponent();
  const observable = Observable.of(1);
  const { observer } = createObserver(observable);

  subscribe.call(component, { changed, current: { a: observer } });
  await nextTick();

  await expect(observer.resolve.mock.calls[0][0]).resolves.toEqual(1);
});

it('should set on component on subsequent values', async () => {
  const component = createComponent();
  const observable = Observable.of(1, 2);
  const { observer } = createObserver(observable);

  subscribe.call(component, { changed, current: { a: observer } });
  await nextTick();

  expect(component.set).toHaveBeenCalled();
  await expect(component.set.mock.calls[0][0].a).resolves.toEqual(2);
});

function createComponent() {
  return {
    on: jest.fn(),
    set: jest.fn()
  };
}

function createObserver(observable) {
  const subscription = { unsubscribe: jest.fn() };
  const observer = {
    resolve: jest.fn(),
    reject: jest.fn(),
    [SVELTE_OBSERVABLE]: observable || {
      subscribe: jest.fn(() => subscription)
    }
  };

  return { subscription, observer };
}

async function nextTick() {
  // Should finish after micro-tasks of Observable
  return new Promise(resolve => {
    process.nextTick(() => resolve());
  });
}
