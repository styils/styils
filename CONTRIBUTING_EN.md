# Contributing to Styil

Welcome and thanks for your interest! Before submitting a pull request, please take a moment to review these guidelines.

## Reporting Issues

Found a problem? Want a new feature?

- See if your issue or idea has [already been reported].
- Provide a [reduced test case] or a [live example].

## Submitting Pull Requests

Before doing local development, make sure you have Node.js >= 14 and pnpm installed in your development environment.

Follow the steps below to develop

1. To begin: [fork this project], clone your fork.

   ```bash
   # clone the repository
   git@github.com:**path**/styil.git

   # Navigate to the newly cloned directory
   cd styil

   # Install the tools necessary for testing
   pnpm install

   # Enter the development mode, the browser accesses localhost
   pnpm dev
   ```

2. Create a branch for your feature or fix:

   ```bash
   # Move into a new branch for your feature
   git checkout -b feature/thing
   ```

   ```bash
   # Move into a new branch for your fix
   git checkout -b fix/something
   ```

3. If your code passes all the tests, then push your feature branch:

   ```bash
   # Test current code
   pnpm run test # or npm test

   # Build current code
   pnpm run build # or npm run build
   ```

   > Note: ensure your version of Node is 14 or higher to run scripts

   ```bash
   # Push the branch for your new feature
   git push origin feature/thing
   ```

   ```bash
   # Or, push the branch for your update
   git push origin update/something
   ```

That’s it! Now [open a pull request] with a clear title and description.

[already been reported]: https://github.com/l-zoy/styil/issues
[fork this project]: https://github.com/l-zoy/styil/fork
[live example]: https://codesandbox.io/
[open a pull request]: https://help.github.com/articles/using-pull-requests/
[reduced test case]: https://css-tricks.com/reduced-test-cases/
