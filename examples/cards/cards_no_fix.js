const fs = require('fs').promises;
const path = require('path');
const _ = require('lodash');
const em = require('exact-math');

import ys from './ys.js'

function Card({material,x,y,z,angle}) {
  return <body pos={[x,y,z]} euler={[angle,180,0]}>
    <freejoint/>
    <geom class="card" material={material}/>
    <geom class="collision"/>
  </body>
}

export default async function Cards() {
  const assetDir = path.join(__dirname, 'assets')
  const files = await fs.readdir(assetDir)
  const filesSort = _.sortBy(files,
      file=>file.replace('10',':'))
    .filter(file=>file !== 'card.obj' &&
      file !== "red_joker.png")
      
  const materials = filesSort.map(file =>{
    const cardname = file.replace('.png', '')
    return <>
      <texture type="2d" file={file}/>
      <material name={cardname} texture={cardname}/>
      <newline />
    </>})

  const cards = filesSort.map((file,i) => {
    const cardname = file.replace('.png', '')
    const x = em.formula(`${i}*.005`)
    const y = ys[i]
    const z = em.formula(`${i}*-.005`)
    const angle = -100+i*-3
    return <>
        <Card material={cardname} 
          x={x} y={y} z={z} angle={angle}/>
        <newline />
      </>
  })

  console.log(cards.length)

  // console.log(cards)
  // console.log(filesSort)
//   const xml = fs.readFileSync(path.join(__dirname, 'cards.xml'), 'utf8');
  return <mujoco>
    {/* <compiler assetdir="assets"/>

    <size memory="5M"/>

    <statistic extent="0.5" center="0 -.5 0"/>

    <visual>
      <map znear="0.1" zfar="10"/>
      <quality shadowsize="8192"/>
    </visual> */}

    <option density="1.225" viscosity="1.8e-5" timestep="1e-3" integrator="implicitfast"/>
    <asset>
      <texture name="grid" type="2d" builtin="checker" rgb1=".1 .2 .3" rgb2=".2 .3 .4" width="100" height="100"/>
      <material name="grid" texture="grid" texrepeat="8 8" texuniform="true" reflectance=".2"/>
      <mesh file="card.obj"/>
      <newline></newline>
      {materials}
    </asset>
    <worldbody>
      {cards}
    </worldbody>
  </mujoco>
}