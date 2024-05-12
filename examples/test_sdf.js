

function Box(props){
    // console.log()
    return <model name="box">
        <pose name=''>0 0 0.5 0 0 0</pose>
        <static>false</static>
        <attr>{[0,1,2]}</attr>
        <attr2>{5}</attr2>

        <link name="link">
        </link>

        <joint type="revolute" name="my_joint">
        </joint>

        <plugin filename="libMyPlugin.so" name="my_plugin"/>
    </model>
}

function box(){
    return <a></a>
}


export default function Model(){
    return<sdf version="1.5">
        {/* <Box name='' /> */}
        <Box name='b' />
        {/* <box></box> */}
        <dox></dox>
    </sdf>
}