import styled from 'styled-components';

export const Container = styled.div`
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