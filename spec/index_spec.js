import register from 'test-inject';

describe('test-inject', () => {
  it('can inject dependencies', () => {
    const fooSpy = jasmine.createSpy('foo');
    const barSpy = jasmine.createSpy('bar');
    const testSpy = jasmine.createSpy('test');

    const inject = register({
      foo: {
        setUp() {
          return fooSpy;
        },
        tearDown(foo) {
          foo();
        }
      },
      bar: {
        setUp() {
          return barSpy;
        },
        tearDown(bar) {
          bar();
        }
      }
    });

    const wrappedTest = inject((arg, {foo, bar}) => {
      testSpy(arg, foo, bar);
    });

    expect(fooSpy).not.toHaveBeenCalled();
    expect(barSpy).not.toHaveBeenCalled();
    expect(testSpy).not.toHaveBeenCalled();

    wrappedTest(42);

    expect(fooSpy).toHaveBeenCalled();
    expect(barSpy).toHaveBeenCalled();
    expect(testSpy).toHaveBeenCalledWith(42, fooSpy, barSpy);
  });
});
