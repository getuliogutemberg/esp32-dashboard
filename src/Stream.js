// src/Stream.js
import React from 'react';
// import axios from 'axios';

import Slider from 'react-slick';


const features = [
  {
    title: "Sensor de Luminosidade",
    description: "Medimos a intensidade da luz para ajustar a iluminação de acordo com a necessidade das plantas.",
  },
  {
    title: "Sensor de Umidade",
    description: "Controlamos a umidade do ambiente para otimizar o crescimento das plantas.",
  },
  {
    title: "Sensor de Temperatura",
    description: "Monitoramos a temperatura para garantir condições ideais para o cultivo.",
  },
  {
    title: "Controle de Ventilação",
    description: "Ajustamos a ventilação automaticamente para manter o ambiente adequado.",
  },
  {
    title: "Ajuste de Iluminação",
    description: "Ajustamos a intensidade da iluminação com base na leitura do sensor de luminosidade.",
  }
];

const  settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};


function Stream() {
  
  

  return (
      <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', padding: '10px',maxWidth: '400px'}} >
      
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

<iframe width="400" height="230"  src="https://www.youtube.com/embed/mFR_uCIqJRg?controls=0&autoplay=1&mute=1&loop=1&modestbranding=1&rel=0" title="esp32" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{ pointerEvents:'none',margin:'0px',borderRadius:'10px'}}></iframe>
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
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'start', alignItems: 'start', padding: '0px', width: '100%'  }} >
        <p style={{ fontSize: '15px',margin:'0px',padding:'0px',textAlign: 'start',fontStyle: 'italic',width: '100%'}}>
  Este projeto envolve a coleta e visualização de dados de diferentes sensores em um dashboard interativo. 
  </p>
  <p style={{ fontSize: '15px',marginTop:'10px',padding:'0px',textAlign: 'start',fontStyle: 'italic',width: '100%' }}>
  O projeto utiliza os seguintes sensores:
  
  {/* <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', margin: '0 auto'  }}>
  <Slider {...settings}>
      {features.map((feature) => (
        <div key={feature.title}>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </Slider>
  
  </div> */}
  <ul style={{ fontSize: '15px',margin:'10px 0px 0px 0px',padding:'0px 0px 0px 10px',textAlign: 'start',fontStyle: 'normal',width: '100%'}}>
    {features.map((feature) => (
      <li key={feature.title} style={{ 
        fontSize: '14px', 
        width: '100%',
        fontStyle: 'bold',
        marginTop:'10px',
        cursor: 'pointer', // cursor as a hand
        transition: 'color 0.3s ease', // smooth color transition}}
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
  Esses dados são enviados para um servidor, processados e exibidos em gráficos no nosso painel, permitindo análise e monitoramento em tempo real.
  </p>
<p style={{ fontSize: '15px',marginTop:'0px',padding:'0px',textAlign: 'start',fontStyle: 'italic',width: '100%' }}>
  O dashboard inclui gráficos interativos que mostram as leituras mais recentes e os históricos dos sensores. Utilizamos gráficos de linhas, barras e áreas para visualizar as diferentes variáveis e facilitar a interpretação dos dados coletados. Com essas funcionalidades, é possível monitorar e ajustar as condições do ambiente de forma eficiente.
</p>
</div>
    </div>
  );
}

export default Stream;


