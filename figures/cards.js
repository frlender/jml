
// cards.js
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
...

export default function Cards() {
  const assetDir = path.join(__dirname, 'assets')
  const files = fs.readdirSync(assetDir)
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
    </>
  })
  ...
  return <mujoco>
    ...
    {materials}
    ...
  </mujoco>
}


// cards_async.js
const fs = require('fs').promises;
...

export default async function Cards() {
  const assetDir = path.join(__dirname, 'assets')
  const files = await fs.readdir(assetDir)
  ... files
}


// cards.js
...
const em = require('exact-math');
import ys from './ys.js'

function Card({material,pos,angle}) {
  return <body pos={pos} euler={[angle,180,0]}>
    <freejoint/>
    <geom class="card" material={material}/>
    <geom class="collision"/>
  </body>
}
export default function Cards() {
  ...
  const cards = filesSort.map((file,i) => {
    const cardname = file.replace('.png', '')
    const x = em.formula(`${i}*.005`)
    const y = ys[i]
    const z = em.formula(`${i}*-.005`)
    const angle = -100+i*-3
    return <>
        <Card material={cardname} 
          pos={[x,y,z]} angle={angle}/>
        <newline />
      </>
  })
  return <mujoco>
    ...
    {cards}
    ...
  </mujoco>
}


// ys.js
const ys = [-0.04, -0.037, ..., -0.04]

export default ys


