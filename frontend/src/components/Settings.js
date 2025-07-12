import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const Settings = () => {
  return (
    <Box p={4} bg="white" _dark={{ bg: 'gray.700' }} rounded="lg" shadow="md" textAlign="center">
      <Heading size="md" mb={2}>🔧 Settings</Heading>
      <Text color="gray.500" _dark={{ color: 'gray.300' }}>
        Advanced settings (coming soon!)
      </Text>
    </Box>
  );
};

export default Settings;
