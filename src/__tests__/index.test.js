import Observable from 'zen-observable';
import { observe } from '../';

it('should have initial pending value', async () => {
  const observable = Observable.of(1, 2, 3);
  const store = observe(observable);

  const values = await load(store);
  const states = await state(values);

  expect(states[0].pending).toBe(true);
});

it('should have fulfilled values', async () => {
  const observable = Observable.of(1, 2, 3);
  const store = observe(observable);

  const values = await load(store);
  const states = await state(values);

  expect(states[1].fulfilled).toBe(true);
  expect(states[1].value).toEqual(1);
  expect(states[2].fulfilled).toBe(true);
  expect(states[2].value).toEqual(2);
  expect(states[3].fulfilled).toBe(true);
  expect(states[3].value).toEqual(3);
});

it('should have rejected error values', async () => {
  const observable = new Observable(observer => {
    observer.error(new Error('Uh oh.'));
  });
  const store = observe(observable);

  const values = await load(store);
  const states = await state(values);

  expect(states[1].rejected).toBe(true);
  expect(states[1].error.message).toEqual('Uh oh.');
});

it('should have readable passthrough if not Observable', async () => {
  const store = observe(4);

  const values = await load(store);

  expect(values[0]).toEqual(4);
});

async function load(store) {
  const values = [];
  store.subscribe(value => {
    values.push(value);
  });
  await tick();

  return values;
}

function state(promise) {
  if (Array.isArray(promise)) {
    return Promise.all(promise.map(state));
  }

  return Promise.race([promise, Promise.resolve('(pending)')])
    .then(value => {
      if (value === '(pending)') return { pending: true };
      else return { fulfilled: true, value };
    })
    .catch(error => {
      return { rejected: true, error };
    });
}

function tick() {
  return new Promise(resolve => {
    process.nextTick(resolve);
  });
}
