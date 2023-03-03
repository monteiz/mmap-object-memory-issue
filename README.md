# mmap-object Memory Usage Issue

## Overview

This repository contains a test application that demonstrates a memory usage issue with the npm package [mmap-object](https://github.com/allenluce/mmap-object), as reported in this [GitHub issue](https://github.com/allenluce/mmap-object/issues/39).

The `loadMasterFile()` function in `index.js` loads a large text file into memory using `mmap-object` and logs the memory usage details. The text file is assumed to be ASCII encoded, and as such, it should take only one byte for each character.

## Problem

The `mmap-object` library is taking up more memory than expected. For larger files, the library can take up to three or four times more memory than the original file size.

## Steps to Reproduce

1. Clone this repository: `git clone https://github.com/monteiz/mmap-object-memory-issue.git`
2. Enter the directory: `cd mmap-object-memory-issue`
3. Install dependencies with `npm install`
4. Run the application with `npm run start`
5. Check the memory usage details logged in the console

## Expected Behaviour

The `loadMasterFile()` function should load the text file into memory using `mmap-object`, and log the memory usage details. The memory usage should be proportional to the size of the file (in bytes).

## Actual Behaviour

The `mmap-object` library is taking up more memory than expected. For larger files, the library can take up to three or four times more memory than the original file size.

## Dependencies

This application requires the following dependencies:

- fs
- readline
- mmap-object
- buffer

## License

This code is released under the MIT license.
