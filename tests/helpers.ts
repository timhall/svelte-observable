import { ReadableStore } from '../src/types';

export async function load<T>(
  store: ReadableStore<T>,
  wait?: number
): Promise<T[]> {
  const values: T[] = [];
  store.subscribe(value => {
    values.push(value);
  });
  await tick(wait);

  return values;
}

export type Pending = { pending: true };
export type Fulfilled<T> = { fulfilled: true; value: T };
export type Rejected = { rejected: true; error: Error };
export type Result<T> = Pending | Fulfilled<T> | Rejected;

const PENDING = {};

export function check<T>(
  promises: Array<T | Promise<T>>
): Promise<Array<T | Result<T>>> {
  const results = promises.map(promise => {
    if (!isPromise(promise)) return promise;

    const result = Promise.race([promise, Promise.resolve(PENDING)])
      .then((value: T | typeof PENDING) => {
        if (value === PENDING) return { pending: true };
        else return { fulfilled: true, value };
      })
      .catch(error => {
        return { rejected: true, error };
      }) as Promise<Result<T>>;

    return result;
  }) as Promise<unknown>[];

  return Promise.all(results) as Promise<Array<T | Result<T>>>;
}

export function tick(count = 0): Promise<undefined> {
  if (count === 0) {
    return new Promise(resolve => resolve());
  } else {
    return new Promise(resolve => {
      process.nextTick(resolve);
    }).then(() => (count > 1 ? tick(count - 1) : undefined));
  }
}

function isPromise(value: any): value is Promise<any> {
  return value && typeof value.then === 'function';
}
