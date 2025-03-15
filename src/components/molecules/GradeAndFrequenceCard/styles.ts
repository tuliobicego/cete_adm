import styled from 'styled-components';

export const Container = styled.div`
  border-radius: 10px;
  padding: 16px;
  width: 50%;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  margin-top: 1%;
  margin-bottom: 1%;
  background: #e6e6e655;
`
export const InfoContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  color: #000000;
`

export const Info = styled.div`
  height: 100%;
  width: 100%;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
`

export const Status = styled.div`
  height: 50%;
  width: 100%;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  color: ${props => props.color};
  margin-top: 1%;
  margin-bottom: 1%;
`