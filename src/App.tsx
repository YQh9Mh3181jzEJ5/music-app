import spotify from "./lib/spotify";
import { SongList } from "./components/SongList";
import { Player } from "./components/Player";
import { useEffect, useRef, useState } from "react";
import { Song, SpotifyTrackItem } from "./types/type";

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(1);

  const fetchPopularSongs = async () => {
    setIsLoading(true);
    try {
      const result = await spotify.getPopularSongs();
      const popularSongs = result.items.map((item: SpotifyTrackItem) => {
        return item.track;
      });
      setPopularSongs(popularSongs);
    } catch (error) {
      console.error("Failed to fetch popular songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularSongs();
  }, []);

  const playSong = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlay(true);
    }
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlay(false);
    }
  };

  const toggleSong = () => {
    if (isPlay) {
      pauseSong();
    } else {
      playSong();
    }
  };

  const handleSongSelected = async (song: Song) => {
    setSelectedSong(song);
    if (audioRef.current) {
      audioRef.current.src = song.preview_url;
      playSong();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold ">Music App</h1>
        </header>
        <section>
          <h2 className="text-2xl font-semibold mb-5">Popular Songs</h2>
          <SongList
            isLoading={isLoading}
            songs={popularSongs}
            onSongSelected={handleSongSelected}
          />
        </section>
      </main>
      {selectedSong && (
        <Player
          song={selectedSong}
          isPlay={isPlay}
          onButtonClick={toggleSong}
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      )}
      <audio ref={audioRef} />
    </div>
  );
}
