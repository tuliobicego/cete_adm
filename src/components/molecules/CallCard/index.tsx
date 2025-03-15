import React from "react";
import { Container, Info, InfoContainer, HeaderContainer, InfoH } from "./styles";
import { FaClipboardList } from "react-icons/fa";

interface CallCardProps {
  lessonName: string
  absents?: string[] | [] | undefined
  presents: string[] | [] | undefined
  children?: any
}

const CallCard: React.FC<CallCardProps> = ({ lessonName, presents, absents, children }) => {
  

  return (
    <Container>
    <HeaderContainer>      
        <FaClipboardList size={30} color='#2d76b2' style={{margin: '20px'}} />      
   
        <h3>Aula: {lessonName}</h3>
        
    </HeaderContainer>
    <InfoContainer>
      <InfoH>
        Presentes: {presents?.length}
      </InfoH>
      <Info>
        {presents}
      </Info>
      <InfoH>
        Ausentes: {absents?.length}
      </InfoH>
      <Info>
        {absents}
      </Info>
    </InfoContainer>
      {children}
    </Container>
  );
};

export default CallCard;
