import styled from 'styled-components';

export const Container = styled.div`
  width: 90%;
  border-radius: 10px 10px;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 1%;
  align-self: center;
  color: #FFFFFF;
  margin-right: 2%;
  margin-left: 2%;
  margin-top: 4%;
  background: transparent;

  button {
    background: white;
    border: 0;
    flex: 1;
    padding: 2%;
    color: #2d76b2;
    cursor: pointer;
    justify-content: center;
    align-self: center;
    align-items: center;
  }

  h1 {
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

export const Content = styled.div`
    justify-content: space-evenly;
    display: flex;
    flex-direction: column;
    margin-top: 1%;
    margin-bottom: 1%;


`