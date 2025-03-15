import styled from "styled-components";

export const ButtonsBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 4%;
`




export const HorizontalContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  overflow: hidden;
  justify-content: flex-start;
  padding: 3%;
  overflow: hidden; 
  scrollbar-width: none; 
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
    width: 0px;
    height: 0px; 
  }
`


export const EnrolledHeader = styled.div`
display: flex;
align-items: center;
flex-direction: column;
width: 100%;
background: transparent;
padding: 2%;
overflow: hidden; 
scrollbar-width: none; 
-ms-overflow-style: none;
&::-webkit-scrollbar {
  display: none;
  width: 0px;
}
border-radius: 0.5rem;
background: linear-gradient(to top, rgba(38,48,101,0), 50%, rgba(38,48,101,.1));
border: 1px solid #e6e6e6ee;
margin: 2%;

  
`


export const CalendarContainer = styled.div`
display: flex;
align-items: center;
flex-direction: column;
width: 100%;
height: 100%;
background: transparent;
padding: 2%;
border-radius: 0.5rem;
background: linear-gradient(to top, rgba(38,48,101,0), 50%, rgba(38,48,101,.1));
border: 1px solid #e6e6e6ee;
margin: 2%;

  
`



export const WarningContainer = styled.div`
display: flex;
align-items: center;
flex-direction: column;
width: 100%;
height: 100%;
background: transparent;
overflow: hidden;
padding: 2%;
border-radius: 0.5rem;
background: linear-gradient(to top, rgba(38,48,101,0), 50%, rgba(38,48,101,.1));
border: 1px solid #e6e6e6ee;
margin: 2%;

  
`
export const WarningContent = styled.div`
display: flex;
align-items: center;
flex-direction: column;
width: 100%;
height: 100%;
overflow-y: scroll;
overflow-x: hidden;
scrollbar-width: none; 
-ms-overflow-style: none;
&::-webkit-scrollbar {
  display: none;
  width: 0px;
}
padding: 2%;
border-radius: 0.5rem;
background: transparent;
border: 1px solid #e6e6e6ee;
margin: 2%;

  
`

export const EnrolledButtonsBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`




export const Container = styled.div`
  width: 100%;
  color: #ffffff;
  display: flex;
  align-items: center;
  flex-direction: column;
`;



export const DarkContainer = styled.div`
  width: 100%;
  background:rgba(38,48,101, 0.1);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const Info = styled.div`
  height: 50%;
  width: 100%;
  align-items: flex-start;
  display: flex;
  font-size: 1rem;
  flex-direction: column;
  margin-bottom: 1%;
  margin-top: 1%;
  color: #000000;
`;
export const Name = styled.div`
  width: 45%;
  align-items: flex-start;
  display: flex;
  font-size: 1rem;
  flex-direction: column;
  color: #000000;
`;
export const Header = styled.div`
  width: 100%;
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  color: #000000;
  justify-content: space-evenly;
`;
export const InfoContainer = styled.div`
  width: 40%;
  background: tranparent;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
`;

export const IconContainer = styled.div`
  //background-color: red;
  height: 100%;
  width: 10%;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  justify-content: center;
  align-items: center;
  padding: 1%;
  border-bottom: 2px solid ${(props) => props.color};

  &:hover,
  &:active,
  &:focus {
    background: linear-gradient(
      to bottom,
      rgba(38,48,101, 0),
      50%,
      rgba(38,48,101, 0.1)
    );
  }
`;


export const TagContainer = styled.div`
width: 50%;
align-items: flex-start;
display: flex;
flex-direction: row;
color: #000000;
justify-content: space-evenly;

`

export const IdContainer = styled.div`
margin-bottom: 4%;
width: 80%;
align-items: flex-start;
display: flex;
flex-direction: row;
border-radius: 0.5rem;
border: 1px solid #e6e6e6ee;
padding: 2%;
justify-content: space-evenly;
`