import { PaginationProps } from "../types/type";
import { getPageNumbers } from "../utils/getPage";

export function Pagination({
  onPrev,
  onNext,
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  return (
    <div className="mt-8 flex justify-center items-center space-x-2">
      <button
        disabled={onPrev === null}
        onClick={onPrev || undefined}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {pageNumbers.map((number, index) => (
        <button
          key={index}
          onClick={() =>
            typeof number === "number" ? onPageChange(number) : undefined
          }
          className={`w-8 h-8 rounded-full mx-2 ${
            number === currentPage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          } ${
            typeof number === "number" ? "cursor-pointer" : "cursor-default"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        disabled={onNext === null}
        onClick={onNext || undefined}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
