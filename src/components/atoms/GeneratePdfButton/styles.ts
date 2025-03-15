import styled from 'styled-components';


export const Container = styled.div`
  background: #e6e6e633;
  border-radius: 10px;
  padding: 16px;
  width: 40%;
  color: #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin-top: 1%;
  margin-bottom: 1%;
`
export const InfoContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  color: #000000;
`

export const Info = styled.div`
  height: 100%;
  width: 100%;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
`
export const ButtonContainer = styled.div`
  border-radius: 10px 10px;
  justify-content: center;
  display: flex;

  color: #FFFFFF;
  margin-right: 2%;
  margin-left: 2%;

  button {
    background: transparent;
    border: 0;
    flex: 1;
    padding: 2%;
    color: #2d76b2;
    cursor: pointer;
    justify-content: center;
    align-self: center;
    align-items: center;
  }

  h5 {
    text-align: center;
    font-size: 1rem;
    line-height: 1rem;
    font-weight: 100;

    @media only screen and (max-width: 890px) {
      font-size: .5rem;
    }
  
    @media only screen and (max-width: 414px) {
      font-size: .25rem;
    }
  }
`