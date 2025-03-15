import styled from 'styled-components';

export const Container = styled.div`
  background: #E6E6E6;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  color: #000000;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 1%;
  margin-bottom: 1%;
`

export const Info = styled.div`
  height: 50%;
  width: 100%;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  color: #000000;
`

export const Box = styled.div`
  height: 50%;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
`

export const Status = styled.div`
  height: 50%;
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  color: ${props => props.color};
  margin-top: 3%;
  margin-bottom: 1%;
`

export const ButtonsBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
`

export const Button = styled.button`
  margin-top: 5%;
`