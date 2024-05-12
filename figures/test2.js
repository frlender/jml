


function Wheel(props) {
  return <body name="wheel" pos={[-.07, props.y, 0]} 
    zaxis="0 1 0">
    <joint name=""/>
    <geom class="wheel"/>
    <site class="decor" size=".006 .025 .012"/>
    <site class="decor" size=".025 .006 .012"/>
  </body>
}

export default function Car() {
  const y = .06
  return <mujoco>
    ...
    <worldbody>
      <Light />
      ...
      <Wheel name='left' y={y}/>
      <Wheel name='right' y={-y}/>
    </worldbody>
    ...
  </mujoco>
}


function Light(){
  return <>
    <light name="top light" ... />
    <light name="front light" ... />
  </>
}

export default function Car() {
  const y = .06
  return <mujoco>
    ...
    <worldbody>
      <Light />
      ...
    </worldbody>
    ...
  </mujoco>
}

