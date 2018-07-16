import { SVELTE_OBSERVABLE, nonenumerable } from './utils';
import unsubscribe from './unsubscribe';

export default function subscribe({ changed, current, previous }) {
  // Load subscriptions from component
  // (if none found, assume first run and attach destroy listener to unsubscribe)
  let subscriptions = this[SVELTE_OBSERVABLE];
  if (!subscriptions) {
    nonenumerable(this, SVELTE_OBSERVABLE, {});
    subscriptions = this[SVELTE_OBSERVABLE];

    this.on('destroy', () => unsubscribe(this));
  }

  // Check for observables and subscribe / unsubscribe as-needed
  for (const key in changed) {
    const value = current[key];
    const observable = value && value[SVELTE_OBSERVABLE];
    const previous_observable =
      previous && previous[key] && previous[key][SVELTE_OBSERVABLE];

    if (observable && observable === previous_observable) {
      continue;
    }

    const existing = subscriptions[key];
    if (existing) {
      // Observable was overwritten, unsubscribe
      existing.unsubscribe();
    }

    if (observable) {
      subscriptions[key] = createSubscription(this, key, value);
    }
  }
}

function createSubscription(component, key, observer) {
  // Subscribe to changes
  // - First change, resolve initial deferred value
  // - Subsequent changes, set on component
  const observable = observer[SVELTE_OBSERVABLE];
  let resolved = false;

  const replace = value => {
    if (!resolved && observer.resolve) {
      resolved = true;
      observer.resolve(value);
    } else {
      // Continue exposing underlying observable on set values
      nonenumerable(value, SVELTE_OBSERVABLE, observable);
      component.set({ [key]: value });
    }
  };

  const subscription = observable.subscribe({
    next: value => replace(Promise.resolve(value)),
    error: error => replace(Promise.reject(error))
  });

  return subscription;
}
