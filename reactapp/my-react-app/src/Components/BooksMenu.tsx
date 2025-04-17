import axios from "axios";
import { useState, useEffect } from "react";
import { Book, Category } from "../Components/interfaces";
import { Link } from "react-router-dom";
import BookTables, { GenericAgTable } from "./Table";

import { ColDef } from "ag-grid-community";
interface BooksMenuProps {
  onBookSelect: (book: Book) => void;
}
const BooksMenu = ( {onBookSelect}:BooksMenuProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const[selectedBooktosee,setSelectedBook]=useState<Book>();
  const columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'bookId' },
    { headerName: 'Name', field: 'bookName' },
    { headerName: 'Author', field: 'authorName' },
    { headerName: 'Category', field: 'categoryName' },
    { headerName: 'Year', field: 'publishedYear' },
  ];
  const booksPerPage: number = 3;
  console.log(selectedBooktosee?.bookId);
  // Fetch books function
  const fetchBooks = async (): Promise<Book[]> => {
    const apiUrl = 'http://localhost:5000/api/Book/allbooks';
    
    try {
      const response = await axios.get<Book[]>(apiUrl, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Unable to load Books Data');
      return [];
    }
  };

  // Fetch categories function
  const fetchCategories = async (): Promise<Category[]> => {
    const apiUrl = 'http://localhost:5000/api/category/AllCategories';
    
    try {
      const response = await axios.get<Category[]>(apiUrl, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Unable to load Categories Data');
      return [];
    }
  };

  // Generic error handler
  const handleApiError = (error: unknown, defaultMessage: string): void => {
    if (axios.isAxiosError(error)) {
      const serverResponse = error.response?.data;
      if (serverResponse?.errors) {
        setError(serverResponse.errors.join('\n'));
      } else if (serverResponse?.message) {
        setError(serverResponse.message);
      } else {
        setError(error.response?.statusText || defaultMessage);
      }
    } else {
      setError('An unexpected error occurred');
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksData, categoriesData] = await Promise.all([
          fetchBooks(),
          fetchCategories()
        ]);
        setBooks(booksData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryClick = (categoryId: string): void => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const filteredBooks: Book[] = activeCategory === "all" 
    ? books 
    : books.filter((book: Book) => book.category.categoryId === activeCategory);

  const totalPages: number = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks: Book[] = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <div className="Menu">
      <div className="category-nav-container">
        <button className="scroll-button">
          <i className="scroll-icon fi fi-tr-angle-small-left"></i>
        </button>

        <div className="category-nav">
          <div
            className={`category-item ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => handleCategoryClick("all")}
          >
            All
          </div>
          {categories.map((category: Category) => (
            <div
              key={category.categoryId}
              className={`category-item ${activeCategory === category.categoryId ? "active" : ""}`}
              onClick={() => handleCategoryClick(category.categoryId)}
            >
              {category.categoryName.charAt(0).toUpperCase() + category.categoryName.slice(1)}
            </div>
          ))}
        </div>

        <button className="scroll-button">
          <i className="scroll-icon fi fi-tr-angle-small-right"></i>
        </button>
      </div>

      <div className="BooksMenu">
        {paginatedBooks.length > 0 ? (
          paginatedBooks.map((book: Book) => (
           
            <div key={book.bookId} className="Book book-item" onClick={() => onBookSelect(book)}
            
            >
              {book.bookImages?(
  <img 
  src={`data:image/jpeg;base64,${book.bookImages}`} 
  alt={book.bookName} 
  style={{"width":"100%","height":"auto"}}
  className="bookimage"
  ></img>
              ):(
<img src= 'src/assets/images/book-14.png' alt="" />
              )};
        
            
              <div className="flex">
                <span className="dotspan2"></span>
               <div className="bookinfo">
               <p className="bookname">{book.bookName}</p>
                <p className="bookcategory">{book.category.categoryName}</p>
               </div>
                <div className="icons">
                  <img src="src/assets/images/chat.png" alt="Chat" />
                  <img src="src/assets/images/heart.png" alt="Like" />
                  <img 
                    src="src/assets/images/shopping-bag.png" 
                    className="add-to-cart" 
                    alt="Cart" 
                  />
                </div>
              </div>
            </div>
        
          ))
        ) : (
          <p>No books found in this category.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="navbarNumbers">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)}
            aria-label="Previous page"
          >
            <img src="src/assets/images/arrow-left.png" alt="Previous"/>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
              aria-label={`Page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(currentPage + 1)}
            aria-label="Next page"
          >
            <img src="src/assets/images/arrow-left (1).png" alt="Next"/>
          </button>
        </div>
      )}
    </div>
   
    </>
  );
};

export default BooksMenu;