# Jest bug minimal reproduction example

This repository provides a minimal reproduction for this bug. The bug is that when you run:

```
npm run test
```

You may get an error such as:

```
 FAIL  src/FirstModule.spec.ts
  ● Test suite failed to run

    <some-path>/jest-bug-maybe/node_modules/jest-worker/build/index.js:3
      - phrase: yak shaving
              ^

    SyntaxError: Unexpected token ':'
```

This error does not always show up. There seems to be some sort of problem with the tests running in parallel (see below for a note about how it works with `--runInBand`). Sometimes it passes, but most of the time it fails. I can reliably reproduce at least one failure every 5 times I run the test (often more).

The full output of a failure:

```
$ npm run test

> jest-syntax-error-mock-bug-reproduction-example@1.0.0 test
> jest

 PASS  src/SecondModule.spec.ts
  Module A - works
    ✓ fake test (4 ms)

 FAIL  src/FirstModule.spec.ts
  ● Test suite failed to run

    <some-path>/jest-bug-maybe/node_modules/jest-worker/build/index.js:3
      - phrase: yak shaving
              ^

    SyntaxError: Unexpected token ':'

      at _jestWorker (node_modules/jest-runner/build/testWorker.js:37:16)
```

However, if you run with `--runInBand` there is no error:

```
 $ npm run test -- --runInBand

> jest-syntax-error-mock-bug-reproduction-example@1.0.0 test
> jest "--runInBand"

 PASS  src/SecondModule.spec.ts
  Module A - works
    ✓ fake test (3 ms)

 PASS  src/FirstModule.spec.ts
  Module B - breaks
    ✓ fake test (3 ms)

Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.43 s, estimated 3 s
Ran all test suites.
```

What is particularly confusing to me about this bug is that the "syntax error" is pointing to a line that is _inside_ a string:

```
    <some-path>/jest-bug-maybe/node_modules/jest-worker/build/index.js:3
      - phrase: yak shaving
              ^

    SyntaxError: Unexpected token ':'
```

Which is referring to this variable definition here:

```
const mockFileContents = `
jargon:
  - phrase: yak shaving
    linkTo: https://en.wiktionary.org/wiki/yak_shaving
    aliases:
      - rabbit hole
`;
```

I don't understand why the contents of a string would result in a syntax error inside of jest-worker.

Furthermore, if we change this line:

```ts
jest.spyOn(fs, "readFileSync").mockReturnValue(mockFileContents);
```

inside `src/FirstModule.spec.ts` to be:

```ts
jest.spyOn(fs, "readFileSync").mockReturnValueOnce(mockFileContents);
```

Then the tests pass succesfully consistently. Due to the inconsistent nature of the test, I ran `npm run test` 10 times in a row and did not see a single failure, making me fairly confident this change does indeed fix the problem.
