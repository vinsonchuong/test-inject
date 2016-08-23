# test-inject
[![Build Status](https://travis-ci.org/vinsonchuong/test-inject.svg?branch=master)](https://travis-ci.org/vinsonchuong/test-inject)

Automatic dependency injection for test cases.

## Installing
`test-inject` is available as an
[npm package](https://www.npmjs.com/package/test-inject).

## Usage
```js
import test from 'ava';
import inject from 'test-inject';
import Directory from 'directory-helpers';

const {inject} = register({
  src: {
    setUp() {
      return new Directory('src');
    },
    async tearDown(src) {
      await src.remove();
    }
  },
  spec: {
    setUp() {
      new Directory('spec');
    },
    async tearDown(spec) {
      await spec.remove();
    }
  }
});

test('it works', inject((t, {src}) => {
  await src.write({'index.js', "console.log('Hello World!')"});
  test.is(await src.read('index.js'), "console.log('Hello World!')");
}))
```

`setUp` is called only for the requested dependencies, their return values
being injected into the test. Note that if `setUp` is `async` or returns a
`Promise`, the test will have to `await` its resolution.

## Development
### Getting Started
The application requires the following external dependencies:
* Node.js

The rest of the dependencies are handled through:
```bash
npm install
```

Run tests with:
```bash
npm test
```
