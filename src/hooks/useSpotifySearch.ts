import { useState, useCallback } from "react";
import spotify from "../lib/spotify";
import { Song } from "../types/type";

const LIMIT = 20;

export const useSpotifySearch = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [searchState, setSearchState] = useState({
    keyword: "",
    searchedKeyword: "",
    searchedSongs: null as Song[] | null,
    page: 1,
    hasNext: false,
    hasPrev: false,
    totalResults: 0,
  });

  const fetchPopularSongs = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await spotify.getPopularSongs();
      setPopularSongs(result.items.map((item: any) => item.track));
    } catch (error) {
      console.error("Failed to fetch popular songs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchSongs = useCallback(
    async (page?: number) => {
      setIsLoading(true);
      try {
        const offset = page ? (page - 1) * LIMIT : 0;
        const result = await spotify.searchSongs(
          searchState.keyword,
          LIMIT,
          offset
        );
        setSearchState((prev) => ({
          ...prev,
          searchedKeyword: prev.keyword,
          searchedSongs: result.items,
          hasNext: result.next !== null,
          hasPrev: result.previous !== null,
          totalResults: result.total,
          page: page || prev.page,
        }));
      } catch (error) {
        console.error("Failed to fetch search song:", error);
        setSearchState((prev) => ({
          ...prev,
          searchedSongs: [],
          totalResults: 0,
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [searchState.keyword]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchState((prev) => ({ ...prev, keyword: event.target.value }));
    },
    []
  );

  const resetToInitialState = useCallback(() => {
    setSearchState({
      keyword: "",
      searchedKeyword: "",
      searchedSongs: null,
      page: 1,
      hasNext: false,
      hasPrev: false,
      totalResults: 0,
    });
  }, []);

  return {
    isLoading,
    popularSongs,
    searchState,
    fetchPopularSongs,
    searchSongs,
    handleInputChange,
    resetToInitialState,
  };
};
