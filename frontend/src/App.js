import React, { useEffect, useState } from 'react';
import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';
import NavBar from './components/NavBar';
import SavedPositions from './components/SavedPositions';
import Settings from './components/Settings';
import LogPanel from './components/LogPanel';
import RobotViewer from './components/RobotViewer';
import MoveRobot from './components/MoveRobot';
import api from './services/api';

const theme = extendTheme({
  config: { initialColorMode: 'light', useSystemColorMode: false },
});

const App = () => {
  const [jointPositions, setJointPositions] = useState([0, 0, 0, 0, 0, 0]);
  const [robotStatus, setRobotStatus] = useState(null);
  const [currentView, setCurrentView] = useState('savedPositions');

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
      case 'savedPositions':
        return <SavedPositions />;
      case 'settings':
        return <Settings />;
      case 'logPanel':
        return <LogPanel />;
      case 'robotViewer':
        return <RobotViewer jointPositions={jointPositions} />;
      default:
        return <SavedPositions />;
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box p={4}>
        <NavBar onSelect={setCurrentView} current={currentView} status={robotStatus} />
        {renderView()}
        <Box mt={6}>
          <MoveRobot />
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default App;
