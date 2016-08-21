import register from 'test-inject';

describe('test-inject', () => {
  it('can inject dependencies into a test case and tear them down afterwards', () => {
    const fooSpy = jasmine.createSpy('foo');
    const barSpy = jasmine.createSpy('bar');
    const testSpy = jasmine.createSpy('test');

    const {inject} = register({
      foo: {
        setUp: () => fooSpy,
        tearDown: (foo) => foo()
      },
      bar: {
        setUp: () => barSpy,
        tearDown: (bar) => bar()
      }
    });

    const wrappedTest = inject((foo, bar) => {
      testSpy(foo, bar);
    });

    expect(fooSpy).not.toHaveBeenCalled();
    expect(barSpy).not.toHaveBeenCalled();
    expect(testSpy).not.toHaveBeenCalled();

    wrappedTest();

    expect(fooSpy).toHaveBeenCalled();
    expect(barSpy).toHaveBeenCalled();
    expect(testSpy).toHaveBeenCalledWith(fooSpy, barSpy);
  });
});
