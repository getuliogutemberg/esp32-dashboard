// src/Stream.js
import React, { useState } from 'react';


function Stream() {
  
  const [iframeSrc, setIframeSrc] = useState('wmlgqm');

 

  const handleInputChange = (event) => {
    setIframeSrc(event.target.value);
    
  };

  return (
      <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap'   }} >
      
      <iframe
       
        
        width="700"
        height="395"
        src={'https://rb.gy/' + iframeSrc}
        title="esp32"
        frameBorder="0"
        // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        // referrerPolicy="strict-origin-when-cross-origin"
        // allowFullScreen
        style={{ marginTop: '10px', border: '0px solid #ccc', borderRadius: '10px' }}
      ></iframe>
      <div >

      <label htmlFor="iframeSrc" style={{ fontSize: '25px'}} title='https://rb.gy/ '>Enter Code: </label>
       <input
        id="iframeSrc"
        type="text"
        placeholder="Enter iframe URL"
        value={iframeSrc}
        onChange={handleInputChange}
        style={{ marginTop: '20px' , padding: '10px', fontSize: '25px', borderRadius: '5px', border: '1px solid #ccc',textAlign: 'center' }}
        />
        </div>
    </div>
  );
}

export default Stream;


