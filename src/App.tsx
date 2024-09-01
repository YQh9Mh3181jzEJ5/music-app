import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useSpotifySearch } from "./hooks/useSpotifySearch";
import { Player } from "./components/player/Player";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import { useEffect } from "react";
import { MainContent } from "./components/mainContent/MainContent";

export default function App() {
  const {
    isPlay,
    selectedSong,
    volume,
    audioRef,
    toggleSong,
    handleSongSelected,
    handleVolumeChange,
  } = useAudioPlayer();

  const {
    isLoading,
    popularSongs,
    searchState,
    fetchPopularSongs,
    searchSongs,
    handleInputChange,
    resetToInitialState,
  } = useSpotifySearch();

  useEffect(() => {
    fetchPopularSongs();
  }, [fetchPopularSongs]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 pb-20">
        <Header resetToInitialState={resetToInitialState} />
        <MainContent
          isLoading={isLoading}
          songs={searchState.searchedSongs || popularSongs}
          searchState={searchState}
          onSongSelected={handleSongSelected}
          onInputChange={handleInputChange}
          onSearch={() => searchSongs()}
          onResetSearch={resetToInitialState}
          onPageChange={(page) => searchSongs(page)}
        />
        <Footer />
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
