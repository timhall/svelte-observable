import { isObservable, deferred, SVELTE_OBSERVABLE } from './utils';

export default function observe(value) {
  if (!isObservable(value)) return value;

  // Return a deferred Promise that will resolve to the initial observable value
  // and subsequently be replaced with additional values
  //
  // (wait until subscribe to kick off observable)
  const wrapped = deferred();
  wrapped[SVELTE_OBSERVABLE] = value;

  return wrapped;
}
