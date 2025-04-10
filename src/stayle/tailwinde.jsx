import React, { useEffect } from 'react';

const ExternalScriptComponent = () => {
  useEffect(() => {
    const boxiconsLink = document.createElement('link');
    boxiconsLink.href = '<link href="https://unpkg.com/boxicons/css/boxicons.min.css" rel="stylesheet">';
    boxiconsLink.rel = 'stylesheet';
    document.head.appendChild(boxiconsLink);

    const chartJsScript = document.createElement('script');
    chartJsScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    chartJsScript.async = true;
    document.body.appendChild(chartJsScript);

    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    tailwindScript.async = true;


    tailwindScript.onload = () => {
      window.tailwind.config = {
        theme: {
          extend: {
            colors: {
              wood: {
                50: '#faf6f2',
                100: '#f5ede3',
                200: '#ead9c7',
                300: '#ddc2a5',
                400: '#cca57d',
                500: '#bd8c5e',
                600: '#a97347',
                700: '#8c5e3b',
                800: '#734d34',
                900: '#5f402e',
              },
              olive: {
                50: '#f8f9f2',
                100: '#eef0e2',
                200: '#dde3c7',
                300: '#c5cea3',
                400: '#aab77d',
                500: '#8d9c5a',
                600: '#6f7c43',
                700: '#5a6538',
                800: '#4a5331',
                900: '#3e462c',
              },
              fontFamily: {
                'sans': ['Poppins', 'sans-serif'],
                'serif': ['Lora', 'serif'],
                'brand': ['Montserrat', 'sans-serif'],
              }
            }
          }
        }
      };

    };

    // Append the Tailwind CSS script to the body
    document.body.appendChild(tailwindScript);

    // Cleanup on component unmount
    return () => {
      document.head.removeChild(boxiconsLink);
      document.body.removeChild(chartJsScript);
      document.body.removeChild(tailwindScript);
    };
  }, []);

  return <></>; 
};

export default ExternalScriptComponent;
