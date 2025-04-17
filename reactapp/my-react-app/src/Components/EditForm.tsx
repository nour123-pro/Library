import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import "../assets/css/editform.css";
import { Account, Category, User } from "./interfaces";
import { useAuth } from "./AuthContext";

export default function EditForm({ account, show, onClose, oldusername, setimagenew }: { account: Account, show: boolean, onClose: (params: { newusername: string }) => void, oldusername: string, setimagenew: () => void }) {
    const [imagePreview, setImagePreview] = useState<string>();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [newusername, setNewUsername] = useState<string>(oldusername);
    const [selectedcategoryid, setSelectedCategoryId] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const suse=useAuth();
    // Handle image selection
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

    const fetchCategories = async (): Promise<Category[]> => {
        try {
            const response = await axios.get<Category[]>('http://localhost:5000/api/category/AllCategories');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Unable to load Categories Data');
            return [];
        }
    };

    const handleApiError = (error: unknown, defaultMessage: string): void => {
        if (axios.isAxiosError(error)) {
            const serverResponse = error.response?.data;
            setError(serverResponse?.message || error.response?.statusText || defaultMessage);
        } else {
            setError('An unexpected error occurred');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        
        const formData = new FormData();
        formData.append('oldusername', oldusername);
        formData.append('newusername', newusername);
        formData.append('selectedcatgeoryid', selectedcategoryid);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        const getBase64 = (file: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result?.toString() || '');
            reader.onerror = error => reject(error);
          });
        };
      
        const imageBase64 = imageFile ? await getBase64(imageFile) : null;
        const requestdata={
          oldusername,
          newusername,
          selectedcategoryid,
          imageBase64
        }
     
       
        try {
            const response = await axios.post('http://localhost:5000/api/Account/EditAccountInfo', requestdata, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.status >= 200 && response.status < 300) {
              const token=localStorage.getItem("token");
                await localStorage.setItem("username", newusername);
                const willitbe=localStorage.getItem("username");
                alert("newuserin local storage:"+willitbe);
                
                if(token!=null){
                  suse.login(newusername,token);
                 
                }else{
                  window.location.reload();
                }
               
                alert(response.data.message || "Profile updated successfully");
                onClose({newusername});
                setimagenew();
            }
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

    useEffect(() => {
        const loadData = async () => {
            try {
                const categoriesData = await fetchCategories();
                setCategories(categoriesData);
                setImagePreview(`data:image;base64,${account.accountProfileImage}`)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
            }
        };

        loadData();
    }, []);

    return (
        <div style={{ width: "80%", height: '60%', alignItems: "center", margin: '0' }} className={`LoginForm ${show ? "show" : ""}`}>
            <form style={{ width: "100%", height: "100%" }} className="EditProfileForm flex-colomn border-none" onSubmit={handleSubmit}>
                <button type="button" onClick={()=>onClose({newusername})} className="text-gray-500 hover:text-red-700 text-4xl ml-auto">&times;</button>
                
                <h2 style={{ alignSelf: 'center', marginTop: '2%' }}>Profile Information</h2>
                
                <div className="ImageSection flex-row" style={{ display: "flex", alignItems: 'center', justifyContent: "flex-start" }}>
                    <div style={{ margin: "0", alignSelf: "flex-start" }}>
                        <h5>Photo</h5>
                        <div className="ImageHolder">
                            <img id="preview" alt="Current Profile Image" style={{ width: '150px', height: '150px' }} src={`${imagePreview}`} />
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
                    <h5>UserName</h5>
                    <textarea
                        className="block p-2.5 w-[50%] text-sm text-gray-900 bg-gray-100 rounded-lg focus:ring-0 focus:outline-none h-24 resize-none"
                        placeholder="UserName..."
                        style={{ height: '20px', fontSize: '10px' }}
                        onChange={(e) => setNewUsername(e.target.value)}
                        value={newusername}
                        required
                    />
                </div>
                
                <div className="UserPreferedCategories">
                    <h5>LOVE TO READ?</h5>
                    {categories.map((category: Category) => (
                        <button
                            key={category.categoryId}
                            type="button"
                            className={`category-button w-fit h-fit flex justify-center gap-2 items-center mx-auto shadow-xl text-[9px] text-gray-50 bg-[#0A0D2D] backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#FFFFFF] hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-500 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group ${
                                selectedcategoryid === category.categoryId ? 'selected' : ''
                            }`}
                            onClick={() => setSelectedCategoryId(category.categoryId)}
                        >
                            {category.categoryName}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 19" className="w-7 h-7 justify-end bg-gray-50 group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-gray-700 p-2 rotate-45">
                                <path className="fill-gray-800 group-hover:fill-gray-800" d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"></path>
                            </svg>
                        </button>
                    ))}
                </div>
                
                <div className="w-full h-[2px] bg-gray-100"></div>
                
                <div className="Options w-full flex gap-2 items-end justify-end mt-[2rem]">
                    <button type="button" className="save-button cancel-button" onClick={() => onClose({ newusername })}>
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