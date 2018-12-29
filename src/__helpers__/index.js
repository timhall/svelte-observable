export async function load(store, wait) {
  const values = [];
  store.subscribe(value => {
    values.push(value);
  });
  await tick(wait);

  return values;
}

export function check(promise) {
  if (Array.isArray(promise)) {
    return Promise.all(promise.map(check));
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

export function tick(count = 0) {
  if (count === 0) {
    return new Promise(resolve => resolve());
  } else {
    return new Promise(resolve => {
      process.nextTick(resolve);
    }).then(() => (count > 1 ? tick(count - 1) : undefined));
  }
}
