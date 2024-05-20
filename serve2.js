
import React from "react";

const consoleWarn = console.warn;
const SUPPRESSED_WARNINGS = ['Each child in a list'];

console.warn = function filterWarnings(msg, ...args) {
    console.log('warnllll',msg)
    if (!SUPPRESSED_WARNINGS.some((entry) => msg.includes(entry))) {
        consoleWarn(msg, ...args);
    }
};


global.React = React;

const _createConext = React.createContext
React.createContext = (val)=>{
    const ctx = _createConext(val)
    ctx.vals = [val]
    return ctx
}
React.useContext = (ctx)=>ctx.vals.at(-1)

// console.log(global)


// require('fs')
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const {XMLBuilder,XMLParser} = require("fast-xml-parser");
import xmlFormat from 'xml-formatter';

module.exports = function(argv){

// console.log(argv)

const input_file = argv._[0]
const pathInfo = path.parse(input_file)

// console.log(path.parse(input_file).name)

if('prefix' in argv)
    argv.p = argv.prefix
const prefix_func = 'p' in argv ? eval(argv.p) : (p,n)=>`${p}_${n}`

if('ext' in argv)
    argv.e = argv.ext
const ext = 'e' in argv ? argv.e : 'xml'


import(input_file).then(module => {
    console.log(module)
    async function parse(){
    const App = _.values(module)
                .filter(x=>_.isFunction(x))[0]
    console.log(App,'||', typeof(App),'||',App(),'||',<App/>)
    // const AppObj = <App/>
    // App().then(obj=>{
    //     console.log(obj.type)
    // })
    // const rootTag = AppObj.type(AppObj.props).type
    const rootTag = (await App()).type
    // const rootTag = 'a'
    // console.log('out',rootTag)
    // console.log(<App/>)
    const builder = new XMLBuilder({
        ignoreAttributes: false,
        suppressBooleanAttributes: false,
        preserveOrder: true
    });
    
    // console.log(React.version)
    
    // function Foo(props){
    //     const b = 'abc'
    //     const rx = ['a', 'b', 'c'].map((x,i) => <div key={i}>{x}</div>)
    //     return <div c={props.c}>{rx}</div>;
    // }
    
    // function App() {
    //     const a = 5
    //     return <div x={a}><Foo c={10}/></div>;
    // }
    const root = []
    const isContext = (nodeType)=>_.isObject(nodeType) 
        && '_context' in nodeType

    async function hdlChildren(children,parent,ctx){
        // console.log('\\\\','\n',children)
        if(_.isString(children) || _.isNumber(children))
            parent.push({'#text': children.toString()})
        else if(_.isArray(children))
            // must use for loop here. map or foreach does not work.
            // They will not await for the execution of the current
            // function before executing the next.
            for(const child of children){
                await hdlChildren(child,parent,ctx)
            }
        else
            await iter(children,parent,ctx)
}
    
    async function iter(node,parent,ctx){
        // console.log('===========================================')
        // console.log(node.type,'||',typeof(node.type),'||'
        // ,node.props,ctx,typeof(ctx))

        if(_.isArray(node)){
            node.map(x=>iter(x,parent,ctx))
            return
        }
    
        if(!_.isFunction(node.type)){
            if(_.isSymbol(node.type) || isContext(node.type)){
                if(isContext(node.type))
                    node.type._context.vals.push(node.props.value)

                if('children' in node.props)
                    await hdlChildren(node.props.children,parent,ctx)
                // if('children' in node.props && 
                //     !_.isString(node.props.children)){
                //     if(_.isArray(node.props.children))
                //         node.props.children.map(x=>iter(x,parent,ctx))
                //     else
                //         iter(node.props.children,parent,ctx)
                // }

                if(isContext(node.type))
                    node.type._context.vals.pop()

                // node.props.children.map(x=>iter(x,parent,ctx))
            }else{
                // if(!parent[node.type])
                //     parent[node.type] = []
                const props = node.props ? {...node.props} : {}
                if(module.defaults && (node.type in module.defaults)){
                    for(const key in module.defaults[node.type]){
                        if(key in props) continue
                        props[key] = 
                            module.defaults[node.type][key]
                    }
                    // console.log(props)
                }
                const item = {}
                item[node.type] = []
                if(_.keys(props).length > 0){
                    for(let key in props){
                        if(key === 'children') continue
                        if(!(':@' in item))
                            item[':@'] = {}
                        let val = props[key]
                        // if ctx is '', no prefix is added.
                        if(key === 'name' && ctx)
                            // if val is '', only show prefix.
                            val = val === '' ? ctx : prefix_func(ctx,val)
                        if(_.isArray(val))
                            val = val.join(' ')
                        item[':@'][`@_${key}`] = val
                    }
                    if('children' in node.props ){
                        await hdlChildren(node.props.children,
                            item[node.type],ctx)
                        // if(_.isString(node.props.children) ||
                        //     _.isNumber(node.props.children)){
                        //     item[node.type].push(
                        //         {'#text': node.props.children.toString()})
                        // }else if(_.isArray(node.props.children))
                        //     if(_.some(node.props.children,
                        //         x=>!(_.isObject(x) && 'type' in x)))
                        //         item[node.type].push(
                        //             {'#text': node.props.children.join(' ')})
                        //     else
                        //         node.props.children.map(x=>iter(x,item[node.type],ctx))
                        // else
                        //     iter(node.props.children,item[node.type],ctx)
                    }
                }
                parent.push(item)
            }
            // console.log(node.type)
        }else
            await iter(await node.type(node.props),parent,
                node.props.name)
    }
    
    await iter(<App/>,root)
    // console.log(JSON.stringify(root))
    // console.log(builder.build(root))
    
    // console.log(App())
    // console.log(App())
    
    // console.log(_.isString(<App/>.type))
    // console.log(iter(<App/>))
    
    // const html = renderToString(<App/>);
    // console.log(html);
    // console.log(root)
    const xml = builder.build(root)
    // console.log(xml)
    let wstr = xmlFormat(xml,{
        'collapseContent': true,
        'forceSelfClosingEmptyTag': true,
    })
    if(rootTag === 'sdf' || rootTag === "robot")
        wstr = '<?xml version="1.0" ?>\n'+wstr
    wstr = wstr.replaceAll('<newline/>','')
    fs.writeFileSync(path.join(pathInfo.dir,
        `${pathInfo.name}.${ext}`), wstr);

    // const xmlData = `
    //     <section id='abc'>
    //         <h1></h1>
    //         <h1>def</h1>
    //         <section>
    //             <h2>ghi</h2>
    //         </section>
    //         <h1>jkl</h1>
    //     </section>
    // `
    // const parser = new XMLParser({
    //       preserveOrder: true,
    //       ignoreAttributes: false,
    //   });
    // const result = parser.parse(xmlData);
    // console.log(JSON.stringify(result))
    }
    parse()
})

}


