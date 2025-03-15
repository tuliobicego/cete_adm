import React from "react";
import { IAlumn } from "../../../types/alumn";
import { alumnStatusMap } from "../../../utils/maps/status";
import { Container, Content, Info,ButtonContainer } from "./styles";
import { Tag } from "antd";
import { alumnColorStatusMap } from "../../../utils/maps/color";
import IconButton from "../../atoms/IconButton";
import { useNavigate } from "react-router";
import { ReactComponent as ArrowRight } from "../../../assets/svg/chevron-right.svg";

interface AlumnCardProps {
  alumn: IAlumn;
  children?: any
  profile?: boolean
}

const AlumnCard: React.FC<AlumnCardProps> = ({ alumn, children, profile }) => {
  const navigate = useNavigate()
  return (
    <Container>
      <Content>
        <Info>
          <h2>{alumn.name}</h2>
        </Info>
        <Info>
          <h1>CPF: {alumn.cpf}</h1>
        </Info>
        
        <Info>
          <Tag
            color={alumnColorStatusMap[alumn.status]}
            style={{
              width: "80%",
              textAlign: "center",
              borderRadius: ".5rem",
              fontSize: "16px",
              marginTop: '2%',
            }}
            key={alumn.status}
          >
            {alumnStatusMap[alumn.status]}
          </Tag>
        </Info>
        </Content>
        <ButtonContainer>
          {profile ? 
            <IconButton name={''} onPress={()=>navigate('/alumnProfile', {state:{alumnId: alumn._id}})} icon={ArrowRight} />: null}
        </ButtonContainer>
      {children}
    </Container>
  );
};

export default AlumnCard;
