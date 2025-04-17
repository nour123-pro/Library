import React from "react";
import '../assets/css/style.css'
export default function Hero() {
  return (
    <div>
    <div className="hero" >
      <div className="BigLetter wanted">
        <div className="dotes">
          <div className="dot left"></div>
          <div className="dot right"></div>
        </div>
        <h1 >B</h1>
      </div>
      <div className="BigLetter">
        <h1>O</h1>
      </div>

      <div className="vertical-text first">
        <div className="border">
          <h5>BOOK</h5>
          <img src="src/assets/images/dove.png" alt="" width="20" height="20" style={{ alignSelf: 'center' }} />
        </div>
        My Brillant Friend
        <div className="border"></div>
      </div>
      <div className="vertical-text second">
        <div>
          <i className="fi fi-rs-eye"></i>
        </div>

        <span className="nosifer-regular">
          19<span style={{ color: "black" }}>8</span>4
        </span>
        <div>
          <h5>George Orwell</h5>
        </div>
      </div>
      <div className="vertical-text third">
        <span style={{ fontSize: "xx-small", writingMode: "initial" }}>Victor Hugo</span>
        <span className="asset-regular">Les Misérables</span>

        <img
          src="src/assets/images/Screenshot_2025-03-27_at_6.07.43_PM-removebg-preview.png"
          alt=""
          width="20"
          height="auto"
        />
      </div>
      <div className="vertical-text four">
        <div className="border">
          <h5></h5>
          <img
            src="src/assets/images/Screenshot_2025-03-27_at_12.20.30_AM-removebg-preview.png"
            alt=""
            width="20"
            height="auto"
          />
        </div>
        <span>
          THE PSYCHOLOGY OF <span style={{ color: "green" }}>Money</span>
        </span>
      </div>
      <div className="vertical-text five">
        

        <span>Nothing to Envey</span>
        
        <img src="src/assets/images/freedom.png" alt="" width="20px" height="auto" />
      </div>
      <div className="BigLetter">
        <h1>O</h1>
      </div>
      <div className="BigLetter">
        <h1>K</h1>
      </div>

     

      
    </div>
     <div className="heroborder"></div>
    </div>
  );
}
