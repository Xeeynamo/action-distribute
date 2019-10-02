## Creating an action

An action can be created using JavaScript or with a Docker image.

This repository will use JavaScript

### Prerequisites

* Node.js 12.x
* A GitHub repository with the pushed content

### Initialization

Run `npm init -y`, then `touch action.yml` to create an an empty action description.

Creating an action in JavaScript requires the two NPM packages `@actions/core` and `@actions/github`.

### The action itself

Add `const core = require('@actions/core')` to import the core mechanics of GitHub actions.

In order to retrieve an input parameter, `core.getInput` has to be called. The returned value is always a string.
```
core.getInput('MY_INPUT')
```

In order to specify an output, call `core.setOutput`:
```
core.setOutput('MY_OUTPUT', VALUE)
```

### Set-up typescript

```
npm i typescript --save-dev
npx tsc --init
npm i @octokit/graphql --save
```

Then change `"outDir": "dist"` and `"rootDir": "./src"` in `tsconfig.json`.

### Set-up jest

```
npm i @types/jest @types/node jest jest-circus ts-jest --save-dev
```

### Set-up the compiler

In order to use TypeScript and avoid to commit the entire node_modules folder, we need to build 

### Before pushing

In order to run the GitHub action correctly, the `node_modules` folder needs to be pushed. `.gitignore` should not reference it.

## Using an action

### Action definition [(source)](https://help.github.com/en/articles/about-actions#versioning-your-action)

```
steps:
  - uses: GITHUB_ACCOUNT/REPOSITORY@VERSION
```

The version can be one of the following values:
 * Branch name (eg. `@master`)
 * Commit hash (eg. `@b4dc0ff33`)
 * Tag (eg. `@release/v1.0`)

Example:

```
steps:
  - uses: energyhelpline/build@2
```