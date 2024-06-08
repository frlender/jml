
// defaults.js
const foo = {length:.5, radius:.3}
const bar = {length:.3, radius:.1}

export {foo,bar}

// Component.js
import {foo,bar} from './defaults.js'

export default function Component(){
  return <link name="link1">
      <visual>
        <geometry>
            <cylinder {...foo}/>
        </geometry>
      </visual>
      <visual>
        <geometry>
            <cylinder {...bar}/>
        </geometry>
      </visual>
    </link>
}





// defaults2.js
const baz = {density:800}
const foo = _.defaults({size:1},baz)
const bar = _.defaults({length:2, density:500},baz)

export {foo,bar}



// Component.js
import {foo,bar} from './defaults.js'

classContext = React.createContext()

function Cylinder(props){
  const classVal= React.useContext(classContext)
  props = _.defaults(props,classVal)
  return <visual>
    <geometry>
        <cylinder {...props}/>
    </geometry>
  </visual>
}

export default function Component(){
  return <link name="link1">
      <classContext.Provider value={foo}>
        <Cylinder />
        <Cylinder length={.2} />
        <Cylinder {...bar} />
      </classContext.Provider>
    </link>
}

// Model.js
const defaults = {
  geom: {rgba: [1 0 0 1]},
  joint: {damping: .03, actuatorfrcrange: "-0.5 0.5"}
}
function Model(){
  ...
  return <mujoco>
    ...
  </mujoco>
}
export default {defaults,Model} 




// Component.js
const _ = require('lodash')
classContext = React.createContext()

function Cylinder(props){
  const classVal= React.useContext(classContext)
  props = _.defaults(props,classVal)
  return <visual>
      <geometry>
        <cylinder {...props}/>
      </geometry>
    </visual>
}

export default function Component(){
  const foo = {length:.5, radius:.3}
  const bar = {length:.3, radius:.1}  
  return <link name="link1">
      <classContext.Provider value={foo}>
        <Visual />
        <Visual length={.2} />
        <Visual {...bar} />
      </classContext.Provider>
    </link>
}


// Component2.js
...
function Cylinder(props){
  const classVal= React.useContext(classContext)
  props = _.defaults(props,classVal)
  return <geometry>
        <cylinder {...props}/>
    </geometry>
}

function Visual(props){
  return <Cylinder {...props} />
}

export default function Component2({scale}){
  const foo = {length:.5*scale, radius:.3*scale}
  const bar = {length:.3*scale, radius:.1*scale}  
  return <link name="link1">
      <classContext.Provider value={foo}>
        <Visual />
        <Visual length={.2} />
        <Visual {...bar} />
      </classContext.Provider>
    </link> bar
}



