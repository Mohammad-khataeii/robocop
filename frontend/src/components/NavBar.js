import React from 'react';
import {
  Flex,
  HStack,
  Heading,
  Button,
  Text,
  Badge,
  useColorMode,
  Icon,
} from '@chakra-ui/react';
import {
  StarIcon,
  SettingsIcon,
  ViewIcon,
  InfoOutlineIcon,
} from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const MotionButton = motion(Button);

const NavBar = ({ onSelect, current, status }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const navItems = [
    { key: 'savedPositions', label: 'Saved Positions', icon: StarIcon },
    { key: 'settings', label: 'Settings', icon: SettingsIcon },
    { key: 'logPanel', label: 'Log Panel', icon: InfoOutlineIcon },
    { key: 'robotViewer', label: 'Viewer', icon: ViewIcon },
  ];

  return (
    <Flex
      as="nav"
      bg="white"
      _dark={{ bg: 'gray.800' }}
      px={4}
      py={3}
      align="center"
      justify="space-between"
      shadow="md"
      wrap="wrap"
    >
      <HStack spacing={6} align="center">
        <Heading size="md">🤖 RoboCop</Heading>
        {status && (
          <HStack spacing={3}>
            <Badge colorScheme={status.connected ? 'green' : 'red'}>
              {status.connected ? 'Connected' : 'Disconnected'}
            </Badge>
            <Text fontSize="sm">Mode: {status.mode}</Text>
            <Text fontSize="sm">Status: {status.status}</Text>
          </HStack>
        )}
      </HStack>

      <HStack spacing={3} mt={{ base: 3, md: 0 }}>
        {navItems.map((item) => (
          <MotionButton
            key={item.key}
            variant={current === item.key ? 'solid' : 'ghost'}
            colorScheme="blue"
            size="sm"
            onClick={() => onSelect(item.key)}
            leftIcon={<Icon as={item.icon} />}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.label}
          </MotionButton>
        ))}
        <MotionButton
          onClick={toggleColorMode}
          size="sm"
          whileHover={{ rotate: 20 }}
          whileTap={{ rotate: -20 }}
        >
          {colorMode === 'light' ? '🌙' : '☀️'}
        </MotionButton>
      </HStack>
    </Flex>
  );
};

export default NavBar;
