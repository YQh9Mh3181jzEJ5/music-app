import React from "react";
import { Song } from "../../types/type";
import { useSpotifySearch } from "../../hooks/useSpotifySearch";
import { SearchInput } from "../search/SearchInput";
import { SearchResultHeader } from "../search/SearchResultHeader";
import { SongList } from "../song/SongList";
import { Pagination } from "../Pagination";

const LIMIT = 20;

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

interface MainContentProps {
  isLoading: boolean;
  songs: Song[] | null;
  searchState: ReturnType<typeof useSpotifySearch>["searchState"];
  onSongSelected: (song: Song) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => Promise<void>;
  onResetSearch: () => void;
  onPageChange: (page: number) => Promise<void>;
}

export const MainContent: React.FC<MainContentProps> = ({
  isLoading,
  songs,
  searchState,
  onSongSelected,
  onInputChange,
  onSearch,
  onResetSearch,
  onPageChange,
}) => {
  const isSearchedResult = searchState.searchedSongs !== null;

  return (
    <section>
      <SearchInput onInputChange={onInputChange} onSubmit={onSearch} />
      {isSearchedResult ? (
        <SearchResultHeader
          keyword={searchState.searchedKeyword}
          totalResults={searchState.totalResults}
          onBackToPopular={onResetSearch}
        />
      ) : (
        <PopularSongsHeader />
      )}
      <SongList
        isLoading={isLoading}
        songs={songs}
        onSongSelected={onSongSelected}
      />
      {isSearchedResult && (
        <Pagination
          onPrev={
            searchState.hasPrev
              ? () => onPageChange(searchState.page - 1)
              : null
          }
          onNext={
            searchState.hasNext
              ? () => onPageChange(searchState.page + 1)
              : null
          }
          page={searchState.page}
          currentPage={searchState.page}
          totalPages={Math.ceil(searchState.totalResults / LIMIT)}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
};
