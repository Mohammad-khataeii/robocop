import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';

// Define distinct colors for each joint
const jointColors = ['orange', 'red', 'green', 'blue', 'purple', 'cyan'];

// Joint component with color + label
const Joint = ({ index, rotation }) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z = rotation[index]; // adjust axis if needed
    }
  });

  return (
    <group ref={ref} position={[0, index * 1.2, 0]}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 1, 32]} />
        <meshStandardMaterial color={jointColors[index % jointColors.length]} />
      </mesh>
      <Html
        position={[0.3, 0.5, 0]}
        style={{
          background: 'rgba(255,255,255,0.85)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '10px',
          color: '#333',
          boxShadow: '0 0 2px rgba(0,0,0,0.5)',
        }}
      >
        Joint {index + 1}
      </Html>
    </group>
  );
};

// Full robot arm group
const RobotArm = ({ jointPositions }) => (
  <group>
    {[...Array(6)].map((_, idx) => (
      <Joint key={idx} index={idx} rotation={jointPositions} />
    ))}
  </group>
);

const RobotViewer = ({ jointPositions }) => {
  return (
    <Canvas style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <RobotArm jointPositions={jointPositions} />
      <OrbitControls />
    </Canvas>
  );
};

export default RobotViewer;
