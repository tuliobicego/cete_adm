import styled from 'styled-components';

export const Container = styled.div`
  background: transparent;
  width: 100%;
  color: #000000;
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 10px;
  flex-direction: column;

  & + div {
    margin-top: 8px;
  }
  svg {
    margin-right: 16px;
  }
`

export const InputBox = styled.div`
background: #FFFFFF;
  width: 100%;
  border-radius: 10px;
  padding: 16px;
  color: #224b22;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  border: .5px solid #224b2210;
input {
    background: transparent;
    border: 0;
    flex: 1;
  }
`