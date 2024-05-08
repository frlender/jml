// https://medium.com/simform-engineering/how-to-implement-ssr-server-side-rendering-in-react-18-e49bc43e9531
// require("ignore-styles");
require("@babel/register")({
    ignore: [/(node_modules)/],
    presets: ["@babel/preset-env", 
              "@babel/preset-react"]
  });

const fs = require("fs");
const path = require("path");
const pkg = require('./package.json');
const { spawnSync } = require('child_process');
const _ = require('lodash');
const yargs = require('yargs');


const argv = yargs
  .usage(`Usage: path -e <extension> -p <prefix function> \n
                  path: to the .js file of a component.                      [default: ./Model.js]`)
  .version(pkg.version)
  .option("e", { alias: "ext", default:'xml', 
                  describe: "Extension of the output file", type: "string"})
  .option("p", { alias: "prefix", default:'(p,n)=>`${p}_${n}`', 
                  describe: "A JavaScript arrow function that defines how to add prefix to a name. p is the prefix. n is the name.", type: "string"})
  .option('w',{alias:'watch',default:false,describe:'Watch the directory (not recursive) of path for any change of .js files. Generate new output files on change.',type:'boolean'})
  .option('r',{alias:'watch-recursive',default:false,describe:'Similar to --watch but watch the directory recursively.',type:'boolean'})
  .epilogue('Example: node $0 ./model.js -e xml -p "(p,n)=>`${p}_${n}`"')
  .parse();


argv._[0] = (argv._.length > 0) ? argv._[0] : './Model.js'

const input_file = argv._[0]
const pathInfo = path.parse(input_file)


const func = require("./serve2");
// const { on } = require("events");
func(argv)
if(argv.watch || argv.watchRecursive){
  console.log(`Watching ${pathInfo.dir} for changes of .js files:`)
  // use debounce here because docker container will call this function twice for each file change.
  // https://stackoverflow.com/questions/62568294/nodejs-fs-watch-inside-docker-container-detects-changes-twice
  const onFileChange = _.debounce(function(event,filename){
      // console.log(path.parse(filename))
      const ext = path.parse(filename).ext
      if(ext === '.js' || ext === '.mjs'){
        console.log(event,filename)
        const child = spawnSync('node',[argv.$0,
          input_file, '-e', argv.ext, '-p', argv.prefix])
        // console.log(child.stdout)
        // console.log(child.stderr)
        // console.log(child.error)
      }
  },300)
  fs.watch(pathInfo.dir,{recursive:argv.watchRecursive},
    onFileChange)
}

