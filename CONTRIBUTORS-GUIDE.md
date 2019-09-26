# Contributing to the Split Evaluator

Split Evaluator is an open source project and we welcome feedback and contribution. Find below information about how to build the project with your changes, how to run the tests and how to send the PR.

## Development

### Development process

1. Fork the repository and create a topic branch from `development` branch. Please use a descriptive name for your branch.
2. While developing, use descriptive messages in your commits. Avoid short or meaningless sentences like "fix bug".
3. Make sure to add tests for both positive and negative cases.
4. <if applicable> Run the linter script of the project and fix any issues you find.
5. Run the build script and make sure it runs with no errors.
6. Run all tests and make sure there are no failures.
7. `git push` your changes to GitHub within your topic branch.
8. Open a Pull Request(PR) from your forked repo and into the `development` branch of the original repository.
9. When creating your PR, please fill out all the fields of the PR template, as applicable, for the project.
10. Check for conflicts once the pull request is created to make sure your PR can be merged cleanly into `development`.
11. Keep an eye out for any feedback or comments from Split's SDK team.

### Building the Split Evaluator
#### Usage with NodeJs
If you're just trying to run the Node app, run `npm install` on the root of the project. No extra build steps needed.

#### Docker
If you want to build a Docker Image, you need to execute the following command at root folder:
`docker build -t splitsoftware/split-evaluator:X.X.X .`

### Running tests
You can run `npm run test` for running all the unit tests placed in the project.

### Linting and other useful checks
If you want to check linting, you can run `npm run lint`.

# Contact
If you have any other questions or need to contact us directly in a private manner send us a note at sdks@split.io.