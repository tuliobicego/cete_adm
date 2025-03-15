import styled from "styled-components";



export const Container = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: #2d76b2;
  width: 100%;

  overflow-y: auto; 
  overflow-x: hidden; 

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; 
  }

  scrollbar-width: none;

  -ms-overflow-style: none;
`;


export const Content = styled.div`
  width: max-content;
  height: max-content;
  background: #E5E5E5AA;
  border-radius: 20px;
  margin-top: 5%;
  padding: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
export const Form = styled.form`

  
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  width: 400px;

  overflow-y: auto; 
  overflow-x: hidden; 

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; 
  }

  scrollbar-width: none;

  -ms-overflow-style: none;
  div {
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  img {
    margin-top: 20%;
    width: 35%;
    margin-bottom: 20%;
  }
  p {
    color: #ff3333;
    margin-bottom: 15px;
    border: 1px solid #ff3333;
    padding: 10px;
    width: 100%;
    text-align: center;
  }
  input {
    height: 46px;
    margin-bottom: 15px;
    border-radius: 10px;
    padding: 10px 20px;
    color: #777;
    font-size: 15px;
    width: 100%;
    border: 0px solid #ddd;
    &::placeholder {
      color: #999;
    }
  }
  hr {
    margin: 20px 0;
    border: none;
    border-bottom: 1px solid #cdcdcd;
    width: 100%;
  }
  a {
    font-size: 16;
    font-weight: bold;
    color: #999;
    text-decoration: none;
  }
`;

export const Button = styled.button`
  margin-top: 4%;
  background: #E6E6E6;
  color: #2d76b2;
  width: 100%;
  padding-top: 3%;
  padding-bottom: 3%;
  border-radius: .5rem;
`