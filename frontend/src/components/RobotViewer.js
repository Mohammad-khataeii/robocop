import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import api from '../services/api';

const jointNames = [
  'Shoulder_7',
  'Elbow_6',
  'Wrist01_5',
  'Wrist02_4',
  'Wrist03_3',
];

const jointConfigs = [
  { axis: 'z' },
  { axis: 'y' },
  { axis: 'y' },
  { axis: 'x' },
  { axis: 'y' },
];

const RobotModel = ({ jointPositions }) => {
  const { scene, nodes } = useGLTF('/models/ur3e1.glb');
  const currentRotations = useRef(jointNames.map(() => 0));

  useEffect(() => {
    console.log('🛠 Loaded GLB nodes:', Object.keys(nodes));
  }, [nodes]);

  const orderedRotations = useMemo(
    () => jointNames.map((name) => jointPositions[name] || 0),
    [jointPositions]
  );

  useFrame((state, delta) => {
    jointNames.forEach((joint, idx) => {
      const node = nodes[joint];
      if (node) {
        const axis = jointConfigs[idx].axis;
        const target = orderedRotations[idx];
        const current = currentRotations.current[idx];
        const lerped = current + (target - current) * Math.min(10 * delta, 1);
        currentRotations.current[idx] = lerped;
        node.rotation[axis] = lerped;
      }
    });
  });

  return <primitive object={scene} scale={1.0} />;
};

const RobotViewer = () => {
  const [jointPositions, setJointPositions] = useState({});

  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const fetchStatus = () => {
    api
      .getRobotStatus()
      .then((res) => {
        setJointPositions(res.data.current_position || {});
      })
      .catch((err) => console.error('❌ Failed to fetch robot status', err));
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      fetchStatus();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      p={{ base: 2, md: 4 }}
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius={{ base: 'md', md: 'lg' }}
      boxShadow="md"
      w={{ base: '100%', md: '100%' }}
      h={{ base: '300px', md: '500px' }}
      overflow="hidden"
    >
      <Canvas style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <RobotModel jointPositions={jointPositions} />
        <OrbitControls />
      </Canvas>
    </Box>
  );
};

export default RobotViewer;
