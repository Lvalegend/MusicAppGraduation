import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform } from "react-native";
import { Text } from "native-base";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import colors from "@assets/colors/global_colors";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import sizes from "@assets/styles/sizes";
import styles_c from "@assets/styles/styles_c";
import responsive_screen from "@assets/styles/responsive";

interface MusicPlayerProps { }

const MusicPlayer: React.FC<MusicPlayerProps> = () => {
  const [randomMode, setRandomMode] = useState(false)

  const [sound, setSound] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  const loadAndPlaySound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('@assets/musics/3 thằng bạn/3-Thang-Ban-Karik.mp3'),
      { shouldPlay: true }
    );
    setSound(sound);

    sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
  };

  const updatePlaybackStatus = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);

      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    }
  };

  const playSound = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    } else {
      await loadAndPlaySound();
      setIsPlaying(true);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const seekPosition = async (value: any) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={seekPosition}
          minimumTrackTintColor={colors.white}
          maximumTrackTintColor={colors.gray_primary}
          thumbTintColor={colors.white}
        />
        <View style={{ ...styles_c.row_between }}>
          <Text color={colors.white} fontSize={sizes._12sdp}>
            {formatTime(position)}
          </Text>
          <Text color={colors.white} fontSize={sizes._12sdp}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>
      <View style={{ ...styles_c.row_direction_align_center }}>
        <TouchableOpacity
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: responsive_screen.h_bigger_767px(25, 5),
          }}
          onPress={() => setRandomMode(!randomMode)}
        >
          <FontAwesome name="random" size={sizes._28sdp} color={randomMode === true ? colors.blue_primary : colors.white} />
        </TouchableOpacity>
        <View style={{
          ...styles_c.row_center,
          gap: 10,
          marginTop: responsive_screen.h_bigger_767px(20, 0),
          width: '90%',
          paddingRight: 20
        }}>
          <TouchableOpacity style={styles.button}>
            <AntDesign name="stepbackward" size={sizes._35sdp} color={colors.white} />
          </TouchableOpacity>
          {isPlaying ? (
            <TouchableOpacity onPress={pauseSound} style={styles.button}>
              <AntDesign name="pausecircleo" size={sizes._65sdp} color={colors.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={playSound} style={styles.button}>
              <AntDesign name="playcircleo" size={sizes._65sdp} color={colors.white} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button}>
            <AntDesign name="stepforward" size={sizes._35sdp} color={colors.white} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  button: {
    padding: 10,
  },
  slider: {
    width: '100%',
  },
});

export default MusicPlayer;
