import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  useProgress,
} from 'react-native-track-player';

const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SEEK_TO,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
      ],
    });
  } catch (error) {
    console.log('Error setting up player:', error);
  }
};

const tracks = [
  {
    id: '1',
    url: require('./audio/audio.mp3'), // Make sure this path matches your project structure
    title: 'Track 1',
    artist: 'Artist 1',
    duration: 180, // Duration in seconds
  },
  {
    id: '2',
    url: require('./audio/music.mp3'),
    title: 'Track 2',
    artist: 'Artist 2',
    duration: 240,
  },
];

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = useProgress();

  useEffect(() => {
    setupPlayer();
    // Load tracks when component mounts
    const loadTracks = async () => {
      await TrackPlayer.add(tracks);
    };
    loadTracks();

    // Cleanup when component unmounts
    return () => {
      TrackPlayer.destroy();
    };
  }, []);

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.state === State.Playing) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  });

  const togglePlayback = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack === null) {
      await TrackPlayer.play();
    } else {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    }
  };

  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
  };

  const skipToPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.playerContainer}>
        <Text style={styles.title}>Music Player</Text>
        
        <View style={styles.controls}>
          <TouchableOpacity onPress={skipToPrevious} style={styles.button}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
            <Text style={styles.buttonText}>
              {isPlaying ? 'Pause' : 'Play'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={skipToNext} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {new Date(progress.position * 1000).toISOString().substr(14, 5)}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressIndicator,
                { width: `${(progress.position / progress.duration) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {new Date(progress.duration * 1000).toISOString().substr(14, 5)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  playerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  playButton: {
    padding: 20,
    backgroundColor: '#007AFF',
    borderRadius: 40,
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
    borderRadius: 2,
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
});

export default App;
