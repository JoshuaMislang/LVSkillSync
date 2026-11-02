/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence } from 'motion/react';
import { AppProvider, useAppContext } from './AppContext';
import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import Splash from './screens/Splash';
import Login from './screens/Login';
import Register from './screens/Register';
import Main from './screens/Main';
import JobDetails from './screens/JobDetails';
import Chat from './screens/Chat';
import Calculator from './screens/Calculator';
import Settings from './screens/Settings';
import FreelancerProfile from './screens/FreelancerProfile';
import ConfirmationModals from './components/ConfirmationModals';

function AppContent() {
  const { currentScreen, goBack } = useAppContext();

  useEffect(() => {
    let listener: any = null;

    const setupListener = async () => {
      listener = await CapacitorApp.addListener('backButton', () => {
        goBack();
      });
    };

    setupListener();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [goBack]);

  return (
    <>
      <AnimatePresence mode="wait">
        {currentScreen === 'Splash' && <Splash key="splash" />}
        {currentScreen === 'Login' && <Login key="login" />}
        {currentScreen === 'Register' && <Register key="register" />}
        {currentScreen === 'Main' && <Main key="main" />}
        {currentScreen === 'JobDetails' && <JobDetails key="jobdetails" />}
        {currentScreen === 'Chat' && <Chat key="chat" />}
        {currentScreen === 'Calculator' && <Calculator key="calculator" />}
        {currentScreen === 'Settings' && <Settings key="settings" />}
        {currentScreen === 'FreelancerProfile' && <FreelancerProfile key="freelancerprofile" />}
      </AnimatePresence>
      <ConfirmationModals />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
