import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import api from '../services/api';

const MoveRobot = () => {
  const [positions, setPositions] = useState([0, 0, 0, 0, 0, 0]);
  const [duration, setDuration] = useState(5);
  const [speed, setSpeed] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    api.moveRobot({ positions, duration, speed })
      .then((res) => {
        setMessage(res.data.message);
        setError('');
      })
      .catch(() => {
        setError('Failed to send move command');
        setMessage('');
      });
  };

  const handleStop = () => {
    api.stopRobot()
      .then((res) => {
        setMessage(res.data.message);
        setError('');
      })
      .catch(() => {
        setError('Failed to send stop command');
        setMessage('');
      });
  };

  return (
    <Flex minH="100vh" align="center" justify="center" px={4} bg="gray.50" _dark={{ bg: 'gray.800' }}>
      <Box
        w="100%"
        maxW={{ base: '100%', sm: '90%', md: '600px' }}
        p={{ base: 4, md: 6 }}
        minH={{ base: 'auto', md: '400px' }}
        maxH="90vh"
        overflowY="auto"
        bg="white"
        _dark={{ bg: 'gray.700' }}
        rounded="lg"
        shadow="md"
      >
        <Heading size="md" mb={4} textAlign="center">
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
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
              {positions.map((pos, idx) => (
                <FormControl key={idx}>
                  <FormLabel fontSize="sm">Joint {idx + 1}</FormLabel>
                  <Input
                    type="number"
                    step="0.1"
                    value={pos}
                    onChange={(e) => {
                      const newPos = [...positions];
                      newPos[idx] = parseFloat(e.target.value);
                      setPositions(newPos);
                    }}
                  />
                </FormControl>
              ))}
            </SimpleGrid>

            <FormControl>
              <FormLabel fontSize="sm">Duration (s)</FormLabel>
              <Input
                type="number"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Speed (0–1)</FormLabel>
              <Input
                type="number"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
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
      </Box>
    </Flex>
  );
};

export default MoveRobot;
