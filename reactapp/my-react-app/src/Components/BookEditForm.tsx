import { useEffect, useRef, useState } from "react";
import { Author, Book, Category } from "./interfaces";
import axios from "axios";
import CategoryTable from "./CategoryTable";
import { Candy } from "lucide-react";
import form from "antd/es/form";

export default function BookEditForm({book, show, onClose}: {book: Book, show: boolean, onClose: () => void}) {
   const[bookname,setbookname]=useState<string>();
   const[bookcategory,setbookcategory]=useState<Category|null>();
   const[bookauthor,setbookauthor]=useState<Author|null>();
   const[bookdescription,setbookdescription]=useState<string>();
   const[categories,setCategories]=useState<Category[]>();
   const[authors,setauthors]=useState<Author[]>();

    const[bookimage,setbookimage]=useState<File>();
     const [imageFile, setImageFile] = useState<File | null>(null);
       const [imagePreview, setImagePreview] = useState<string>();
        const fileInputRef = useRef<HTMLInputElement>(null);
     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setImageFile(file);
                
                
                // Create preview URL
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        setImagePreview(event.target.result as string);
                    }
                };
                reader.readAsDataURL(file);
            }
        };
    
        const handleRemoveImage = () => {
            setImagePreview('');
            setImageFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
    
        const triggerFileInput = () => {
            fileInputRef.current?.click();
        };
        const handleSubmit = async (e: React.FormEvent) => {
           e.preventDefault();
           
         
           const getBase64 = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => {
                const result = reader.result?.toString() || '';
                // Strip the prefix if it exists
                const base64 = result.split(',')[1]; // <-- clean base64 only
                resolve(base64);
              };
              reader.onerror = error => reject(error);
            });
          };
          
         
           const imageBase64 = imageFile ? await getBase64(imageFile) : null;
           const bookid = book.bookId;
           const bookauthorid = bookauthor?.authorId;
           const categoryid = bookcategory?.categoryId;
           
           const requestdata = {
             bookid,
             bookname,
             bookdescription,
             bookauthorid,
             categoryid,
             imageBase64
           };
          

          
           console.log("Request Data:", requestdata);
           try {
               const response = await axios.post('http://localhost:5000/api/Book/EditBook', requestdata, {
               headers: {
                   'Content-Type': 'application/json',
                   'Accept': 'application/json'
               }
               });
               alert(response.data.message);
               onClose();
           } catch (error) {
               alert("Error occurred:"+ error);
               if (axios.isAxiosError(error)) {
               const serverResponse = error.response?.data;
               if (serverResponse?.errors) {
                   alert(serverResponse.errors.join('\n'));
               } else if (serverResponse?.message) {
                   alert(serverResponse.message);
               } else {
                   alert(error.response);
               }
               } else {
               alert('An unexpected error occurred');
               }
           }
           };
       // Fetch categories function
  const fetchCategories = async () => {
    const apiUrl = 'http://localhost:5000/api/category/AllCategories';
    
    try {
      const response = await axios.get<Category[]>(apiUrl, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
     const activecategories=response.data.filter(category=>!category.isDeleted);
     setCategories(activecategories);
    } catch (error) {
      console.log(error);
      
    }
  };
  const fetchAuthors=async ()=>{
    const apirul="http://localhost:5000/api/Authors/AllAuthors";
    try {
     const response = await axios.get<Author[]>(apirul, {
       headers: { 
         'Content-Type': 'application/json',
         'Accept': 'application/json'
       },
     });
     const activeauthors=response.data.filter(f=>!f.isDeleted);
    setauthors(activeauthors);
     
    
   } catch (error) {
    console.log(error, 'Unable to load Books Data');
     return [];
   }
};
  useEffect(()=>{
    console.log(book);
     fetchCategories();
     fetchAuthors();
     
  });
  useEffect(() => {
    if (book) {
      setbookname(book.bookName);
      setbookcategory(book.category);
      setbookauthor(book.author);
      setbookdescription(book.bookDescription);
      setImagePreview(`data:image;base64,${book.bookImages}`);
    }
  }, [book]);



   return(
    <>
    {authors!=null && categories!=null}{

  
           <div style={{ width: "50%", height: '60%', alignItems: "center", margin: '0' }} className={`LoginForm ${show ? "show" : ""}`}>
                   <form style={{ width: "100%", height: "100%" }} className="EditProfileForm flex-colomn border-none" onSubmit={handleSubmit}>
                       <button type="button" onClick={onClose}  style={{ margin: '0',borderRadius: '5px',width:'fit-content',height:'12px',right:'23px',top:'7px',position:'absolute' }}>
                           <span style={{ fontSize: '80px'}}>&times;</span>
                       </button>
                       
                       <h2 style={{ alignSelf: 'center', marginTop: '2%' }}>Edit Author  Information</h2>
                       
                       <div className="ImageSection flex-row" style={{ display: "flex", alignItems: 'center', justifyContent: "flex-start" }}>
                           <div style={{ margin: "0", alignSelf: "flex-start" }}>
                               <h5>Photo</h5>
                               <div className="ImageHolder">
                               <img
    id="preview"
    alt="Current Profile Image"
    style={{ width: '150px', height: '150px' }}
    src={
        imagePreview ?? (book.bookImages ? `data:image;base64,${book.bookImages}` : '')
      }
      
  />
                               </div>
                           </div>
                           
                           <div className="ImageInfo flex-column SpaceBetween">
                               <div className="Image flex-row">
                                   <p className="ProfileImage" id="updateLabel" onClick={triggerFileInput}>Update</p>
                                   
                                   <div className="form-group">
                                       <input
                                           type="file"
                                           id="ProfileImage"
                                           ref={fileInputRef}
                                           name="UserImage"
                                           accept="image/*"
                                           style={{ display: 'none' }}
                                           onChange={handleImageChange}
                                       />
                                   </div>
                                   
                                   <p style={{ color: 'black', cursor: 'pointer' }} onClick={handleRemoveImage}>Remove</p>
                               </div>
                               
                               <div className="ExtraInfo">
                                   <p>Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.</p>
                               </div>
                           </div>
                       </div>
                       
                       <div className="UserName">
                           <h5>Book Name</h5>
                           <textarea
                               className="block p-2.5 w-[50%] text-sm text-gray-900 bg-gray-100 rounded-lg focus:ring-0 focus:outline-none h-24 resize-none"
                               placeholder="UserName..."
                               style={{ height: '20px', fontSize: '10px' }}
                               onChange={(e) => setbookname(e.target.value)}
                               value={bookname}
                               defaultValue={book.bookName}
                              
                               required
                           />
                       </div>
                       <div className="UserName">
                           <h5>Book Name</h5>
                           <textarea
                               className="block p-2.5 w-[50%] text-sm text-gray-900 bg-gray-100 rounded-lg focus:ring-0 focus:outline-none h-24 resize-none"
                               placeholder="UserName..."
                               style={{ height: '20px', fontSize: '10px' }}
                               onChange={(e) => setbookdescription(e.target.value)}
                               value={bookdescription}
                                defaultValue={book.bookDescription}
                               required
                           />
                       </div>
                       <div className="UserName">
                           <h5>Book Category</h5>
                           
            {/* For Category Select */}
<select
  onChange={(e) => {
    const selectedCat = categories?.find(c => c.categoryId === e.target.value);
    setbookcategory(selectedCat || null);
  }}
   
  defaultValue={book.categoryId}
>
  <option value="" disabled>Select a category</option>
  {categories?.map((category: Category) => (
    <option value={category.categoryId} key={category.categoryId}>
      {category.categoryName}
    </option>
  ))}
</select>



                       </div>

                       <div className="UserName">
                           <h5>Book Author</h5>
                           <select
                             
                               style={{ height: '30px', fontSize: '10px' }}
                             
                               defaultValue={book.author?.authorName}
                               required
                           >
                               <option value="" disabled>Select a Author</option>
                              {authors?.map((author: Author) => (
                                <option value={author.authorName} key={author.authorId} onClick={() => setbookauthor(author)}>
                                  {author.authorName}
                                </option>
                              ))}
                           </select>
                       </div>

                      
                       
                      
                       
                       <div className="w-full h-[2px] bg-gray-100"></div>
                       
                       <div className="Options w-full flex gap-2 items-end justify-end mt-[2rem]">
                           <button type="button" className="save-button cancel-button" onClick={onClose} >
                               <div className="svg-wrapper-1">
                                   <div className="svg-wrapper">
                                       <svg style={{ all: 'unset' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                                           <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
                                       </svg>
                                   </div>
                               </div>
                               <span>Cancel</span>
                           </button>
                           
                           <button type="submit" className="save-button" style={{"backgroundColor":"palevioletred"}}>
                               <div className="svg-wrapper-1">
                                   <div className="svg-wrapper">
                                       <svg style={{ all: 'unset' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon">
                                           <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
                                       </svg>
                                   </div>
                               </div>
                               <span>Save</span>
                           </button>
                       </div>
                   </form>
               </div>
                 }
               </>
   );
}