interface HeaderProps {
  resetToInitialState: () => void;
}

const Header = ({ resetToInitialState }: HeaderProps) => (
  <header className="mb-10">
    <h1
      onClick={resetToInitialState}
      className="text-4xl font-bold cursor-pointer"
    >
      Music App
    </h1>
  </header>
);

export default Header;
