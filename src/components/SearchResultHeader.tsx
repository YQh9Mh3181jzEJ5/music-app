import React from "react";

interface SearchResultHeaderProps {
  keyword: string;
  totalResults: number;
}

export const SearchResultHeader: React.FC<SearchResultHeaderProps> = ({
  keyword,
  totalResults,
}) => {
  return (
    <h2 className="text-2xl font-semibold mb-5 flex items-center">
      <span>Searched Songs for "{keyword}"</span>
      <span className="ml-4 text-lg font-normal text-gray-400">
        ({totalResults} {totalResults === 1 ? "song" : "songs"})
      </span>
    </h2>
  );
};
