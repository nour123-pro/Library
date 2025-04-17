import React from 'react';

function Books() {
    return (
        <div className="Books">
            <div className="Book">
                <img src="src/assets/images/book-11.png" alt="Romantic Vibes" />
                <div className="flex">
                    <span className="dotspan"></span>
                    <p>Romantic Vibes</p>
                </div>
            </div>

            <div className="Book">
                <img src="src/assets/images/book-16.png" alt="Inspirational Vibes" />
                <div className="flex">
                    <span className="dotspan"></span>
                    <p>Inspirational Vibes</p>
                </div>
            </div>

            <div className="Book">
                <img src="src/assets/images/book-12.png" alt="Scientific Vibes" />
                <div className="flex">
                    <span className="dotspan"></span>
                    <p>Scientific Vibes</p>
                </div>
            </div>
        </div>
    );
}

export default Books;
