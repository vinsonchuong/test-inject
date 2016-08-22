class Dependencies {
  constructor(manifest) {
    this.tearDowns = [];
    for (const [name, {setUp, tearDown}] of Object.entries(manifest)) {
      Reflect.defineProperty(this, name, {
        get() {
          const dependency = setUp();
          this.tearDowns.push(() => tearDown(dependency));
          return dependency;
        }
      });
    }
  }

  tearDown() {
    for (const tearDown of this.tearDowns) {
      tearDown();
    }
  }
}

export default (manifest) => (test) => (...args) => {
  const dependencies = new Dependencies(manifest);
  try {
    test(...args, dependencies);
  } finally {
    dependencies.tearDown();
  }
};
