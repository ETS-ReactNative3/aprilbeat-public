import React from "react";

export default function Lightbulb(props) {
    return (
        <mesh {...props} >
            <pointLight castShadow />
            <sphereBufferGeometry args={[0.2, 30, 10]} />
            <meshPhongMaterial emissive={"yellow"} />
        </mesh>
    );
}