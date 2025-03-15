import styled from 'styled-components';

export const Container = styled.div`
  background: #e6e6e655;
  border-radius: 10px;
  padding: 16px;
  width: 80%;
  color: #000000;
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 1%;
  margin-bottom: 1%;
  justify-content: space-between;
`
export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #000000;
`

export const Content = styled.div`
  align-items: flex-start;
  display: flex;
  width: 100%;
  flex-direction: column;
  color: #000000;
`

export const ButtonContainer = styled.div`
  align-items: flex-start;
  display: flex;
  width: 10%;
  flex-direction: column;
  color: #000000;
`

export const Info = styled.div`
  height: 50%;
  width: 100%;
  align-items: flex-start;
  margin-top: 1%;
  margin-bottom: 1%;
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