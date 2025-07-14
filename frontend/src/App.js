import React, { useEffect, useState } from 'react';
import { Box, ChakraProvider, extendTheme, Flex, useColorModeValue } from '@chakra-ui/react';
import NavBar from './components/NavBar';
import SavedPositions from './components/SavedPositions';
import Settings from './components/Settings';
import LogPanel from './components/LogPanel';
import RobotViewer from './components/RobotViewer';
import MoveRobot from './components/MoveRobot';
import ProgramMovement from './components/ProgramMovement';
import api from './services/api';

const theme = extendTheme({
  config: { initialColorMode: 'light', useSystemColorMode: false },
});

const AppLayout = ({ children, jointPositions, robotStatus, currentView, setCurrentView }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex direction="column" height="100vh" bg={bgColor}>
      <NavBar onSelect={setCurrentView} current={currentView} status={robotStatus} />
      <Flex flex="1" direction={{ base: 'column', md: 'row' }} overflow="hidden">
        {/* LEFT SIDE (dynamic views) */}
        <Box flex="1" overflowY="auto" p={4}>
          {children}
        </Box>

        {/* RIGHT SIDE (fixed or stacked RobotViewer) */}
        <Box
          width={{ base: '100%', md: '400px' }}
          p={4}
          bg={bgColor}
          borderTop={{ base: '1px solid', md: 'none' }}
          borderLeft={{ base: 'none', md: '1px solid' }}
          borderColor={borderColor}
        >
          <RobotViewer jointPositions={jointPositions} />
        </Box>
      </Flex>
    </Flex>
  );
};

const App = () => {
  const [jointPositions, setJointPositions] = useState([0, 0, 0, 0, 0, 0]);
  const [robotStatus, setRobotStatus] = useState(null);
  const [currentView, setCurrentView] = useState('moveRobot');

  useEffect(() => {
    const fetchStatus = () => {
      api.getRobotStatus()
        .then((res) => setRobotStatus(res.data))
        .catch(() => setRobotStatus(null));
    };

    const fetchPositions = () => {
      api.getSavedPositions()
        .then((res) => {
          const saved = res.data.positions;
          if (saved && Object.values(saved).length > 0) {
            const firstPos = Object.values(saved)[0];
            setJointPositions(firstPos);
          }
        })
        .catch(() => console.error('Failed to fetch positions'));
    };

    fetchStatus();
    fetchPositions();
    const interval = setInterval(() => {
      fetchStatus();
      fetchPositions();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'moveRobot':
        return <MoveRobot />;
      case 'savedPositions':
        return <SavedPositions />;
      case 'settings':
        return <Settings />;
      case 'logPanel':
        return <LogPanel />;
      case 'programMovement':
        return <ProgramMovement />;
      default:
        return <MoveRobot />;
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <AppLayout
        jointPositions={jointPositions}
        robotStatus={robotStatus}
        currentView={currentView}
        setCurrentView={setCurrentView}
      >
        {renderView()}
      </AppLayout>
    </ChakraProvider>
  );
};

export default App;
