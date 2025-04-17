import React, { useState, useEffect } from 'react';
import { FaBook, FaUserEdit, FaTrash, FaEdit, FaImage, FaCalendarAlt, FaListAlt } from 'react-icons/fa';
import { IconType } from 'react-icons';
import "../assets/css/booktablecss.css";
import { FaVialCircleCheck } from 'react-icons/fa6';
import axios from 'axios';
import { BorrowedBook,Author,Book,Category } from './interfaces';
import BookEditForm from './BookEditForm';
import { ControlOutlined } from '@ant-design/icons';
import BookCreateForm from './BookCreateForm';

// Interfaces



interface BookTablesProps {
  books: Book[];
  onBookSelect?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  className?: string;
}


const BookTables: React.FC<BookTablesProps> = ({ 
  books, 
  onBookSelect, 
  onEdit, 
  onDelete, 
  className = '' 
}) => {
  const handleRowClick = (book: Book) => {
    if (onBookSelect) {
      onBookSelect(book);
    }
  };

  const handleEdit = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(book);
    }
  };

  const handleDelete = async (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    const apirul="http://localhost:5000/api/Book/SoftDelete";
    const bookid=book.bookId;
    const requestdata={
       bookid
    } 
    try {
     const response = await axios.post(apirul,requestdata, {
       headers: { 
         'Content-Type': 'application/json',
         'Accept': 'application/json'
       },
     });
     alert(response.data);
     fetchBooks();
     
    
   } catch (error) {
    alert(error+ 'Unable to load Books Data');
     return [];
   }



  };

  // Header configuration with icons and colors
  const headers = [
    { 
      key: 'cover', 
      label: 'Cover', 
      icon: FaImage, 
      color: 'bg-blue-100 text-blue-800' 
    },
    { 
      key: 'name', 
      label: 'Book Name', 
      icon: FaBook, 
      color: 'bg-purple-100 text-purple-800' 
    },
    { 
      key: 'author', 
      label: 'Author', 
      icon: FaUserEdit, 
      color: 'bg-green-100 text-green-800' 
    },
    { 
      key: 'category', 
      label: 'Category', 
      icon: FaListAlt, 
      color: 'bg-yellow-100 text-yellow-800' 
    },
    { 
      key: 'description', 
      label: 'Description', 
      icon: FaBook, 
      color: 'bg-indigo-100 text-indigo-800' 
    },
    { 
      key: 'date', 
      label: 'Date Created', 
      icon: FaCalendarAlt, 
      color: 'bg-red-100 text-red-800' 
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      icon: FaEdit, 
      color: 'bg-gray-100 text-gray-800' 
    },
    {
        key:'status',
        label:'status',
        icon:FaVialCircleCheck,
        color:'bg-pink-100 text-gray-800'
    }
  ];

  const[bookss,setbooks]=useState<Book[]>();
    const fetchBooks = async () => {
        const apiUrl = 'http://localhost:5000/api/Book/allbooksWithSoftDelete';
        
        try {
          const response = await axios.get<Book[]>(apiUrl, {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
          });
          setbooks(response.data);
        } catch (error) {
           console.log(error, 'Unable to load Books Data');
          return [];
        }
      };
      const [editingBookId, setEditingBookId] = useState<string | null>(null);

      
      const handleEditClick = (book: Book, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click from triggering
        setEditingBookId(book.bookId);
        setEditForm(true);
      };
  const [categoryColor, setCategoryColor] = useState<Map<string, string>>(new Map());
 const[datecolor,setdateColor]=useState<Map<string,string>>(new Map());
 const[authorcolors,setauthorcolor]=useState<Map<string,string>>(new Map());
 const[booksstatus,setbookstatus]=useState<Map<string,string>>(new Map());
 const[BorrowedBooks,setBorrowedBooks]=useState<BorrowedBook[]>();
 const [showEditForm, setEditForm] = useState<boolean>(false);

 const fetchBorrowedBooks=async ()=>{
    const apirul="http://localhost:5000/api/BorrowedBooks/GetBorrowedBooks";
    try {
     const response = await axios.get<BorrowedBook[]>(apirul, {
       headers: { 
         'Content-Type': 'application/json',
         'Accept': 'application/json'
       },
     });
     setBorrowedBooks(response.data);
     
    
   } catch (error) {
    console.log(error, 'Unable to load Books Data');
     return [];
   }
 };
  // Function to generate random colors
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);   // Red: 0-255
    const g = Math.floor(Math.random() * 256);   // Green: 0-255
    const b = Math.floor(Math.random() * 256);   // Blue: 0-255
    const a = 0.2 + Math.random() * 0.3;         // Alpha: 0.2 - 0.5 (light transparency)
  
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  };
  

  // Make category-color mapping
  const makeCategoryColorMapping = () => {
    let newCategoryColorMap = new Map();
    
    books.forEach((book) => {
      const categoryName = book.category?.categoryName || 'Uncategorized';
      
     
      if (!newCategoryColorMap.has(categoryName)) {
        newCategoryColorMap.set(categoryName, generateRandomColor());
      }
    });

    setCategoryColor(newCategoryColorMap);
  };
  const makeDateColorMapping=()=>{
      let newDateColormap=new Map();
      books.forEach((book)=>{
         const datebook=book.dateCreated;
         if(!newDateColormap.has(datebook)){
            newDateColormap.set(datebook,generateRandomColor());
         }
      });
      setdateColor(newDateColormap);
  };
  const makeAuthorColorMapping=()=>{
    let map=new Map();
    books.forEach((book)=>{
        const bookauthor=book.author?.authorName;
        if(!map.has(bookauthor)){
            let colorgenerate=generateRandomColor();
           
             map.set(bookauthor,colorgenerate);
        }
       
    });
    setauthorcolor(map);
  };

  const updateBookStates = () => {
    
   
  
    const statusMap = new Map();
    
    bookss?.forEach((book) => {
      
  
      let status;
      
      // Priority 1: Deleted books
      if (book.isDeleted) {
        status = "Deleted";
      } 
      // Priority 2: Borrowed books
      else if (BorrowedBooks?.some(b => b?.bookId === book?.bookId)) {
        status = "Borrowed";
      }
      // Default: Available
      else {
        status = "Available";
      }
      console.log(book.bookName+book.isDeleted);
      if(book.bookId==null){
        console.log("bookid is null for"+book.bookName);
      }
      statusMap.set(book.bookId, status);
    });
    
    setbookstatus(statusMap);
  };
 useEffect(()=>{
  fetchBorrowedBooks();
  fetchBooks();
  updateBookStates();
 },[books])
 
  useEffect(() => {
    if (!books || !BorrowedBooks) return;
    
    
    
    makeCategoryColorMapping();
    makeDateColorMapping();
    makeAuthorColorMapping();
    
      updateBookStates();
   
   
  }, [books, BorrowedBooks]);
  const[showcreate,setshowcreate]=useState<boolean>(false);
  return (
    <div>
      {bookss && BorrowedBooks && booksstatus.size > 0 ? (
        <table className='booktable'>
          <thead>
        <tr>
          {headers.map((header) => (
            <th key={header.key}>
          <div>
            <div className={`${header.color} groupedIcons`}>
              <header.icon />
              {header.label}
            </div>
          </div>
            </th>
          ))}
          <th onClick={() => {setshowcreate(true)}}>
            <i className="fas fa-plus"></i>
          </th>
        </tr>
          </thead>
          <tbody>
        {(bookss ?? []).map((book) => {
          const categoryColorValue = categoryColor.get(book.category?.categoryName || 'Uncategorized');
          const datecreated = datecolor.get(book?.dateCreated || 'not date');
          const authorname = authorcolors.get(book.author?.authorName || 'no author');
          const bookstatus = booksstatus.get(book.bookId);
          
          let bookstatuscolor = "";
          console.log(book.bookName + bookstatus);
          
          if (bookstatus == "Available") {
            bookstatuscolor = "rgba(0, 255, 0, 0.3)";
          } else if (bookstatus == "Deleted") {
            bookstatuscolor = "rgba(254, 71, 74, 0.85)";
          } else if (bookstatus == "Borrowed") {
            bookstatuscolor = "rgba(90, 22, 168, 0.3)";
          }
        
          return (
            <tr 
          key={book.bookId} 
          onClick={() => handleRowClick(book)}
          className={`${onBookSelect ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            >
          <td>
            {book.bookImages ? (
              <img 
            src={`data:image/jpeg;base64,${book.bookImages}`} 
            alt={book.bookName} 
            className="h-16 w-16 object-cover rounded-full"
              />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded-full">
            <FaImage className="text-gray-500 text-xl" />
              </div>
            )}
          </td>
          <td>
            <div>{book.bookName}</div>
          </td>
          <td>
            <div style={{backgroundColor: authorname}} className='bookcategory'>
              {book.author?.authorName || 'Unknown'}
            </div>
          </td>
          <td>
            <div style={{ backgroundColor: categoryColorValue }} className='bookcategory'>
              {book.category?.categoryName || 'Uncategorized'}
            </div>
          </td>
          <td>
            <div>{book.bookDescription}</div>
          </td>
          <td>
            <div className='bookcategory' style={{backgroundColor: datecreated}}>
              {new Date(book.dateCreated).toLocaleDateString()}
            </div>
          </td>
          <td>
            <div style={{ opacity: book.isDeleted ? 0.5 : 1, pointerEvents: book.isDeleted ? 'none' : 'auto' }}>
              <button onClick={(e) => handleEditClick(book, e)} title="Edit">
            <FaEdit />
              </button>
        
              {showEditForm && editingBookId === book.bookId && (
            <BookEditForm 
              key={`edit-${book.bookId}`}
              show={showEditForm} 
              onClose={() => {
                setEditForm(false);
                setEditingBookId(null);
                fetchBooks();
                updateBookStates();
              }} 
              book={book}
            />
              )}
        
              <button onClick={(e) => handleDelete(e, book)}>
            <FaTrash />
              </button>
            </div>
          </td>
          <td>
            <div className='bookcategory' style={{backgroundColor: bookstatuscolor}}>
              {bookstatus}
            </div>
          </td>
            </tr>
          );
        })}
          </tbody>
        </table>
      ) : (
        <div className="booktable" style={{width:'100vw',height:'fit-content'}}>
          <FaBook className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-1 text-sm text-gray-500">Loading books...</p>
        </div>
      )}
      <BookCreateForm 
        show={showcreate} 
        onClose={() => {
          setshowcreate(false);
          fetchBooks();
          updateBookStates();
        }}
      />
      
      {books.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-white">
          <FaBook className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-1 text-sm text-gray-500">There are currently no books to display.</p>
        </div>
      )}
    </div>
  );
   
};


export default BookTables;
