import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  font-size: 1rem;
  color: #000000;
  margin-top: 20px;
  &:hover,
  &:active,
  &:focus {
    background: linear-gradient(to top, rgba(46,56,46,0), 50%, rgba(46,96,46,.1));
    
  };
`;