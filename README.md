# JML 
**J**avascript-based X**ML** generator for robotic models

## Install

You should have [Node.js](https://nodejs.org/en/download/prebuilt-installer) installed on your computer. The tool is tested on Node.js v18.14.1 and v22.0.0. Any Node.js version in between or above should work.

1. Copy this repository to your computer using either `git clone` or downloading the zip file.
2. Enter into the repository directory using the terminal and run `npm install` to install the dependencies.
3. Run `node index.js ./examples/car/car.js` to generate the `car.xml` file in the `examples/car` directory.

Use `node index.js --help` to see the command line options.

## Docker
If you have docker installed on your system, you can easily run the tool by first pulling the docker image from dockerhub:
```bash
docker pull frlender/jml:latest
```
Then you can run the tool on a model description file by mounting the model file's directory as a volume. Suppose you have a model description file called `model.js` is in your current directory:
```bash
docker run --rm -v `pwd`:/root/models frlender/jml ./models/model.js
```
To use the watch mode:
```bash
docker run --rm --init -v `pwd`:/root/models frlender/jml -w ./models/model.js
```
Check the command line options:
```bash
docker run --rm frlender/jml --help
```
