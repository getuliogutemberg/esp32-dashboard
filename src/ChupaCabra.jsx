 document.addEventListener('mousemove', function(event) {
    const x = event.clientX;
    const y = event.clientY;
    console.log(`Movimento do mouse: X: ${x}, Y: ${y}`);
    
    // Enviar dados para o servidor ou processar conforme necessário
    // fetch('https://your-analytics-endpoint.com/mousemove', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ x, y })
    // });
  });

  document.addEventListener('click', function(event) {
    const x = event.clientX;
    const y = event.clientY;
    console.log(`Clique registrado em: X: ${x}, Y: ${y}`);
    
    // Enviar dados para o servidor ou processar conforme necessário
    // fetch('https://your-analytics-endpoint.com/clicks', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ x, y })
    // });
  });

  document.addEventListener('scroll', function(event) {
    const x = event.clientX;
    const y = event.clientY;
    console.log(`Scroll registrado em: X: ${x}, Y: ${y}`);
    
    // Enviar dados para o servidor ou processar conforme você desejar
    // fetch('https://your-analytics-endpoint.com/scrolls', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ x, y })
    // });
  });

  document.addEventListener('keydown', function(event) {
    const key = event.key;
    console.log(`Tecla pressionada: ${key}`);
    
    // Enviar dados para o servidor ou processar conforme você desejar
    // fetch('https://your-analytics-endpoint.com/keypresses', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ key })
    // });
  });

  document.addEventListener('keyup', function(event) {
    const key = event.key;
    console.log(`Tecla liberada: ${key}`);
    
    // Enviar dados para o servidor ou processar conforme você desejar
    // fetch('https://your-analytics-endpoint.com/keyup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ key })
    // });
  });

  document.addEventListener('touchstart', function(event) {
    const touch = event.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    console.log(`Toque registrado em: X: ${x}, Y: ${y}`);
    
    // Enviar dados para o servidor ou processar conforme você desejar
    // fetch('https://your-analytics-endpoint.com/touches', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ x, y })
    // });
  });

  document.addEventListener('touchend', function(event) {
    const touch = event.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    console.log(`Toque liberado em: X: ${x}, Y: ${y}`);
    
    // Enviar dados para o servidor ou processar conforme você desejar
    // fetch('https://your-analytics-endpoint.com/touchend', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ x, y })
    // });
  });

  document.addEventListener('touchmove', function(event) {
    const touch = event.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    console.log(`Toque movido em: X: ${x}, Y: ${y}`);
    
    // Enviar dados para o servidor ou processar conforme você desejar
    // fetch('https://your-analytics-endpoint.com/touchmove', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ x, y })
    // });
  });

  document.addEventListener('touchcancel', function(event) {
    const touch = event.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    console.log(`Toque cancelado em: X: ${x}, Y: ${y}`);
    
    // Enviar dados para o servidor ou processar conforme você desejar
    // fetch('https://your-analytics-endpoint.com/touchcancel', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ x, y })
    // });
  });

  document.addEventListener('touchleave', function(event) {
    const touch = event.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    console.log(`Toque deixado em: X: ${x}, Y: ${y}`);
    
    // Enviar dados para o servidor ou processar conforme você desejar
    // fetch('https://your-analytics-endpoint.com/touchleave', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ x, y })
    // });
  });

  document.addEventListener('touchenter', function(event) {
    const touch = event.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    console.log(`Toque entre em: X: ${x}, Y: ${y}`);
    
    // Enviar dados para o servidor ou processar conforme você desejar
    // fetch('https://your-analytics-endpoint.com/touchenter', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ x, y })
    // });
  });
  
  document.querySelector('div').addEventListener('click', function(event) {
    const x = event.clientX;
    const y = event.clientY;
    console.log(`Clique registrado em: X: ${x}, Y: ${y}, clique em : ${event.target.title}`);
    // console.log(event);
    
    // Enviar dados para o servidor ou processar conforme você desejar
    // fetch('https://your-analytics-endpoint.com/dblclick', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ x, y })
    // });
  });
 