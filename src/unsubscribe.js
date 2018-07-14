import { SVELTE_OBSERVABLE } from './utils';

export default function unsubscribe(component) {
  component = component || this;

  const subscriptions = component[SVELTE_OBSERVABLE];
  if (!subscriptions) return;

  for (const key in subscriptions) {
    subscriptions[key].unsubscribe();
  }

  component[SVELTE_OBSERVABLE] = null;
}
