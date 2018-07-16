import { SVELTE_OBSERVABLE, nonenumerable } from './utils';

export default function unsubscribe(component) {
  component = component || this;

  const subscriptions = component[SVELTE_OBSERVABLE];
  if (!subscriptions) return;

  for (const key in subscriptions) {
    subscriptions[key].unsubscribe();
  }

  nonenumerable(component, SVELTE_OBSERVABLE, null);
}
