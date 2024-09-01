import { useState, useRef, useCallback } from "react";
import { Song } from "../types/type";

export const useAudioPlayer = () => {
  const [isPlay, setIsPlay] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlay(true);
    }
  }, []);

  const pauseSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlay(false);
    }
  }, []);

  const toggleSong = useCallback(() => {
    if (isPlay) {
      pauseSong();
    } else {
      playSong();
    }
  }, [isPlay, pauseSong, playSong]);

  const handleSongSelected = useCallback(
    (song: Song) => {
      setSelectedSong(song);
      if (audioRef.current) {
        audioRef.current.src = song.preview_url;
        playSong();
      }
    },
    [playSong]
  );

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  return {
    isPlay,
    selectedSong,
    volume,
    audioRef,
    toggleSong,
    handleSongSelected,
    handleVolumeChange,
  };
};
