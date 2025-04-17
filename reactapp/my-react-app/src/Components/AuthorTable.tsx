import { useEffect, useState } from "react";
import { Author } from "./interfaces";
import axios from "axios";
import { useFetcher } from "react-router-dom";
import { FaBook, FaCalendarAlt, FaEdit, FaImage, FaListAlt, FaTrash, FaUserEdit } from "react-icons/fa";
import { FaVialCircleCheck } from "react-icons/fa6";
import AuthorEditPopForm from "./AuthorEditPopForm";
import AuthorCreateForm from "./AuthorCreateForm";

export default function AuthorTable(){

 
     const headers = [
        { 
          key: 'cover', 
          label: 'AuthorImage', 
          icon: FaImage, 
          color: 'bg-blue-100 text-blue-800' 
        },
        { 
          key: 'name', 
          label: 'Author Name', 
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
            key:'status',
            label:'status',
            icon:FaVialCircleCheck,
            color:'bg-pink-100 text-gray-800'
        }
      ];
    const[authors,setauthor]=useState<Author[]>([]);
    const[datcreatedmap,setdatecreatedmap]=useState<Map<string,string>>(new Map());
    const [showEditForm, setEditForm] = useState<boolean>(false);
     const [editingAuthorId, setAuthorId] = useState<string | null>(null);
    const fetchAuthors=async ()=>{
        const apirul="http://localhost:5000/api/Authors/AllAuthors";
        try {
         const response = await axios.get<Author[]>(apirul, {
           headers: { 
             'Content-Type': 'application/json',
             'Accept': 'application/json'
           },
         });
        setauthor(response.data);
         
        
       } catch (error) {
        console.log(error, 'Unable to load Books Data');
         return [];
       }
    };
    const DeleteAuthor=async (authorid:string)=>{
      const apirul="http://localhost:5000/api/Authors/DeleteAuthor";
      const datarequest={
        authorid
      }
      try {
       const response = await axios.post(apirul,datarequest, {
         headers: { 
           'Content-Type': 'application/json',
           'Accept': 'application/json'
         },
       });
         if(response.data.message){
          alert(response.data.message);
          fetchAuthors();
         }
       
      
     } catch (error) {
      console.log(error, 'Unable to delete author Data');
       return [];
     }
    }
    useEffect(()=>{
          fetchAuthors();
         
    },[]);
    useEffect(()=>{
      if(authors.length>0){
        makeDateColorMapping();
      }
    },[authors]);
    const generateRandomColor = () => {
      const r = Math.floor(Math.random() * 256);   // Red: 0-255
      const g = Math.floor(Math.random() * 256);   // Green: 0-255
      const b = Math.floor(Math.random() * 256);   // Blue: 0-255
      const a = 0.2 + Math.random() * 0.3;         // Alpha: 0.2 - 0.5 (light transparency)
    
      return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
    };
    const makeDateColorMapping=()=>{
      let newDateColormap=new Map();
      authors.forEach((author)=>{
         const datebook=author.createdAt;
         if(!newDateColormap.has(datebook)){
            newDateColormap.set(datebook,generateRandomColor());
         }
      });
      setdatecreatedmap(newDateColormap);
  };
  const[showcreateform,setcreateform]=useState<boolean>(false);
    return(

        <div >
             <table className='booktable '>
               <thead>
                 <tr>
                   {headers.map((header) => (
                     <th 
                       key={header.key}
                     >
                       <div>
                         <div className={`${header.color} groupedIcons`}>
                           <header.icon />
                           {header.label}
                         </div>
                       </div>
                     </th>
                   ))}
                      <th onClick={() =>setcreateform(true)}>
            <i className="fas fa-plus"></i>
          </th>
                 </tr>
               </thead>
               <tbody>
                 {authors.map((author) => {
                   // Get the color for this book's category
                  
                   const datecreated=datcreatedmap.get(author?.createdAt||'not date');
                 
                   let authorstatuscolor="";
                   if (author.isDeleted == true) {
                    authorstatuscolor="rgba(255, 0, 0, 0.3)";  // Yellow with some transparency
                       
                     } 
                     // "Unavailable" status (borrowed) - yellow color
                     else   {
                      authorstatuscolor="rgba(0, 255, 0, 0.3)";  // Green with some transparency
                     } 
                   
                   return (
                     <tr 
                       key={author.authorId} 
                      
                      
                     >
                       <td>
                         {author.authorImage ? (
                           <img 
                           src={`data:image/jpeg;base64,${author.authorImage}`} 
                           alt={author.authorName} 
                           className="h-16 w-16 object-cover rounded-full"
                           />
                         ) : (
                           <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded-full">
                           <FaImage className="text-gray-500 text-xl" />
                           </div>
                         )}
                         
                       </td>
                       <td>
                         <div>{author.authorName}</div>
                       </td>
                      
                     
                      
                       <td>
                         <div className='bookcategory' style={{backgroundColor:datecreated}}>{new Date(author.createdAt).toLocaleDateString()}</div>
                       </td>
                       <td>
                         <div style={{ opacity: author.isDeleted ? 0.5 : 1, pointerEvents: author.isDeleted ? 'none' : 'auto' }}>
                             <button
                             onClick={() => {
                              setAuthorId(author.authorId);
                             setEditForm(true);
                             console.log("clicked edit form:" + showEditForm);
                             }}
                             title="Edit"
                             disabled={author.isDeleted}
                             >
                             <FaEdit />
                             </button>
                            
                             {showEditForm &&  editingAuthorId === author.authorId  && (
                             <AuthorEditPopForm
                             author={author}
                             onClose={() => {
                               setEditForm(false);
                               fetchAuthors(); // Recall fetchAuthors after closing the form
                             }}
                             show={showEditForm}
                             />
                             )}
                           <button
                           onClick={() => DeleteAuthor(author.authorId)}
                           disabled={author.isDeleted}
                           >
                           <FaTrash />
                           </button>
                         </div>
                       </td>
                       <td>
                            <div className='bookcategory' style={{backgroundColor:authorstatuscolor}}>
                            {Boolean(!author.isDeleted) ? 'Available' : 'Unavailable'}
                            </div>
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
             
             {authors.length === 0 && (
               <div className="text-center py-8 text-gray-500 bg-white">
                 <FaBook className="mx-auto h-12 w-12 text-gray-400" />
                 <h3 className="mt-2 text-sm font-medium text-gray-900">No books</h3>
                 <p className="mt-1 text-sm text-gray-500">There are currently no books to display.</p>
               </div>
             )}
             <AuthorCreateForm show={showcreateform} onClose={()=>{setcreateform(false);fetchAuthors()}}></AuthorCreateForm>


           </div>
          
    );

} 