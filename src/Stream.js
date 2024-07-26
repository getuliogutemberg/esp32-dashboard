// src/Stream.js
import React from 'react';



function Stream({description,features}) {


  return (
      <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', padding: '10px',maxWidth: '400px'}} >
    

<iframe width="400" height="230"  src={"https://www.youtube.com/embed/mFR_uCIqJRg?controls=0&autoplay=1&mute=1&loop=1&modestbranding=1&rel=0" } title="esp32" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{ pointerEvents:'none',margin:'0px',borderRadius:'10px'}}></iframe>
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'start', alignItems: 'start', padding: '0px', width: '100%'  }} >
        <p style={{ fontSize: '15px',margin:'0px',padding:'0px',textAlign: 'start',fontStyle: 'italic',width: '100%'}}>

  {description[0]}
  </p>
  <p style={{ fontSize: '15px',marginTop:'10px',padding:'0px',textAlign: 'start',fontStyle: 'italic',width: '100%' }}>
  {description[1]}
  
  <ul style={{ fontSize: '15px',margin:'10px 0px 0px 0px',padding:'0px 0px 0px 10px',textAlign: 'start',fontStyle: 'normal',width: '100%'}}>
    {features.map((feature) => (
      <li key={feature.title} style={{ 
        fontSize: '14px', 
        width: '100%',
        fontStyle: 'bold',
        marginTop:'10px',
        cursor: 'pointer', // cursor as a hand
        transition: 'color 0.3s ease infinite', // smooth color transition
      }}
      onMouseEnter={(e) => {
        e.currentTarget.querySelector('strong').style.color = '#1976d2'; // Change color on hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.querySelector('strong').style.color = 'inherit'; // Reset color
      }}
      >
        <strong>{feature.title}</strong>: {feature.description}
      </li>
    ))}
  </ul>
  
  
</p>
<p style={{ fontSize: '15px',marginTop:'0px',padding:'0px',textAlign: 'start',fontStyle: 'italic',width: '100%' }}>
{description[3]}
  </p>
<p style={{ fontSize: '15px',marginTop:'0px',padding:'0px',textAlign: 'start',fontStyle: 'italic',width: '100%' }}>
{description[4]}
</p>
</div>
    </div>
  );
}

export default Stream;


