import spotify from "./lib/spotify";
import { SongList } from "./components/SongList";
import { Player } from "./components/Player";
import { useEffect, useRef, useState } from "react";
import { Song, SpotifyTrackItem } from "./types/type";
import { SearchInput } from "./components/SearchInput";
import { Pagination } from "./components/Pagination";
import { SearchResultHeader } from "./components/SearchResultHeader";

const limit: number = 20;

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>("");
  const [searchedSongs, setSearchedSongs] = useState<Song[] | null>(null);
  const [searchedKeyword, setSearchedKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrev, setHasPrev] = useState<boolean>(false);
  const [totalResults, setTotalResults] = useState<number>(0);
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

  const searchSongs = async (page?: number) => {
    setIsLoading(true);
    setSearchedKeyword(keyword);
    try {
      const offset = page ? (page - 1) * limit : 0;
      const result = await spotify.searchSongs(keyword, limit, offset);
      setHasNext(result.next !== null);
      setHasPrev(result.previous !== null);
      if (result) {
        setSearchedSongs(result.items);
        setTotalResults(result.total);
      } else {
        setSearchedSongs([]);
        setTotalResults(0);
        console.log("No search results found");
      }
    } catch (error) {
      console.error("Failed to fetch search song:", error);
      setSearchedSongs([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const moveToNext = async () => {
    const nextPage = page + 1;
    await searchSongs(nextPage);
    setPage(nextPage);
  };

  const moveToPrev = async () => {
    const prevPage = page + 1;
    await searchSongs(prevPage);
    setPage(prevPage);
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await searchSongs(newPage);
  };

  const resetToInitialState = (): void => {
    setSearchedSongs(null);
    setKeyword("");
    setSearchedKeyword("");
    setPage(1);
  };

  const PopularSongsHeader: React.FC = () => {
    const currentDate = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const formattedDate = `${
      monthNames[currentDate.getMonth()]
    } ${currentDate.getFullYear()}`;

    return (
      <h2 className="text-2xl font-semibold mb-5 flex items-center">
        <span className="mr-2">Popular Songs</span>
        <span className="text-lg font-normal text-gray-400">
          ({formattedDate})
        </span>
      </h2>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 pb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 onClick={resetToInitialState} className="text-4xl font-bold">
            Music App
          </h1>
        </header>
        <SearchInput onInputChange={handleInputChange} onSubmit={searchSongs} />
        <section>
          {isSearchedResult ? (
            <SearchResultHeader
              keyword={searchedKeyword}
              totalResults={totalResults}
              onBackToPopular={resetToInitialState}
            />
          ) : (
            <PopularSongsHeader />
          )}
          <SongList
            isLoading={isLoading}
            songs={isSearchedResult ? searchedSongs : popularSongs}
            onSongSelected={handleSongSelected}
          />
          {isSearchedResult && (
            <Pagination
              onPrev={hasPrev ? moveToPrev : null}
              onNext={hasNext ? moveToNext : null}
              page={page}
              currentPage={page}
              totalPages={Math.ceil(totalResults / limit)}
              onPageChange={handlePageChange}
            />
          )}
        </section>
        <footer className="py-8 border-t border-gray-700 mt-8">
          <p className="text-center text-gray-400">Music App © 2024</p>
        </footer>
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
