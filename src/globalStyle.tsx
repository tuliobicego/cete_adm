import { createGlobalStyle } from "styled-components"

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;500&display=swap');

  
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font: 14px 'Roboto', sans-serif;
    background: #ffffff;
    color: #333;
    -webkit-font-smoothing: antialiasing !important;
    
    -webkit-scrollbar: {
      width: 5px;
      height: 6px;
    };
    -webkit-scrollbar-thumb: {
      background: #3ea175;
      border-radius: 10px;
    };
    -webkit-scrollbar-thumb:hover {
      background: #a5aaad;
    };

  }

  ul {
    list-style: none;
  }

  h1 {
      font-family: 'Roboto', sans-serif;
      color: #2E382E
;
      font-size: 1.125rem;
      line-height: 1.625rem;
      font-weight: 100;

      @media only screen and (max-width: 890px) {
        font-size: 1rem;
      }
    
      @media only screen and (max-width: 414px) {
        font-size: .75rem;
      }
  }
  h2 {
      font-family: 'Roboto', sans-serif;
      color: #2E382E
;
      font-size: 1.25rem;
      line-height: 1.75rem;
      font-weight: 100;

      @media only screen and (max-width: 890px) {
        font-size: 1.325rem;
      }
    
      @media only screen and (max-width: 414px) {
        font-size: .875rem;
      }
  }
  h3 {
      font-family: 'Roboto', sans-serif;
      color: #2E382E
;
      font-size: 1.5rem;
      line-height: 2rem;
      font-weight: 100;

      @media only screen and (max-width: 890px) {
        font-size: 1.625rem;
      }
    
      @media only screen and (max-width: 414px) {
        font-size: 1rem;
      }
  }
  h4 {
      font-family: 'Roboto', sans-serif;
      color: #2E382E
;
      font-size: 1.75rem;
      line-height: 2.375rem;
      font-weight: 100;

      @media only screen and (max-width: 890px) {
        font-size: 1.875rem;
      }
    
      @media only screen and (max-width: 414px) {
        font-size: 1.25rem;
      }
  }
  h5 {
      font-family: 'Roboto', sans-serif;
      color: #2E382E
;
      font-size: 2rem;
      line-height: 2.625rem;
      font-weight: 100;

      @media only screen and (max-width: 890px) {
        font-size: 2rem;
      }
    
      @media only screen and (max-width: 414px) {
        font-size: 1.5rem;
      }
  }
  h6 {
      font-family: 'Roboto', sans-serif;
      color: #2E382E
;
      font-size: 2.375rem;
      line-height: 3.0625rem;
      font-weight: 100;

      @media only screen and (max-width: 890px) {
        font-size: 2rem;
      }
    
      @media only screen and (max-width: 414px) {
        font-size: 1.625rem;
      }
  }

  a {
      text-decoration: none;
      outline: none;
      color: #64B464;

      :hover {
          color: #E3E3E3;
      }
  }
  
  *:focus {
      outline: none;
  }
  
  .rbc-events-container {
    display: grid;
    grid-template-rows: repeat(24, 40px);
  }
  
  .rbc-day-slot .rbc-event {
    position: static;
  }
  .rbc-day-slot .rbc-event--global {
    background-color: #fbab18;
  }
  
  .rbc-day-slot .rbc-event--regional {
    background-color: #6ebe4a;
  }

`