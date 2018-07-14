import { SVELTE_OBSERVABLE } from './utils';

export default function subscribe({ changed, current }) {
  // Load subscriptions from component
  // (if none found, assume first run and attach destroy listener to unsubscribe)
  let subscriptions = this[SVELTE_OBSERVABLE];
  if (!subscriptions) {
    subscriptions = this[SVELTE_OBSERVABLE] = {};
    this.on('destroy', () => unsubscribe(this));
  }

  // Check for observables and subscribe / unsubscribe as-needed
  for (const key in changed) {
    const value = current[key];
    const is_observable = value && value[SVELTE_OBSERVABLE];
    const previous = subscriptions[key];

    if (previous && (is_observable || previous.value !== value)) {
      // Observable was overwritten, unsubscribe
      previous.unsubscribe();
    }

    if (is_observable) {
      subscriptions[key] = createSubscription(this, key, value);
    }
  }
}

function createSubscription(component, key, observer) {
  // Subscribe to changes
  // - First change, resolve initial deferred value
  // - Subsequent changes, set on component
  const observable = observer[SVELTE_OBSERVABLE];
  const subscription = { value: observer, unsubscribe: null };
  let initial = false;

  const replace = value => {
    if (initial) {
      observer.resolve(value);
      initial = false;
    } else {
      subscription.value = value;
      component.set({ [key]: value });
    }
  };

  const { unsubscribe } = observable.subscribe({
    next: value => replace(Promise.resolve(value)),
    error: error => replace(Promise.reject(error))
  });
  subscription.unsubscribe = unsubscribe;

  return subscription;
}
