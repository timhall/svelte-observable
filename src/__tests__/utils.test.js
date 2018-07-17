import { nonenumerable } from '../utils';

describe('nonenumerable', () => {
  it('should set nonenumerable value', () => {
    const test = {};

    test.a = 1;
    nonenumerable(test, 'b', 2);

    expect(Object.keys(test)).toEqual(['a']);
  });

  it('should be configurable and writable', () => {
    const test = {};

    nonenumerable(test, 'a', 1);

    expect(() => {
      nonenumerable(test, 'a', 2);
      test.a = 3;
    }).not.toThrow();
  });
});
