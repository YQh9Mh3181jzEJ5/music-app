import React from "react";

interface SearchResultHeaderProps {
  keyword: string;
  totalResults: number;
  onBackToPopular: () => void;
}

export const SearchResultHeader: React.FC<SearchResultHeaderProps> = ({
  keyword,
  totalResults,
  onBackToPopular,
}) => {
  return (
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-2xl font-semibold flex items-center">
        <span>Searched Songs for "{keyword}"</span>
        <span className="ml-4 text-lg font-normal text-gray-400">
          ({totalResults} {totalResults === 1 ? "song" : "songs"})
        </span>
      </h2>
      <button
        onClick={onBackToPopular}
        className="bg-gray-50 py-2 px-4 rounded-sm text-slate-800 hover:text-slate-400 text-lg"
      >
        Back to Popular Songs
      </button>
    </div>
  );
};
