
import React from "react";

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
    // console.log(module)
    const App = module.default
    // console.log('App',App())
    const AppObj = <App/>
    const rootTag = AppObj.type(AppObj.props).type
    // console.log(rootTag)
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

    
    function iter(node,parent,ctx){
        // console.log('===========================================')
        // console.log(node.type,'||',typeof(node.type),'||'
        // ,node.props,ctx,typeof(ctx))
    
        if(!_.isFunction(node.type)){
            if(_.isSymbol(node.type) || isContext(node.type)){
                if(isContext(node.type))
                    node.type._context.vals.push(node.props.value)

                if('children' in node.props && 
                    !_.isString(node.props.children)){
                    if(_.isArray(node.props.children))
                        node.props.children.map(x=>iter(x,parent,ctx))
                    else
                        iter(node.props.children,parent,ctx)
                }

                if(isContext(node.type))
                    node.type._context.vals.pop()

                // node.props.children.map(x=>iter(x,parent,ctx))
            }else{
                // if(!parent[node.type])
                //     parent[node.type] = []
                const item = {}
                item[node.type] = []
                if('props' in node){
                    for(let key in node.props){
                        if(key === 'children') continue
                        if(!(':@' in item))
                            item[':@'] = {}
                        let val = node.props[key]
                        // if ctx is '', no prefix is added.
                        if(key === 'name' && ctx)
                            // if val is '', only show prefix.
                            val = val === '' ? ctx : prefix_func(ctx,val)
                        if(_.isArray(val))
                            val = val.join(' ')
                        item[':@'][`@_${key}`] = val
                    }
                    if('children' in node.props ){
                        // function handleChild(arr,child){

                        // }
                        if(_.isString(node.props.children) ||
                            _.isNumber(node.props.children)){
                            item[node.type].push(
                                {'#text': node.props.children.toString()})
                        }else if(_.isArray(node.props.children))
                            if(_.some(node.props.children,
                                x=>!(_.isObject(x) && 'type' in x)))
                                item[node.type].push(
                                    {'#text': node.props.children.join(' ')})
                            else
                                node.props.children.map(x=>iter(x,item[node.type],ctx))
                        else
                            iter(node.props.children,item[node.type],ctx)
                    }
                }
                parent.push(item)
            }
            // console.log(node.type)
        }else
            iter(node.type(node.props),parent,
                node.props.name)
    }
    
    iter(<App/>,root)
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
        'collapseContent': true
    })
    if(rootTag === 'sdf')
        wstr = '<?xml version="1.0" ?>\n'+wstr
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
    
})

}


