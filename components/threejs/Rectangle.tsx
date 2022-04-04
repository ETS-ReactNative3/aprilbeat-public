import React from "react";

export default function Rectangle({ position, size, color = 'white' }) {
  return (
    <mesh position={position}>
      <boxBufferGeometry args={size} />
      <meshPhysicalMaterial color={color} />
    </mesh>
  );
}