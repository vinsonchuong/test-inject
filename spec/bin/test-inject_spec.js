import {childProcess} from 'node-promise-es6';

describe('test-inject', () => {
  it('outputs "3...2...1...Hello World!"', async () => {
    const {stdout} = await childProcess.exec('test-inject');
    expect(stdout.trim()).toBe('3...2...1...Hello World!');
  });
});
