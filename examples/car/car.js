
function Decor(){
    return <>
        <site class="decor" size=".006 .025 .012"/>
        <site class="decor" size=".025 .006 .012"/>
    </>
}

function Wheel(props) {
    return <body name="wheel" pos={[-.07, props.y, 0]} 
      zaxis="0 1 0">
        <joint name=""/>
        <geom class="wheel"/>
        <Decor/>
    </body>
}

function Fixed({coefs}){
    return <fixed name="">
        <joint joint="left" coef={coefs[0]}/>
        <joint joint="right" coef={coefs[1]}/>
    </fixed>
}

export default function Car() {
    const y = .06
    const coef = .5
    return <mujoco>
    <compiler autolimits="true"/>

    <asset>
        <texture name="grid" type="2d" builtin="checker" width="512" height="512" rgb1=".1 .2 .3" rgb2=".2 .3 .4"/>
        <material name="grid" texture="grid" texrepeat="1 1" texuniform="true" reflectance=".2"/>
        <mesh name="chasis" scale=".01 .006 .0015"
            vertex=" 9   2   0
                    -10  10  10
                    9  -2   0
                    10  3  -10
                    10 -3  -10
                    -8   10 -10
                    -10 -10  10
                    -8  -10 -10
                    -5   0   20"/>
    </asset>

    <default>
    <joint damping=".03" actuatorfrcrange="-0.5 0.5"/>
    <default class="wheel">
        <geom type="cylinder" size=".03 .01" rgba=".5 .5 1 1"/>
    </default>
    <default class="decor">
        <site type="box" rgba=".5 1 .5 1"/>
    </default>
    </default>

    <worldbody>
    <geom type="plane" size="3 3 .01" material="grid"/>
    <body name="car" pos="0 0 .03">
        <freejoint/>
        <light name="top light" pos="0 0 2" mode="trackcom" diffuse=".4 .4 .4"/>
        <geom name="chasis" type="mesh" mesh="chasis"/>
        <geom name="front wheel" pos=".08 0 -.015" type="sphere" size=".015" condim="1" priority="1"/>
        <light name="front light" pos=".1 0 .02" dir="2 0 -1" diffuse="1 1 1"/>
        <Wheel name='left' y={y}/>
        <Wheel name='right' y={-y}/>
    </body>
    </worldbody>

    <tendon>
        <Fixed name="forward" coefs={[coef, coef]}/>
        <Fixed name="turn" coefs={[-coef, coef]}/>
    </tendon>

    <actuator>
        <motor name="forward" tendon="forward" ctrlrange="-1 1"/>
        <motor name="turn" tendon="turn" ctrlrange="-1 1"/>
    </actuator>

    <sensor>
        <jointactuatorfrc name="right" joint="right"/>
        <jointactuatorfrc name="left" joint="left"/>
    </sensor>
</mujoco>
}