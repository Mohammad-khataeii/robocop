import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

const LogPanel = () => {
  const [logs, setLogs] = useState([
    'System initialized.',
    'Awaiting robot commands...',
  ]);

  return (
    <Box p={4} bg="white" _dark={{ bg: 'gray.700' }} rounded="lg" shadow="md">
      <Heading size="md" mb={4}>📜 Log Panel</Heading>
      <VStack align="start" spacing={2} maxH="200px" overflowY="auto">
        {logs.map((log, idx) => (
          <Text key={idx} fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }}>
            {log}
          </Text>
        ))}
      </VStack>
    </Box>
  );
};

export default LogPanel;
