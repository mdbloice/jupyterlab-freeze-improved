# JupyterLab Freeze Improved

This is an opinionated fork of the JupyterLab Freeze extension ([DataDog/jupyterlab-freeze](https://github.com/DataDog/jupyterlab-freeze)).

It has made the following changes:

1. Cells do not change colour when in Read Only or Frozen mode. The state icons remain however, so that you know each cell's freeze state.
2. Markdown source cannot be viewed in Markdown cells when in Frozen mode, only in Read Only mode.

## What Make These Changes?

As our use case is teaching using Jupyter, we wished to make these changes and therefore this fork was created.

## Synopsis

This extension allows you to make cells read-only or frozen. It provides three buttons:

- Unlock
- Read-Only
- Frozen

For **code cells**:

- _Read Only_: the call can be executed, but its input cannot be changed.
- _Frozen_: the cell cannot be either altered or executed.

For **Markdown cells**:

- _Read Only_: The cell's Markdown source can viewed by double-clicking on it, but it cannot be changed.
- _Frozen_: The cell's Markdown source can **not** be viewed when double-clicking on it.

To change the state of a selected cell, press the corresponding button.

The individual cell's state is stored in its metadata and is applied to the cell if the extension is loaded.

## Requirements

- JupyterLab >= 4.0.0

## Install

**NOTE!** The package is not yet on PyPI and currently cannot be installed. This will be fixed in due course, when testing is complete.

To install the extension, execute:

```bash
pip install jupyterlab_freeze_improved
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupyterlab_freeze_improved
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab_freeze directory
# Install package in development mode
pip install -e "."
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall jupyterlab_freeze
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterlab_freeze` within that folder.

### Testing the extension

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

#### Integration tests

This extension uses [Playwright](https://playwright.dev/docs/intro) for the integration tests (aka user level tests).
More precisely, the JupyterLab helper [Galata](https://github.com/jupyterlab/jupyterlab/tree/master/galata) is used to handle testing the extension in JupyterLab.

More information are provided within the [ui-tests](./ui-tests/README.md) README.

### Packaging the extension

See [RELEASE](RELEASE.md)
