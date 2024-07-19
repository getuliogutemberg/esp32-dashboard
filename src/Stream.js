// src/Stream.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Stream() {
  
  const [iframeSrc, setIframeSrc] = useState(null);
  

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get("https://esp32-data-api-1.onrender.com/token");
        console.log(response)
        if (response) {
         
          setIframeSrc( response.data );
        }
      } catch (error) {
        console.error('Erro ao buscar o token:', error);
      }
    };

    fetchToken();
  }, []);

 

  const handleInputChange = (event) => {
    setIframeSrc(event.target.value);
    
  };

  return (
      <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap'   }} >
      
      <iframe
       
        
        width="450"
        height="395"
        src={'https://rb.gy/' + iframeSrc}
        title="esp32"
        frameBorder="0"
        // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        // referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        style={{ marginTop: '10px', border: '0px solid #ccc', borderRadius: '10px',display: iframeSrc ? 'block' : 'none' }}
      ></iframe>
      <div >

      <label htmlFor="iframeSrc" style={{ fontSize: '25px'}} title='https://rb.gy/ '>Stream: </label>
       <input
        id="iframeSrc"
        type="text"
        placeholder="token"
        value={iframeSrc || ''}
        onChange={handleInputChange}
        style={{ margin: '20px' , padding: '10px', fontSize: '25px', borderRadius: '5px', border: '1px solid #ccc',textAlign: 'center' }}
        />
        </div>
    </div>
  );
}

export default Stream;


