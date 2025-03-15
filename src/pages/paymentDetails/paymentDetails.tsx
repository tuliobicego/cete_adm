import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPayment } from "../../types";
import {
  GET_PAYMENT_BY_ID,
  PaymentInput,
  PaymentPayload,
} from "../../api/database/queries/getPayment";
import {
  ButtonsBox,
  Container,
  Info,
  InfoContainer,
  Name,
  IconContainer,
  Header,
} from "../styles";
import Loading from "../../components/atoms/Loading";
import IconButton from "../../components/atoms/IconButton";
import Body from "../../components/templates/Body";
import { useLocation } from "react-router";
import {
  FaEdit,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { paymentStatusMap } from "../../utils/maps/status";
import UpdatePaymentCard from "../../components/molecules/UpdatePaymentCard";
import { Tag, Divider } from "antd";
import AlumnCard from "../../components/molecules/AlumnCard";
import { paymentTypeMap } from "../../utils/maps/type";
import { paymentColorStatusMap, paymentColorTypeMap } from "../../utils/maps/color";
import { maskValue } from "../../utils/masks/masks";
import { UPDATE_PAYMENT, UpdatePaymentInput, UpdatePaymentPayload } from "../../api/database/mutations/updatePayment";
import { paymentErrorMap } from "../../utils/maps/error";
import MutationModal from "../../components/templates/MutationModal";
import PaymentCard from "../../components/molecules/PaymentCard";



const tagStyle: React.CSSProperties = {
  width: "50%",
  textAlign: "center",
  borderRadius: ".5rem",
  fontSize: "16px",
  alignSelf: "flex-start",
  marginTop: '2%'
}

const PaymentDetailsPage: React.FC = () => {
  const [payment, setPayment] = useState<IPayment | undefined>();
  const [content, setContent] = useState<
    | "payments"
    | "update"
    | "alumn"
    | "lessons"
    | "delete"
  >("alumn");
  const navigator = useNavigate();
  const location = useLocation();
  
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})

  const {
    loading: loadingGetPayment,
    refetch,
    error,
  } = useQuery<PaymentPayload, PaymentInput>(GET_PAYMENT_BY_ID, {
    
    variables: { paymentId: location.state.paymentId, alumnId: location.state.alumnId },
    onCompleted: (data) => {      
      if (data.payment.payment) setPayment(data.payment.payment);
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
  });

  const [deletePayment, { loading: loadingDeletePayment }] = useMutation<
    UpdatePaymentPayload,
    UpdatePaymentInput
  >(UPDATE_PAYMENT, {
    onCompleted: (data) => {
      
      if(data.updatePayment.payment) {
        setIsVisible({show: true, type: 'success'})
      }
      else {
        setErrorDescription( paymentErrorMap[data.updatePayment.errors.message])
        setIsVisible({show: true, type: 'error'})}     
    },
    onError: (error) => {
      setErrorDescription( paymentErrorMap[''])
      setIsVisible({show: true, type: 'error'})
      console.log(JSON.stringify(error, null, 2));
    },
  });

  const handleContent = ( content:
    | "payments"
    | "update"
    | "alumn"
    | "lessons"
    | "delete") => {
      if(!isVisible.show) {
        if(content === 'delete') {            
          setIsVisible({show: true, type: 'confirmation'})
        } 
        setContent(content)
      }
  }

    const handleDeletePayment =  () =>  {
      if(payment?._id) {
        deletePayment(
          { variables:
            { updatePaymentInput:
              { paymentId: payment._id, status: 'cancelled'}
            }
          })
      }
    }


  if (loadingGetPayment && !payment)
    return (
      <Body>
        <Loading />
      </Body>
    );
  if (error) refetch();
  return (
    <Body>
      {payment && (
        <>
          <Header>
            <Name>
              <h3>{payment?.type === 'enrollment' ? 'Matrícula' : 'Mensalidade'}</h3>
              <Info>Data: {payment.date}</Info>
            </Name>
            <InfoContainer style={{ justifyContent: "space-evenly" }}>
            <Tag
                color={paymentColorTypeMap[payment.type]}
                style={tagStyle}
                key={payment.status}
              >
                {paymentTypeMap[payment?.type].toUpperCase()}
              </Tag>
              {payment.value && (
                <Tag
                  color={Number(payment.value) < 0 ? "#D35400" : "#2ECC71"}
                  key={payment.value}
                  style={tagStyle}
                >
                  {maskValue(payment.value)}
                </Tag>
              )}
              <Tag
                color={paymentColorStatusMap[payment.status]}
                style={tagStyle}
                key={payment.status}
              >
                {paymentStatusMap[payment.status]}
              </Tag> 
            </InfoContainer>
            <IconContainer
              color={content === "update" ? "#2d76b2" : "transparent"}
            >
              <IconButton
                name={"Editar"}
                label={"Editar"}
                onPress={() => handleContent("update")}
                icon={FaEdit}
              />
            </IconContainer>
            
            {payment.type !== 'enrollment' ? <IconContainer
              color={content === "delete" ? "#2d76b2" : "transparent"}
            >
               <IconButton
                name={"Excluir"}
                label={"Excluir"}
                onPress={() => {
                  setIsVisible({show: true, type: 'confirmation'})
                  handleContent("delete")
                }}
                icon={FaTrash}
              />
              </IconContainer>
               : null}
          </Header>
          <Divider />

          <Container>
            <ButtonsBox>
              {payment.alumn ? (
                <IconContainer
                  color={
                    content === "alumn" ? "#2d76b2" : "transparent"
                  }
                >
                  <IconButton
                    name={"Aluno"}
                    label={"Aluno"}
                    onPress={() => handleContent("alumn")}
                    icon={FaUser}
                  />
                </IconContainer>
              ) : null}

              
            </ButtonsBox>

            {content === "alumn" && !isVisible.show &&
            payment.alumn ? (
              <AlumnCard alumn={payment.alumn}/>
            ) : null}
            
            
            
            
            {content === "update" && !isVisible.show ? (
              <UpdatePaymentCard
                key={`${payment._id}_update`}
                payment={payment}
              />
            ) : null}


          </Container>

          <MutationModal
            show={isVisible.show}
            stage={isVisible.type}
            onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}
            onPressMutate={() => {
              if(content === 'delete') {
                handleDeletePayment()
              }              
            }}
            onPressError={() => setIsVisible({show: false, type: 'error'})}
            onPressSuccess={() => {
              setIsVisible({show: false, type: 'success'})
              if(content === 'delete') {
                if(payment.alumn?._id) { navigator('/alumnProfile', {state: {alumnId: payment.alumn._id}})}
                else { navigator(-1) }  
              }             
            }}
            content={{
              confirmationTopText: 'Tem certeza que gostaria de cancelar este pagamento?',
              errorDescription,
              successDescription: 'Pagamento deletado com sucesso!',
            }}
            loading={loadingDeletePayment}
            children={ content === 'delete' ? <PaymentCard payment={{...payment, status: 'cancelled'}} useDescription={true}/> : null}
          />
        </>
      )}
    </Body>
  );
};
export default PaymentDetailsPage;
