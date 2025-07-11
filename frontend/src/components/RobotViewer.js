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
    <group ref={ref} position={[0, index * 1, 0]}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 1, 32]} />
        <meshStandardMaterial color={jointColors[index % jointColors.length]} />
      </mesh>
      <Html position={[0.3, 0, 0]}>
        <div style={{ background: 'white', padding: '2px 4px', borderRadius: '4px', fontSize: '10px' }}>
          Joint {index + 1}
        </div>
      </Html>
    </group>
  );
};

// Full arm group
const RobotArm = ({ jointPositions }) => {
  return (
    <group>
      {[...Array(6)].map((_, idx) => (
        <Joint key={idx} index={idx} rotation={jointPositions} />
      ))}
    </group>
  );
};

const RobotViewer = ({ jointPositions }) => {
  return (
    <Canvas style={{ height: '400px', width: '100%' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <RobotArm jointPositions={jointPositions} />
      <OrbitControls />
    </Canvas>
  );
};

export default RobotViewer;
