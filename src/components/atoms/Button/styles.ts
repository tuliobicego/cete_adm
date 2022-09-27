import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  font-size: 1rem;
  color: #000000;
  &:active,
  &:focus {
    background: linear-gradient(to top, rgba(46,56,46,0), 50%, rgba(46,96,46,.1));
    
  };
`;

export const ButtonGeneral = styled.button`
  display: flex;
  width: 30%;
  padding: .5rem 0rem;
  justify-content: center;
  align-items: center;
  border-radius: .5rem;
    background: linear-gradient(to top, rgba(46,56,46,0), 50%, rgba(46,96,46,.1));
  border: 1px solid #e6e6e6ee;
  cursor: pointer;
  &:hover{
  background: #e6e6e6;
    
  }
`