import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchInputProps } from "../../types/type";

export function SearchInput({ onInputChange, onSubmit }: SearchInputProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };
  return (
    <div className="mb-10 flex justify-center items-center">
      <input
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        className="bg-gray-700 w-1/2 p-4 rounded-l-lg focus:outline-none"
        placeholder="探したい曲を入力してください"
      />
      <button
        onClick={() => onSubmit()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded-r-lg"
        aria-label="検索"
      >
        <FontAwesomeIcon icon={faSearch} className="mr-2" />
        <span>検索</span>
      </button>
    </div>
  );
}
