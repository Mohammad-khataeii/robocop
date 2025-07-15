import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  VStack,
  Button,
  Select,
  Text,
  useToast,
  HStack,
  Tag,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';
import api from '../services/api';

const ProgramMovement = () => {
  const [savedPositions, setSavedPositions] = useState([]);
  const [flow, setFlow] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [currentPosition, setCurrentPosition] = useState({});
  const [editedJoints, setEditedJoints] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const toast = useToast();

  const bgBox = useColorModeValue('white', 'gray.800');
  const bgInner = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    api.getSavedPositions()
      .then((res) => {
        const raw = res.data.positions || {};
        const parsed = Object.entries(raw).map(([name, positions]) => ({
          name,
          positions,
        }));
        setSavedPositions(parsed);
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to load saved positions.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });

    api.getRobotStatus()
      .then((res) => {
        setCurrentPosition(res.data.current_position || {});
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to load current position.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, []);

  const addToFlow = () => {
    if (selectedPosition) {
      const pos = savedPositions.find((p) => p.name === selectedPosition);
      if (pos) {
        const newPos = {
          name: pos.name,
          positions: pos.positions.map((p, idx) =>
            editedJoints[idx] !== undefined && editedJoints[idx] !== ''
              ? parseFloat(editedJoints[idx])
              : p
          ),
        };
        setFlow([...flow, newPos]);
        setEditedJoints({});
      }
    }
  };

  const removeFromFlow = (index) => {
    const newFlow = [...flow];
    newFlow.splice(index, 1);
    setFlow(newFlow);
  };

  const runFlow = async () => {
    if (flow.length === 0) {
      toast({
        title: 'Flow is empty',
        description: 'Please add positions to the flow before running.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsRunning(true);
    for (const pos of flow) {
      try {
        await api.moveRobot({
          positions: pos.positions,
          duration: 5,
          speed: 1,
        });
        toast({
          title: `Moved to ${pos.name}`,
          status: 'info',
          duration: 1500,
          isClosable: true,
        });
        await new Promise((resolve) => setTimeout(resolve, 6000)); 
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed at position ${pos.name}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        break;
      }
    }
    setIsRunning(false);
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bgInner} px={4}>
      <Box w="100%" maxW="500px" p={6} bg={bgBox} rounded="xl" shadow="lg" borderWidth={1} borderColor={borderColor}>
        <Heading size="lg" mb={6} textAlign="center">
          🤖 Program Movement
        </Heading>

        <VStack spacing={4} align="stretch">
          <Select
            placeholder="Select saved position"
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            bg={bgInner}
          >
            {savedPositions.map((pos) => (
              <option key={pos.name} value={pos.name}>
                {pos.name}
              </option>
            ))}
          </Select>

          {Object.keys(currentPosition).length > 0 && (
            <Box>
              <Text fontWeight="bold" mb={2}>Edit Joints:</Text>
              <VStack spacing={2} align="stretch">
                {Object.entries(currentPosition).map(([joint, value], idx) => (
                  <Input
                    key={joint}
                    placeholder={value.toFixed(3)}
                    value={editedJoints[idx] !== undefined ? editedJoints[idx] : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditedJoints({
                        ...editedJoints,
                        [idx]: val,
                      });
                    }}
                    bg={bgInner}
                    _placeholder={{ opacity: 0.6 }}
                  />
                ))}
              </VStack>
            </Box>
          )}

          <Button
            onClick={addToFlow}
            colorScheme="blue"
            isDisabled={!selectedPosition}
          >
            ➕ Add to Flow
          </Button>

          <Box p={3} borderWidth={1} borderColor={borderColor} rounded="lg" bg={bgInner}>
            <Text fontWeight="bold" mb={2}>
              Current Flow:
            </Text>
            {flow.length === 0 ? (
              <Text fontSize="sm">No positions added.</Text>
            ) : (
              flow.map((pos, idx) => (
                <HStack key={idx} justify="space-between" mb={1}>
                  <Tag>{pos.name}</Tag>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => removeFromFlow(idx)}
                  >
                    Remove
                  </Button>
                </HStack>
              ))
            )}
          </Box>

          <Button
            onClick={runFlow}
            colorScheme="green"
            isDisabled={flow.length === 0 || isRunning}
            isLoading={isRunning}
          >
            ▶ Run Flow
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ProgramMovement;
