import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
`;

export const Form = styled.form`
  width: 450px;
  height: 80%;
  background: #E5E5E5AA;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
    width: 100px;
    margin: 10px 0 40px;
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
  color: #224b22;
  width: 100%;
  padding-top: 3%;
  padding-bottom: 3%;
  border-radius: .5rem;
`