import spotify from "./lib/spotify";
import { SongList } from "./components/SongList";
import { Player } from "./components/Player";
import { useEffect, useRef, useState } from "react";
import { Song, SpotifyTrackItem } from "./types/type";
import { SearchInput } from "./components/SearchInput";

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>("");
  const [searchedSongs, setSearchedSongs] = useState<Song[] | null>(null);
  const isSearchedResult = searchedSongs !== null;

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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setKeyword(event.target.value);
  };

  const searchSongs = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await spotify.searchSongs(keyword);
      console.log(result.items);
      if (result) {
        setSearchedSongs(result.items);
      } else {
        setSearchedSongs([]);
        console.log("No search results found");
      }
    } catch (error) {
      console.error("Failed to fetch search song:", error);
      setSearchedSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold ">Music App</h1>
        </header>
        <SearchInput onInputChange={handleInputChange} onSubmit={searchSongs} />
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {isSearchedResult ? "Searched Songs" : "Popular Songs"}
          </h2>
          <SongList
            isLoading={isLoading}
            songs={isSearchedResult ? searchedSongs : popularSongs}
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
