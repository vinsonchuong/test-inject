class Dependencies {
  constructor(manifest) {
    this.tearDowns = [];
    for (const [name, {setUp, tearDown}] of Object.entries(manifest)) {
      Reflect.defineProperty(this, name, {
        get() {
          const dependency = setUp();
          this.tearDowns.push(async () => tearDown(await dependency));
          return dependency;
        }
      });
    }
  }

  async tearDown() {
    for (const tearDown of this.tearDowns) {
      await tearDown();
    }
  }
}

export default (manifest) => (test) => async (...args) => {
  const dependencies = new Dependencies(manifest);
  try {
    await test(...args, dependencies);
  } finally {
    await dependencies.tearDown();
  }
};
