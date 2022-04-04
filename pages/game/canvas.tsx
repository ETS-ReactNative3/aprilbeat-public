import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, useAspect } from '@react-three/drei'

import Floor from "@/components/threejs/Floor";
import Rectangle from "@/components/threejs/Rectangle"

export default function TemporaryCanvas(props) {
    

    return (
        <div className={`flex justify-center w-screen h-screen bg-black`}>
            <div className={`max-h-screen aspect-video`}>
                <Canvas
                    shadows={true}
                    className={`bg-[#262626]`}
                    camera={{
                        position: [0, 8, 0],
                    }}
                    frameloop="demand"
                >
                    <Stars />
                    <ambientLight color={"white"} intensity={1} />
                    
                    <mesh position={[0, 0, 0]}>
                        <Rectangle position={[0, -1, 0]} size={[30, 0, 7]} color={`#EEEDEE`} />


                        <Rectangle position={[0, 0, -3.1]} size={[30, 0, 0.2]} color={`#A3A2AE`} />
                        <Rectangle position={[0, 0, 3.1]} size={[30, 0, 0.2]} color={`#A3A2AE`} />

                        <Rectangle position={[0, 0, 1]} size={[30, 0, 0.07]} color={`#706581`} />
                        <Rectangle position={[0, 0, -1]} size={[30, 0, 0.07]} color={`#706581`} />

                        <Rectangle position={[-8.5, 0, 0]} size={[0.15, 0, 6]} color={`#663C6A`} />
                        {/* <OrbitControls /> */}
                    </mesh>
                </Canvas>
            </div>
        </div>
    )
}