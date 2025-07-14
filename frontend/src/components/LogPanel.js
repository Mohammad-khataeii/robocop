import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Button,
  HStack,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import api from '../services/api';

const LogPanel = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const toast = useToast();

  const bgBox = useColorModeValue('white', 'gray.700');
  const bgInner = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  const fetchLogs = () => {
    api.getLogs()
      .then((res) => {
        setLogs(res.data.logs || []);
        setLoading(false);
      })
      .catch(() => {
        toast({
          title: 'Failed to fetch logs',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleClearLogs = () => {
    api.clearLogs()
      .then(() => {
        setLogs([]);
        toast({ title: 'Logs cleared', status: 'success', duration: 2000, isClosable: true });
      })
      .catch(() => {
        toast({ title: 'Failed to clear logs', status: 'error', duration: 2000, isClosable: true });
      });
  };

  return (
    <Box p={4} bg={bgBox} rounded="lg" shadow="md" borderWidth={1} borderColor={borderColor}>
      <HStack justify="space-between" mb={2}>
        <Heading size="md">📜 Log Panel</Heading>
        <Button size="sm" colorScheme="red" onClick={handleClearLogs}>
          Clear Logs
        </Button>
      </HStack>
      <Box
        ref={scrollRef}
        maxH="300px"
        overflowY="auto"
        bg={bgInner}
        p={2}
        rounded="md"
        borderWidth={1}
        borderColor={borderColor}
      >
        {loading ? (
          <Spinner />
        ) : logs.length === 0 ? (
          <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.300' }}>
            No logs yet.
          </Text>
        ) : (
          <VStack align="start" spacing={1}>
            {logs.map((log, idx) => (
              <Text key={idx} fontSize="xs" fontFamily="mono" color="gray.600" _dark={{ color: 'gray.300' }}>
                {log}
              </Text>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default LogPanel;
