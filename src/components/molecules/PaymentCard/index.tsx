import React from "react";
import { IPayment } from "../../../types";
import { Container, Info, Content, ButtonContainer} from "./styles";
import { Tag } from "antd";
import { paymentColorStatusMap, paymentColorTypeMap } from "../../../utils/maps/color";
import { paymentTypeMap } from "../../../utils/maps/type";
import { maskValue } from "../../../utils/masks/masks";
import { paymentStatusMap } from "../../../utils/maps/status";
import IconButton from "../../atoms/IconButton";
import { useNavigate } from "react-router";
import { ReactComponent as ArrowRight } from "../../../assets/svg/chevron-right.svg";

interface PaymentCardProps {
  payment: IPayment;
  useDescription?: Boolean
  details?: Boolean
  children?: any
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  useDescription,
  details,
  children,
}) => {
  const navigate = useNavigate()
  return (
    <Container>
    <Content>
      {useDescription ? <Info>
      <h3>{payment.description}</h3>
      
      </Info> : null}
      
      <Info>
        <h2>{payment.date}</h2>
      </Info>
      <Info>
        <Tag
          color={paymentColorTypeMap[payment.type]}
          style={{
            width: "50%",
            textAlign: "center",
            borderRadius: ".5rem",
            fontSize: "16px",
          }}
          key={payment.type}
        >
          {paymentTypeMap[payment.type]?.toUpperCase()}
        </Tag>
        
      </Info>
      <Info>
        <Tag
            color={Number(payment.value) < 0 ? "#D35400" : "#2ECC71"}
            key={payment.value}
            style={{
              width: "50%",
              textAlign: "center",
              borderRadius: ".5rem",
              fontSize: "16px",
            }}
          >
            {maskValue(payment.value)}
        </Tag>
      </Info>
      <Info>
        
        <Tag
          color={paymentColorStatusMap[payment.status]}
          style={{
            width: "50%",
            textAlign: "center",
            borderRadius: ".5rem",
            fontSize: "16px",
          }}
          key={payment.status}
        >
          {paymentStatusMap[payment.status]}
        </Tag> 
      </Info>
        </Content>
        <ButtonContainer>
          {details ? 
            <IconButton name={''} onPress={()=>navigate('/paymentDetails', {state:{paymentId: payment._id}})} icon={ArrowRight} />: null}
        </ButtonContainer>
      {children}
    </Container>
  );
};

export default PaymentCard;
