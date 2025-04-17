import axios from "axios";
import { useState } from "react";
import { useAsyncError } from "react-router-dom";

export default function RatingBook({bookid}:{bookid:string}) {
    const [ratingvalue, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    

    const handleSubmit =async (selectedRating: number) => {
        setRating(selectedRating);
        const apirul="http://localhost:5000/api/Rating/RatingBook";
        const username=localStorage.getItem("username");
        console.log("username"+username);
        const requestbody={
             bookid,
             ratingvalue,
             username

        }
        try {
            const response=await axios.post(apirul,requestbody,{
                headers: { 
                    'Content-Type': 'application/json' ,
                    'Accept': 'application/json'
                  },
            });
            if(response.data.message){
                 alert(response.data.message);
                 
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Proper error handling for Axios
                const serverResponse = error.response?.data;
                        if (serverResponse?.errors) {
                            alert(serverResponse.errors.join('\n'));
                        } 
                        else if (serverResponse?.message) {
                            alert(serverResponse.message);
                        }
                        else {
                            alert(error.response?.statusText || 'Rating Book failed,try again');
                        }
              } else {
                alert(error);
              }
        }
    };
    

    return (
        <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <i
                    key={star}
                    className={`fa-solid fa-star ${(hover || ratingvalue) >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                    onClick={() => handleSubmit(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    style={{ cursor: 'pointer', fontSize: '24px', transition: 'color 0.2s' }}
                />
            ))}
        </div>
    );
}