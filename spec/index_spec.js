import register from 'test-inject';

describe('test-inject', () => {
  it('can inject async dependencies', async () => {
    const fooSpy = jasmine.createSpy('foo');
    const barSpy = jasmine.createSpy('bar');
    const testSpy = jasmine.createSpy('test');

    const inject = register({
      foo: {
        setUp() {
          return Promise.resolve(fooSpy);
        },
        tearDown(foo) {
          Promise.resolve().then(foo);
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

    const wrappedTest = inject(async (arg, {foo, bar}) => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      testSpy(arg, await foo, bar);
    });

    expect(fooSpy).not.toHaveBeenCalled();
    expect(barSpy).not.toHaveBeenCalled();
    expect(testSpy).not.toHaveBeenCalled();

    await wrappedTest(42);

    expect(fooSpy).toHaveBeenCalled();
    expect(barSpy).toHaveBeenCalled();
    expect(testSpy).toHaveBeenCalledWith(42, fooSpy, barSpy);
  });
});
