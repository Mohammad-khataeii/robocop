import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import api from '../services/api';

const SavedPositions = () => {
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getSavedPositions()
      .then((res) => {
        const data = res.data.positions || {};
        const formatted = Object.entries(data).map(([name, joints]) => ({
          name,
          joints,
        }));
        setPositions(formatted);
      })
      .catch(() => setError('Failed to fetch saved positions'));
  }, []);

  return (
    <Box p={4} bg="white" _dark={{ bg: 'gray.700' }} rounded="lg" shadow="md">
      <Heading size="md" mb={4}>💾 Saved Positions</Heading>

      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}

      {positions.length === 0 ? (
        <Text color="gray.500" _dark={{ color: 'gray.300' }}>No saved positions found.</Text>
      ) : (
        <List spacing={2}>
          {positions.map((pos, idx) => (
            <ListItem key={idx} fontSize="sm">
              <strong>{pos.name}</strong>: {pos.joints.join(', ')}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SavedPositions;
