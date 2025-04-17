import { useEffect, useState } from "react";
import { Category } from "./interfaces";
import axios from "axios";
import { FaBook, FaCalendarAlt, FaEdit, FaImage, FaListAlt, FaTrash, FaUserEdit } from "react-icons/fa";
import { FaVialCircleCheck } from "react-icons/fa6";
import { useFetcher } from "react-router-dom";

export default function  CategoryTable(){

    const headers = [
       
        { 
          key: 'name', 
          label: 'Category Name', 
          icon: FaBook, 
          color: 'bg-purple-100 text-purple-800' 
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
          key: 'actions', 
          label: 'Actions', 
          icon: FaEdit, 
          color: 'bg-gray-100 text-gray-800' 
        },
       
      ];
      const handleEdit = () => {
       
      };
    
      const handleDelete = () => {
      
      };
    const[categories,setcategories]=useState<Category[]>([]);
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const [categoryColor, setCategoryColor] = useState<Map<string, string>>(new Map());
    const[datecolor,setdateColor]=useState<Map<string,string>>(new Map());
      // Function to generate random colors
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);   // Red: 0-255
    const g = Math.floor(Math.random() * 256);   // Green: 0-255
    const b = Math.floor(Math.random() * 256);   // Blue: 0-255
    const a = 0.2 + Math.random() * 0.3;         // Alpha: 0.2 - 0.5 (light transparency)
  
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  };
    const fetchcatgories=async ()=>{
       
            const apirul="http://localhost:5000/api/category/AllCategories";
            try {
             const response = await axios.get<Category[]>(apirul, {
               headers: { 
                 'Content-Type': 'application/json',
                 'Accept': 'application/json'
               },
             });
             setcategories(response.data);
             
            
           } catch (error) {
            console.log(error, 'Unable to load Books Data');
             return [];
           }
        
    };
      // Make category-color mapping
  const makeCategoryColorMapping = () => {
    let newCategoryColorMap = new Map();
    
    categories.forEach((category) => {
      const categoryName = category?.categoryName || 'Uncategorized';
      
     
      if (!newCategoryColorMap.has(categoryName)) {
        newCategoryColorMap.set(categoryName, generateRandomColor());
      }
    });

    setCategoryColor(newCategoryColorMap);
  };

  const makeDateColorMapping = () => {
    let newCategoryColorMap = new Map();
    
    categories.forEach((category) => {
      const categorydate = category?.createdAt || 'Uncategorized';
      
    
      if (!newCategoryColorMap.has(categorydate)) {
        newCategoryColorMap.set(categorydate, generateRandomColor());
      }
    });

    setdateColor(newCategoryColorMap);
  };


  useEffect(() => {
    fetchcatgories();
  }, []);
  
  useEffect(() => {
    if (categories.length > 0) {
      makeCategoryColorMapping(); 
      makeDateColorMapping();
    }
  }, [categories]);
  
   
   return(
    <>
    <div >

    
    {categories.length === 0 && (
      <div className="text-center py-8 text-gray-500 bg-white">
        <FaBook className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Categories</h3>
        <p className="mt-1 text-sm text-gray-500">There are currently no books to display.</p>
      </div>
    )}
  </div>
  <div className="booktable compact-table-container">
  <table className='compact-table'>
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header.key} className="compact-header">
            
            <div className={`${header.color} groupedIcons`}>
                  <header.icon />
                  {header.label}
                </div>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {categories.map((category) => {
        const colorcategory = categoryColor.get(category.categoryName);
        const categorydatecolor = datecolor.get(category.createdAt);
        
        function setEditForm(arg0: boolean) {
          throw new Error("Function not implemented.");
        }

        return (
          <tr key={category.categoryId} className="compact-row">
            <td className="compact-cell">
              <div 
                className='bookcategory compact-category' 
                style={{backgroundColor: colorcategory}}
              >
                {category.categoryName}
              </div>
            </td>
            <td className="  compact-cell">
              <div 
                className=' bookcategory compact-date' 
                style={{backgroundColor: categorydatecolor}}
              >
                {category.createdAt || 'Unknown'}
              </div>
            </td>
            <td >
                <div style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center', opacity: category.isDeleted ? 0.5 : 1, pointerEvents: category.isDeleted ? 'none' : 'auto' }}>
                                        <button
                                        onClick={() => {
                                        setEditForm(true);
                                        console.log("clicked edit form:" + showEditForm);
                                        }}
                                        title="Edit"
                                        disabled={category.isDeleted}
                                        >
                                        <FaEdit />
                                        </button>
                                        
                                      <button
                                     
                                      >
                                      <FaTrash />
                                      </button>
                                    </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
  
  {categories.length === 0 && (
    <div className="compact-empty-state">
      <FaBook className="compact-empty-icon" />
      <h3 className="compact-empty-title">No Categories</h3>
      <p className="compact-empty-message">There are currently no categories to display.</p>
    </div>
  )}
</div>
  </>
   );
}