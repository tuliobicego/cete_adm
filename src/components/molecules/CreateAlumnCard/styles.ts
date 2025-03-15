import styled from 'styled-components';

export const Container = styled.div`
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 4%;
`

export const Info = styled.div`
  height: 50%;
  width: 100%;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Button = styled.button`
  margin-top: 4%;
  background: #2d76b2;
  color: #E6E6E6;
`

export const InputContainer = styled.div`
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-evenly

`

export const InputGroup = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  flex-direction: column;
  margin-top: 2%
`

export const DateContainer = styled.div`
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: left;
  flex-direction: column;
  margin-top: 2%;
  justify-content: flex-start;
`