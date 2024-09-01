// src/components/Pagination.tsx
import React from "react";
import { PaginationProps } from "../types/type";
import { getPageNumbers } from "../utils/getPage";
import Button from "./ common/button/Button";

export const Pagination: React.FC<PaginationProps> = ({
  onPrev,
  onNext,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="mt-8 flex justify-center items-center space-x-2">
      <Button
        disabled={onPrev === null}
        onClick={onPrev || undefined}
        variant="secondary"
      >
        Previous
      </Button>
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
      <Button
        disabled={onNext === null}
        onClick={onNext || undefined}
        variant="secondary"
      >
        Next
      </Button>
    </div>
  );
};
