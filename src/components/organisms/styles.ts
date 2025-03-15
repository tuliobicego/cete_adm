import styled from 'styled-components'

export const Header = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  background: transparent;
  @media only screen and (max-width: 890px) {
    overflow-x: scroll; 
    }
`

export const ButtonsBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`

export const FilterBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: row;
  background-color: #f5f5f5;
  border-radius: .5em;
  justify-content: space-around;
`
