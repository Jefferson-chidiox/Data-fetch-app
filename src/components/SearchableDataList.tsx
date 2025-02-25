import React, { useCallback, useState } from 'react';
import DataList from './DataList';
import ThemeToggle from './ThemeToggle';
import { debounce } from '../utils/debounce';

const SearchableDataList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [category, setCategory] = useState<string>('all');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Debounce the search input to delay updating the search term until the user stops typing
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 100),
    []
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <div>
      <header className="header">
        <h1 className="header-title">Post List</h1>
        <div className="header-controls">
          <div className="main-controls">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearch}
              aria-label="Search posts"
              className="search-bar"
            />
            <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle filters">
              &#9776;
            </button>
          </div>
          <div className={`extra-controls ${menuOpen ? 'open' : ''}`}>
            <select
              value={category}
              onChange={handleCategoryChange}
              aria-label="Filter posts by category"
              className="category-select"
            >
              <option value="all">All Categories</option>
              <option value="1">Category 1</option>
              <option value="2">Category 2</option>
              <option value="3">Category 3</option>
              <option value="4">Category 4</option>
              <option value="5">Category 5</option>
              <option value="6">Category 6</option>
              <option value="7">Category 7</option>
              <option value="8">Category 8</option>
              <option value="9">Category 9</option>
              <option value="10">Category 10</option>
            </select>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* DataList with searchTerm and category filter */}
      <DataList searchTerm={searchTerm} categoryFilter={category} />
    </div>
  );
};

export default SearchableDataList;
