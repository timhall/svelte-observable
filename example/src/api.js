import Observable from 'zen-observable';

export function list() {
  return new Observable(observer => {
    const changing = setInterval(() => {
      observer.next(Math.random());
    }, 250);

    return () => clearInterval(changing);
  });
}

export function search(query) {
  return new Observable(observer => {
    const timer = setTimeout(() => {
      if (query === 'error') {
        observer.error(new Error('Entered "error"'));
      } else {
        observer.next(query);
        observer.complete();
      }
    }, 250);

    return () => clearTimeout(timer);
  });
}
