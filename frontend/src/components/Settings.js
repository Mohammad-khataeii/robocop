import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  VStack,
  HStack,
  useToast,
  useColorModeValue,
  Select,
} from '@chakra-ui/react';
import api from '../services/api';

const Settings = () => {
  const [ipAddress, setIpAddress] = useState('192.168.1.100');
  const [port, setPort] = useState('9090');
  const [duration, setDuration] = useState('5');
  const [speedFactor, setSpeedFactor] = useState('1');
  const [autoHome, setAutoHome] = useState(true);
  const [saveLogs, setSaveLogs] = useState(false);
  const [softLimits, setSoftLimits] = useState(true);
  const [collisionAvoidance, setCollisionAvoidance] = useState(true);
  const toast = useToast();

  const bgBox = useColorModeValue('white', 'gray.800');
  const bgInner = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  useEffect(() => {
    // TODO: load existing settings from backend if needed
  }, []);

  const handleSaveSettings = () => {
    const settings = {
      ipAddress,
      port,
      duration,
      speedFactor,
      autoHome,
      saveLogs,
      softLimits,
      collisionAvoidance,
    };
    api.saveSettings(settings)
      .then(() => {
        toast({
          title: 'Settings Saved',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: 'Failed to save settings',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleEmergencyStop = () => {
    api.stopRobot()
      .then(() => {
        toast({
          title: 'Emergency Stop Triggered',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: 'Failed to send emergency stop',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box p={6} bg={bgBox} rounded="xl" shadow="lg" borderWidth={1} borderColor={borderColor}>
      <Heading size="lg" mb={4} textAlign="center">🔧 Settings</Heading>
      <VStack spacing={4} align="stretch">

        <Box p={4} bg={bgInner} rounded="lg" borderWidth={1} borderColor={borderColor}>
          <Heading size="sm" mb={2}>Robot Connection</Heading>
          <FormControl>
            <FormLabel>IP Address</FormLabel>
            <Input value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
          </FormControl>
          <FormControl mt={2}>
            <FormLabel>Port</FormLabel>
            <Input value={port} onChange={(e) => setPort(e.target.value)} />
          </FormControl>
          <Button mt={2} colorScheme="blue" onClick={() => toast({ title: 'Reconnected', status: 'info', duration: 2000 })}>
            Reconnect to Robot
          </Button>
        </Box>

        <Box p={4} bg={bgInner} rounded="lg" borderWidth={1} borderColor={borderColor}>
          <Heading size="sm" mb={2}>Default Parameters</Heading>
          <FormControl>
            <FormLabel>Default Duration (s)</FormLabel>
            <Input value={duration} onChange={(e) => setDuration(e.target.value)} />
          </FormControl>
          <FormControl mt={2}>
            <FormLabel>Default Speed Factor (0–1)</FormLabel>
            <Input value={speedFactor} onChange={(e) => setSpeedFactor(e.target.value)} />
          </FormControl>
        </Box>

        <Box p={4} bg={bgInner} rounded="lg" borderWidth={1} borderColor={borderColor}>
          <Heading size="sm" mb={2}>Safety Settings</Heading>
          <HStack justify="space-between">
            <FormLabel mb="0">Soft Limits</FormLabel>
            <Switch isChecked={softLimits} onChange={(e) => setSoftLimits(e.target.checked)} />
          </HStack>
          <HStack justify="space-between">
            <FormLabel mb="0">Collision Avoidance</FormLabel>
            <Switch isChecked={collisionAvoidance} onChange={(e) => setCollisionAvoidance(e.target.checked)} />
          </HStack>
          <Button mt={2} colorScheme="red" onClick={handleEmergencyStop}>
            🚨 Emergency Stop
          </Button>
        </Box>

        <Box p={4} bg={bgInner} rounded="lg" borderWidth={1} borderColor={borderColor}>
          <Heading size="sm" mb={2}>Startup & Logging</Heading>
          <HStack justify="space-between">
            <FormLabel mb="0">Auto-home on Startup</FormLabel>
            <Switch isChecked={autoHome} onChange={(e) => setAutoHome(e.target.checked)} />
          </HStack>
          <HStack justify="space-between">
            <FormLabel mb="0">Save Movement Logs</FormLabel>
            <Switch isChecked={saveLogs} onChange={(e) => setSaveLogs(e.target.checked)} />
          </HStack>
        </Box>

        <Button colorScheme="green" onClick={handleSaveSettings}>
          💾 Save Settings
        </Button>
      </VStack>
    </Box>
  );
};

export default Settings;
