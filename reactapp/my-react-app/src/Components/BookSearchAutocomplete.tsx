import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import "../assets/css/bookseacrchcss2.css";
interface Author {
  authorId: string;
  authorName: string;
  authorImage: string | null;
}

interface Category {
  categoryId: string;
  categoryName: string;
}

interface Book {
  bookId: string;
  bookName: string;
  author: Author | null;
  category: Category | null;
  bookDescription: string;
}

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    books: Book[];
    authors: Author[];
    categories: Category[];
  }>({ books: [], authors: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const cancelToken = useRef<CancelTokenSource | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search function with debounce and cancellation
  const searchBooks = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setResults({ books: [], authors: [], categories: [] });
      setShowDropdown(false);
      return;
    }

    // Cancel previous request if exists
    if (cancelToken.current) {
      cancelToken.current.cancel('Operation canceled due to new request');
    }

    // Create new cancel token
    cancelToken.current = axios.CancelToken.source();
    
    setLoading(true);
    setError(null);
    const apiUrl = 'http://localhost:5000/api/Search/Searching';
    const q=query;
    const requestdata={
     q
    }
    try {
     
     
      const response = await axios.post(apiUrl,requestdata,{
        headers: { 
          'Content-Type': 'application/json' ,
          'Accept': 'application/json'
        },
        // withCredentials: true // Uncomment if using cookies
      });
  
     console.log(response.data);
      setResults(response.data);
      setShowDropdown(true);
    } catch (err) {
      if (!axios.isCancel(err)) {
        const error = err as AxiosError;
        setError(error.message);
        console.error('Search error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      searchBooks(query);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (cancelToken.current) {
        cancelToken.current.cancel();
      }
    };
  }, [query]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: Book | Author | Category) => {
    if ('bookName' in item) {
      // Book selected
      console.log('Selected book:', item);
      setQuery(item.bookName);
    } else if ('authorName' in item) {
      // Author selected
      console.log('Selected author:', item);
      setQuery(item.authorName);
    } else {
      // Category selected
      console.log('Selected category:', item);
      setQuery(item.categoryName);
    }
    setShowDropdown(false);
  };

  return (
    <>
      <div className="search-container3" ref={dropdownRef} style={{ zIndex: "13000" }}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search books, authors, or categories..."
            className="search-input"
          />
          {loading && (
            <div className="absolute right-3 top-2.5">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
  
        {error && (
          <div className="mt-1 text-red-500 text-sm font-medium text-black">
            {error}
          </div>
        )}
  
        {showDropdown && (
          <div className="dropdown-container">
            {/* Books Section */}
            {results?.books?.length > 0 && (
              <div className="dropdown-section">
                <div className="dropdown-header">Books</div>
                {results.books.map((book) => (
                  <div
                    key={`book-${book.bookId}`}
                    className="dropdown-item"
                    onClick={() => handleSelect(book)}
                  >
                    <div className="item-title">{book.bookName}</div>
                    <div className="item-subtext">
                      {book.author?.authorName} • {book.category?.categoryName}
                    </div>
                  </div>
                ))}
              </div>
            )}
  
            {/* Authors Section */}
            {results?.authors?.length > 0 && (
              <div className="dropdown-section">
                <div className="dropdown-header">Authors</div>
                {results.authors.map((author) => (
                  <div
                    key={`author-${author.authorId}`}
                    className="dropdown-item author-item"
                    onClick={() => handleSelect(author)}
                  >
                    {author?.authorImage && (
                      <img
                        src={author.authorImage}
                        alt={author.authorName}
                        className="author-image"
                      />
                    )}
                    <div className="item-title">{author.authorName}</div>
                  </div>
                ))}
              </div>
            )}
  
            {/* Categories Section */}
            {results?.categories?.length > 0 && (
              <div className="dropdown-section">
                <div className="dropdown-header">Categories</div>
                {results.categories.map((category) => (
                  <div
                    key={`category-${category.categoryId}`}
                    className="dropdown-item"
                    onClick={() => handleSelect(category)}
                  >
                    <div className="item-title">{category.categoryName}</div>
                  </div>
                ))}
              </div>
            )}
  
            {/* No Results Found */}
            {!loading &&
              results?.books?.length === 0 &&
              results?.authors?.length === 0 &&
              results?.categories?.length === 0 && (
                <div className="no-results">No results found</div>
              )}
          </div>
        )}
      </div>
    </>
  );
  
};

export default BookSearch;