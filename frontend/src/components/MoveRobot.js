import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Alert,
  AlertIcon,
  SimpleGrid,
  useToast,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import api from '../services/api';

const MoveRobot = () => {
  const [positions, setPositions] = useState([]);
  const [currentPositions, setCurrentPositions] = useState([]);
  const [duration, setDuration] = useState('5');
  const [speed, setSpeed] = useState('1');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [askSave, setAskSave] = useState(false);
  const [saveName, setSaveName] = useState('');
  const toast = useToast();

  const bgBox = useColorModeValue('white', 'gray.800');
  const bgInner = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  useEffect(() => {
    api.getRobotStatus()
      .then((res) => {
        const pos = res.data.current_position || [0, 0, 0, 0, 0, 0];
        setPositions(pos.map((p) => p.toFixed(4)));  // set as string
        setCurrentPositions(pos.map((p) => p.toFixed(4)));  // store for placeholder
      })
      .catch(() => {
        console.error('Failed to fetch robot status');
        setPositions(['0', '0', '0', '0', '0', '0']);
        setCurrentPositions(['0', '0', '0', '0', '0', '0']);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedPositions = positions.map((val) => parseFloat(val));
    const parsedDuration = parseFloat(duration);
    const parsedSpeed = parseFloat(speed);

    if (parsedPositions.some(isNaN) || isNaN(parsedDuration) || isNaN(parsedSpeed)) {
      toast({
        title: 'Invalid input',
        description: 'Please make sure all fields have valid numbers.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    api.moveRobot({
      positions: parsedPositions,
      duration: parsedDuration,
      speed: parsedSpeed,
    })
      .then((res) => {
        setMessage(res.data.message || 'Move command sent successfully.');
        setError('');
        setAskSave(true);
      })
      .catch(() => {
        setError('Failed to send move command');
        setMessage('');
      });
  };

  const handleStop = () => {
    api.stopRobot()
      .then((res) => {
        setMessage(res.data.message || 'Emergency stop sent.');
        setError('');
      })
      .catch(() => {
        setError('Failed to send stop command');
        setMessage('');
      });
  };

  const handleSave = () => {
    const parsedPositions = positions.map((val) => parseFloat(val));
    if (!saveName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please provide a name for the saved position.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    api.savePosition({ name: saveName.trim(), positions: parsedPositions })
      .then((res) => {
        toast({
          title: 'Saved',
          description: res.data.message || `Position "${saveName}" saved.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setSaveName('');
        setAskSave(false);
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to save position.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bgInner} px={4}>
      <Box w="100%" maxW="500px" p={6} bg={bgBox} rounded="xl" shadow="lg" borderWidth={1} borderColor={borderColor}>
        <Heading size="lg" mb={6} textAlign="center">
          ⚙️ Move Robot
        </Heading>

        {message && (
          <Alert status="success" mb={4}>
            <AlertIcon />
            {message}
          </Alert>
        )}
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              {positions.map((pos, idx) => (
                <FormControl key={idx}>
                  <FormLabel fontSize="sm">Joint {idx + 1}</FormLabel>
                  <Input
                    type="text"
                    value={pos}
                    placeholder={currentPositions[idx]}
                    bg={bgInner}
                    onChange={(e) => {
                      const newVal = e.target.value;
                      const newPositions = [...positions];
                      if (/^-?\d*\.?\d*$/.test(newVal) || newVal === '') {
                        newPositions[idx] = newVal;
                        setPositions(newPositions);
                      }
                    }}
                  />
                </FormControl>
              ))}
            </SimpleGrid>

            <FormControl>
              <FormLabel fontSize="sm">Duration (s)</FormLabel>
              <Input
                type="text"
                value={duration}
                bg={bgInner}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^-?\d*\.?\d*$/.test(val) || val === '') {
                    setDuration(val);
                  }
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Speed (0–1)</FormLabel>
              <Input
                type="text"
                value={speed}
                bg={bgInner}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^-?\d*\.?\d*$/.test(val) || val === '') {
                    setSpeed(val);
                  }
                }}
              />
            </FormControl>

            <Button colorScheme="blue" type="submit" w="100%">
              Send Move Command
            </Button>
            <Button colorScheme="red" onClick={handleStop} w="100%">
              🚨 Emergency Stop
            </Button>
          </VStack>
        </form>

        {askSave && (
          <Box mt={6} p={4} borderWidth={1} borderColor={borderColor} rounded="lg" bg={bgInner}>
            <Text fontWeight="bold" mb={3}>
              💾 Save This Position
            </Text>
            <FormControl>
              <FormLabel fontSize="sm">Position Name</FormLabel>
              <Input
                placeholder="e.g., HomePosition"
                value={saveName}
                bg={bgInner}
                onChange={(e) => setSaveName(e.target.value)}
              />
            </FormControl>
            <HStack mt={4} justify="flex-end">
              <Button colorScheme="green" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" onClick={() => setAskSave(false)}>
                Cancel
              </Button>
            </HStack>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default MoveRobot;
