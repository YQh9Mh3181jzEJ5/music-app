import spotify from "./lib/spotify";
import { SongList } from "./components/SongList";
import { useEffect, useState } from "react";
import { Song, SpotifyTrackItem } from "./types/type";

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold ">Music App</h1>
        </header>
        <section>
          <h2 className="text-2xl font-semibold mb-5">Popular Songs</h2>
          <SongList isLoading={isLoading} songs={popularSongs} />
        </section>
      </main>
    </div>
  );
}
