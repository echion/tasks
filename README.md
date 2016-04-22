# Echion Tasks Service

[![Circle CI](https://circleci.com/gh/echion/tasks.svg?style=shield)](https://circleci.com/gh/echion/tasks)
[![Coverage Status](https://coveralls.io/repos/github/echion/tasks/badge.svg?branch=master)](https://coveralls.io/github/echion/tasks?branch=master)
[![Apache 2.0](https://img.shields.io/badge/license-Apache%20License%202.0-blue.svg)](https://raw.githubusercontent.com/echion/tasks/master/LICENSE)


## Local Setup

To setup a local dev workstation, refer to the [Tools setup](https://github.com/echion/tools).

## Builds

npm is used as the task runner and the package defines various commands in the package.json. To view a help listing for all defined commands, run the following:

```
npm run info
```

To run all linting tools, tests, and code coverage, run the `npm test` command.

## CI/CD

The CI/CD pipeline is hosted in CircleCI and is largely defined by the `circle.yml` file.  The basic sequence of the pipeline is:
- build the CI test environment
- run tests (`npm test`)
- push code coverage reports to coveralls
- run the build/deploy-ecs.sh script

The final step builds the docker containers and pushes the containers to AWS ECS.


## Delete database

To delete the neo4j database, execute the following command:
```
rm -rf data/graph.db
```
