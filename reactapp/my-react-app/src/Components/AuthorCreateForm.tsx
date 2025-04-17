import { useRef, useState } from "react";
import { Author } from "./interfaces";
import axios from "axios";

export default function AuthorCreateForm({show,onClose}:{show:boolean,onClose: () => void}){
     const[authorname,setauthorname]=useState<string>();
     const[authorimage,setauthorimage]=useState<File>();
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
                reader.onload = () => resolve(reader.result?.toString() || '');
                reader.onerror = error => reject(error);
              });
            };
          
            const ImageBase64 = imageFile ? await getBase64(imageFile) : null;
            
            
            const requestdata={
            
              authorname,
             
              ImageBase64
            }
           
           
           
            try {
                const response = await axios.post('http://localhost:5000/api/Authors/CreateAuthor', requestdata, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
               
                    alert(response.data.message);
                    onClose();
           
    
               
            } catch (error) {
              if (axios.isAxiosError(error)) {
                const serverResponse = error.response?.data;
                if (serverResponse?.errors) {
                    alert(serverResponse.errors.join('\n'));
                } 
                else if (serverResponse?.message) {
                    alert(serverResponse.message);
                }
                else {
                    alert(error.response?.statusText || 'Signup failed');
                }
            } else {
                alert('An unexpected error occurred');
            }
            }
        };

    return(
            <div style={{ width: "50%", height: '60%', alignItems: "center", margin: '0' }} className={`LoginForm ${show ? "show" : ""}`}>
                    <form style={{ width: "100%", height: "100%" }} className="EditProfileForm flex-colomn border-none" onSubmit={handleSubmit}>
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-red-700 text-2xl ml-auto "style={{margin:"0"}} >&times;</button>
                        
                        <h2 style={{ alignSelf: 'center', marginTop: '2%' }}>ADD AUTHOR</h2>
                        
                        <div className="ImageSection flex-row" style={{ display: "flex", alignItems: 'center', justifyContent: "flex-start" }}>
                            <div style={{ margin: "0", alignSelf: "flex-start" }}>
                                <h5>Photo</h5>
                                <div className="ImageHolder">
  <img
    id="preview"
    alt="Current Profile Image"
    style={{ width: '150px', height: '150px' }}
    src={
        imagePreview 
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
                            <h5>Author Name</h5>
                            <textarea
                                className="block p-2.5 w-[50%] text-sm text-gray-900 bg-gray-100 rounded-lg focus:ring-0 focus:outline-none h-24 resize-none"
                                placeholder="UserName..."
                                style={{ height: '20px', fontSize: '10px' }}
                                onChange={(e) => setauthorname(e.target.value)}
                                value={authorname}
                               
                                required
                            />
                        </div>
                        
                       
                        
                        <div className="w-full h-[2px] bg-gray-100"></div>
                        
                        <div className="Options w-full flex gap-2 items-end justify-end mt-[2rem]">
                            <button type="button" className="save-button cancel-button" onClick={onClose}>
                                <div className="svg-wrapper-1">
                                    <div className="svg-wrapper">
                                        <svg style={{ all: 'unset' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                                            <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <span>Cancel</span>
                            </button>
                            
                            <button type="submit" className="save-button">
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
    );
}