// src/Stream.js
import React from 'react';
// import axios from 'axios';


function Stream() {
  
  // const [iframeSrc, setIframeSrc] = useState(null);
  

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     try {
  //       const response = await axios.get("https://esp32-data-api-1.onrender.com/token");
  //       console.log(response)
  //       if (response) {
         
  //         setIframeSrc( response.data );
  //       }
  //     } catch (error) {
  //       console.error('Erro ao buscar o token:', error);
  //     }
  //   };

  //   fetchToken();
  // }, []);

 

  // const handleInputChange = (event) => {
  //   setIframeSrc(event.target.value);
    
  // };

  return (
      <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', margin: '0 auto'  }} >
      
      {/* <iframe
       
        
        width="450"
        height="395"
        src={'https://www.youtube.com/live/mFR_uCIqJRg'}
        title="esp32"
        frameBorder="0"
        // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        // referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        style={{ marginTop: '10px', border: '0px solid #ccc', borderRadius: '10px',display: iframeSrc ? 'block' : 'none',marginBottom: '20px' }}
      ></iframe> */}

<iframe width="450" height="255" src="https://www.youtube.com/embed/mFR_uCIqJRg?controls=0&autoplay=1&mute=1&loop=1&modestbranding=1&rel=0" title="esp32" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style={{ pointerEvents:'none',margin:'20px',borderRadius:'10px'}}></iframe>
      {/* <div >

      <label htmlFor="iframeSrc" style={{ fontSize: '25px'}} title='https://rb.gy/ '>Stream: </label>
       <input
        id="iframeSrc"
        type="text"
        placeholder="token"
        value={iframeSrc || ''}
        onChange={handleInputChange}
        style={{ margin: '20px' , padding: '10px', fontSize: '25px', borderRadius: '5px', border: '1px solid #ccc',textAlign: 'center' }}
        />
        </div> */}
    </div>
  );
}

export default Stream;


