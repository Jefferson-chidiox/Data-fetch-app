// src/components/DataList.tsx
import React, { useEffect, useState, useRef } from 'react';
import { fetchData, Post } from '../services/api';
import '../styles/App.css'; // Import the responsive styles

interface DataListProps {
  searchTerm?: string;
  categoryFilter?: string;
  dateFilter?: string; // Not used in filtering because API lacks a date field
  itemsPerPage?: number;
}

const DataList: React.FC<DataListProps> = ({
  searchTerm = '',
  categoryFilter = 'all',
  itemsPerPage = 10,
}) => {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Track the number of items visible
  const [visibleCount, setVisibleCount] = useState<number>(itemsPerPage);
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Filter data based on search term and category
  const filteredData = data.filter((item) => {
    const matchesName = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter && categoryFilter !== 'all'
        ? item.userId === parseInt(categoryFilter, 10)
        : true;
    // Date filter is included in the UI, but our API doesn't provide dates
    const matchesDate = true;
    return matchesName && matchesCategory && matchesDate;
  });

  // Determine which items to display based on visibleCount
  const currentItems = filteredData.slice(0, visibleCount);

  // Set up IntersectionObserver for infinite scrolling
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && visibleCount < filteredData.length) {
        // Automatically load more items
        setVisibleCount((prev) => prev + itemsPerPage);
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader, visibleCount, filteredData.length, itemsPerPage]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <ul className="data-list">
        {currentItems.map((item) => (
          <li key={item.id} className="data-list-item">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy" // Lazy load images
              />
            )}
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
      {visibleCount < filteredData.length && (
        <>
          {/* Sentinel element for the Intersection Observer */}
          <div ref={loader}>
            <p>Loading more items...</p>
          </div>
          {/* Accessible "Load More" button for keyboard users */}
          <button
            aria-label="Load more posts"
            onClick={() => setVisibleCount((prev) => prev + itemsPerPage)}
            style={{ margin: '1rem auto', display: 'block' }}
          >
            Load More
          </button>
        </>
      )}
    </>
  );
};

export default DataList;
