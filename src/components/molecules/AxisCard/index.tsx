import React from "react";
import { IAxis } from "../../../types/axis";
import { axisStatusMap } from "../../../utils/maps/status";
import { ButtonContainer, Container, Info, Content} from "./styles";
import { Tag } from "antd";
import { axisColorStatusMap, axisTypeColorMap } from "../../../utils/maps/color";
import { axisTypeMap } from "../../../utils/maps/type";
import { useNavigate } from "react-router";
import { ReactComponent as ArrowRight } from "../../../assets/svg/chevron-right.svg";
import IconButton from "../../atoms/IconButton";

interface AxisCardProps {
  axis: IAxis;
  children?: any
  professor?: boolean
  details?: boolean
}

const AxisCard: React.FC<AxisCardProps> = ({ axis, professor, children, details}) => {
  const navigate = useNavigate()
  return (
    <Container>
    <Content>
        <Info>
        <Tag
            color={axisTypeColorMap[axis.type]}
            style={{
              width: "40%",
              textAlign: "center",
              borderRadius: ".5rem",
              fontSize: "16px",
            }}
            key={axis.status}
          >
            Turma   {axisTypeMap[axis.type]}
          </Tag>
        </Info>
        
        {professor ? <Info>Responsável: {axis.professor?.name}</Info> : null}
        <Info>Início da turma: {axis.dateStart}</Info>
        <Info>Fim da turma: {axis.dateEnd}</Info>
        <Info>
          <Tag
            color={axisColorStatusMap[axis.status]}
            style={{
              width: "40%",
              textAlign: "center",
              borderRadius: ".5rem",
              fontSize: "16px",
            }}
            key={axis.status}
          >
            {axisStatusMap[axis.status]}
          </Tag>
        </Info>
      </Content>
        <ButtonContainer>
          {details ? 
            <IconButton name={''} onPress={()=>navigate('/axisDetails', {state:{axisId: axis._id}})} icon={ArrowRight} />: null}
        </ButtonContainer>
      {children}
    </Container>
  );
};

export default AxisCard;
