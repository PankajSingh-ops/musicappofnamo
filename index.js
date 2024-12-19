/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';

// Initialize player before registering the app
const setup = async () => {
  try {
    await TrackPlayer.setupPlayer({
      waitForBuffer: true,
    });
    console.log('Player setup successful');
  } catch (error) {
    console.error('Player setup failed:', error);
  }
};

setup(); // Run setup

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./service'));