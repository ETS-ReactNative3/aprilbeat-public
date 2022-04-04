import React from "react";
import { extend, useThree } from "@react-three/fiber";
import { ReactThreeFiber } from '@react-three/fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
        }
    }
}

extend({ OrbitControls });

export default function Controls(props) {
    const { camera, gl } = useThree();
    return (
        <orbitControls attach={"orbitControls"} args={[camera, gl.domElement]} />
    )
}