import React from 'react';

// Componente Link personalizado
const ExternalLink = ({ href, children, ...props }) => {
  const isExternal = href && !href.startsWith(window.location.origin);
  return (
    
  
    <a  title={'Link externo para '+ children }
        id='link'
        onMouseEnter={(e) => {
            e.currentTarget.querySelector('strong').style.color = '#1976d2'; // Change color on hover
        }}
        onMouseLeave={(e) => {
            e.currentTarget.querySelector('strong').style.color = 'inherit'; // Reset color
        }}
      style={{ position: 'relative', top: 0,textDecoration: 'none', display: 'block', color: 'white' }}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
        <strong><h1 title={'Link externo para '+ children } style={{ margin: '35px 0px 0px 0px', padding: '0px'}}>{children}</h1></strong>
    </a>
  );
};

export default ExternalLink;