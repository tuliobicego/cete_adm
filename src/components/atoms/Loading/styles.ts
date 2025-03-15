import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const RotateWrapper = styled.div`
  width: 1000px;
  height: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

export const RotatingContent = styled.div`
  display: flex;
  width: 50%;
  height: 50%;
  justify-content: center;
  align-items: center;
  animation: ${rotate} 2s linear infinite;
  font-size: 1.8rem
`;