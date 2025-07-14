import React from 'react';
import {
  Flex,
  HStack,
  VStack,
  Heading,
  Button,
  Text,
  Badge,
  useColorMode,
  Icon,
  Box,
  Stack,
} from '@chakra-ui/react';
import {
  StarIcon,
  SettingsIcon,
  ViewIcon,
  InfoOutlineIcon,
  RepeatIcon,
  ArrowForwardIcon,
} from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const MotionButton = motion(Button);

const NavBar = ({ onSelect, current, status }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const navItems = [
    { key: 'moveRobot', label: 'Move Robot', icon: ArrowForwardIcon }, // ✅ NEW default page
    { key: 'savedPositions', label: 'Saved Positions', icon: StarIcon },
    { key: 'settings', label: 'Settings', icon: SettingsIcon },
    { key: 'logPanel', label: 'Log Panel', icon: InfoOutlineIcon },
    
    { key: 'programMovement', label: 'Program Movement', icon: RepeatIcon },
  ];

  return (
    <Box as="nav" bg="white" _dark={{ bg: 'gray.800' }} px={4} py={3} shadow="md">
      <Flex
        align={{ base: 'start', md: 'center' }}
        justify="space-between"
        direction={{ base: 'column', md: 'row' }}
      >
        <VStack align="start" spacing={2} w="100%">
          <Heading size="md">🤖 RoboCop</Heading>
          {status && (
            <HStack spacing={3} wrap="wrap">
              <Badge colorScheme={status.connected ? 'green' : 'red'}>
                {status.connected ? 'Connected' : 'Disconnected'}
              </Badge>
              <Text fontSize="sm">Mode: {status.mode}</Text>
              <Text fontSize="sm">Status: {status.status}</Text>
            </HStack>
          )}
        </VStack>

        <Stack
          direction={{ base: 'column', sm: 'row' }}
          spacing={3}
          mt={{ base: 4, md: 0 }}
          w={{ base: '100%', md: 'auto' }}
        >
          {navItems.map((item) => (
            <MotionButton
              key={item.key}
              variant={current === item.key ? 'solid' : 'ghost'}
              colorScheme="blue"
              size="sm"
              w={{ base: '100%', sm: 'auto' }}
              onClick={() => onSelect(item.key)}
              leftIcon={<Icon as={item.icon} />}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </MotionButton>
          ))}
          <MotionButton
            onClick={toggleColorMode}
            size="sm"
            w={{ base: '100%', sm: 'auto' }}
            whileHover={{ rotate: 20 }}
            whileTap={{ rotate: -20 }}
          >
            {colorMode === 'light' ? '🌙' : '☀️'}
          </MotionButton>
        </Stack>
      </Flex>
    </Box>
  );
};

export default NavBar;
