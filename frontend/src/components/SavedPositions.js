import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Alert,
  AlertIcon,
  Spinner,
  Button,
  HStack,
  Input,
  useToast,
} from '@chakra-ui/react';
import api from '../services/api';

const SavedPositions = () => {
  const [positions, setPositions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedJoints, setEditedJoints] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchPositions = () => {
    api.getSavedPositions()
      .then((res) => {
        const data = res.data.positions || {};
        const formatted = Object.entries(data).map(([name, joints]) => ({
          name,
          joints,
        }));
        setPositions(formatted);
        setError('');
      })
      .catch(() => setError('Failed to fetch saved positions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleDelete = (name) => {
    api.deletePosition(name)
      .then(() => {
        toast({ title: `Deleted ${name}`, status: 'success', duration: 2000, isClosable: true });
        fetchPositions();
      })
      .catch(() => {
        toast({ title: 'Failed to delete', status: 'error', duration: 2000, isClosable: true });
      });
  };

  const handleApply = (joints) => {
    api.moveRobot({ positions: joints, duration: 5, speed: 1 })
      .then(() => {
        toast({ title: 'Position applied', status: 'success', duration: 2000, isClosable: true });
      })
      .catch(() => {
        toast({ title: 'Failed to apply position', status: 'error', duration: 2000, isClosable: true });
      });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedName(positions[index].name);
    setEditedJoints(positions[index].joints.map((j) => j.toFixed(4)));
  };

  const handleSaveEdit = () => {
    const parsedJoints = editedJoints.map((val) => parseFloat(val));
    if (parsedJoints.some(isNaN)) {
      toast({ title: 'Invalid joint values', status: 'error', duration: 2000, isClosable: true });
      return;
    }
    api.savePosition({ name: editedName, positions: parsedJoints })
      .then(() => {
        toast({ title: 'Position updated', status: 'success', duration: 2000, isClosable: true });
        setEditIndex(null);
        fetchPositions();
      })
      .catch(() => {
        toast({ title: 'Failed to update', status: 'error', duration: 2000, isClosable: true });
      });
  };

  return (
    <Box p={4} bg="white" _dark={{ bg: 'gray.700' }} rounded="lg" shadow="md">
      <Heading size="md" mb={4}>💾 Saved Positions</Heading>

      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : positions.length === 0 ? (
        <Text color="gray.500" _dark={{ color: 'gray.300' }}>
          No saved positions found.
        </Text>
      ) : (
        <List spacing={4}>
          {positions.map((pos, idx) => (
            <ListItem key={idx} borderBottom="1px solid" borderColor="gray.200" pb={2}>
              {editIndex === idx ? (
                <Box>
                  <Input
                    size="sm"
                    mb={2}
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  {editedJoints.map((joint, jIdx) => (
                    <Input
                      key={jIdx}
                      size="xs"
                      m={1}
                      width="80px"
                      value={joint}
                      onChange={(e) => {
                        const newJoints = [...editedJoints];
                        newJoints[jIdx] = e.target.value;
                        setEditedJoints(newJoints);
                      }}
                    />
                  ))}
                  <HStack mt={2}>
                    <Button size="sm" colorScheme="green" onClick={handleSaveEdit}>
                      Save
                    </Button>
                    <Button size="sm" onClick={() => setEditIndex(null)}>
                      Cancel
                    </Button>
                  </HStack>
                </Box>
              ) : (
                <Box>
                  <Text fontSize="sm">
                    <strong>{pos.name}</strong>: {pos.joints.map((j) => j.toFixed(4)).join(', ')}
                  </Text>
                  <HStack mt={2}>
                    <Button size="xs" colorScheme="blue" onClick={() => handleApply(pos.joints)}>
                      Apply
                    </Button>
                    <Button size="xs" onClick={() => handleEdit(idx)}>
                      Edit
                    </Button>
                    <Button size="xs" colorScheme="red" onClick={() => handleDelete(pos.name)}>
                      Delete
                    </Button>
                  </HStack>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SavedPositions;
