function parameters(fn) {
  const [, names] = fn.toString().match(/^.*?\((.*?)\)/);
  return names.split(/\s*,\s*/).filter(Boolean);
}

class DependencyTracker {
  constructor(dependencies) {
    this.dependencies = dependencies;
    this.tearDowns = [];
  }

  setUp(...dependencyNames) {
    const setUpDependencies = [];
    for (const dependencyName of dependencyNames) {
      const {setUp, tearDown} = this.dependencies[dependencyName];
      const dependency = setUp();
      this.tearDowns.push(() => tearDown(dependency));
      setUpDependencies.push(dependency);
    }
    return setUpDependencies;
  }

  tearDownAll() {
    for (const tearDown of this.tearDowns) {
      tearDown();
    }
    this.tearDowns = [];
  }
}

export default function(dependencies) {
  const tracker = new DependencyTracker(dependencies);
  return {
    inject(test) {
      return () => {
        try {
          test(...tracker.setUp(...parameters(test)));
        } finally {
          tracker.tearDownAll();
        }
      };
    }
  };
}
