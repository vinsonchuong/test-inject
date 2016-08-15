function parameterNames(fn) {
  const [, names] = fn.toString().match(/^.*?\((.*?)\)/);
  return names.split(/\s*,\s*/).filter(Boolean);
}

export default function(dependencies) {
  return (test) => {
    const testDependencies = parameterNames(test)
      .map((name) => {
        const {setUp, tearDown} = dependencies[name];
        const value = setUp();
        return {
          value,
          tearDown: () => tearDown(value)
        };
      });

    return () => {
      try {
        test(...testDependencies.map(({value}) => value));
      } finally {
        testDependencies.forEach(({tearDown}) => {
          tearDown();
        });
      }
    };
  };
}
