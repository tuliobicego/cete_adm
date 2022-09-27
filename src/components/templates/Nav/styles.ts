import styled from 'styled-components';
import { MenuOutlined } from "@ant-design/icons";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  
`


export const SideContainer = styled.div`
  @media only screen and (max-width: 890px) {
    display: none;
  }
  height: 100%;
  width: 6%;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: absolute;
`

export const Side = styled.div`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  height: 100%;
  width: 100%;
`

export const Content = styled.div`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  height: 100%;
  width: 100%;
  flex: 1;
  padding-left: 8%;
  overflow: hidden;
`

export const Header = styled.div`
  background-color: #f5f5f5;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 50px;
`

export const PageTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 1%
`

export const PageIconContainer = styled.div`
  height: 70%;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 50%;
`

export const IconContainer = styled.div`
  //background-color: red;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  justify-content: center;
  padding: 10%;
  width: 100%;
  &:hover,
  &:active,
  &:focus {
    background: linear-gradient(to right, rgba(46,56,46,0), 50%, rgba(46,96,46,.1));
    border-left: 2px solid #224b22
  };
`;

export const Burger = styled.div`
  
  @media only screen and (max-width: 890px) {
    display: block;
  }

  align-items: flex-start;
  display: none;
  width: 100%;

  svg {
    fill: #E9E9E9;
  }
`;

export const NotHidden = styled.div`
  @media only screen and (max-width: 890px) {
    display: none;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

export const Label = styled("span")`
  font-weight: 500;
  color: #404041;
  text-align: right;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

export const Outline = styled(MenuOutlined)<any>`
  font-size: 22px;
`;

export const Menu = styled("h5")`
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
`;

export const Shadow = styled.div`
  background: linear-gradient(to left, rgba(46,56,46,0), 50%, rgba(46,96,46,.1));
  width: 30px;
`;