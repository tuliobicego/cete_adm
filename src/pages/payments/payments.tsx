import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { IPayment } from "../../types";
import { GET_PAYMENTS, PaymentsPayload } from "../../api/database/queries/getPayments";
import { ButtonsBox, Container } from "../styles";
import Loading from "../../components/atoms/Loading";
import PaymentList from "../../components/organisms/PaymentList";
import NoData from "../../components/atoms/NoData";
import CreatePaymentCard from "../../components/molecules/CreatePaymentCard";
import IconButton from "../../components/atoms/IconButton";
import { FaPlus, FaTimes } from "react-icons/fa";
import Body from "../../components/templates/Body";
import ErrorModal from "../../components/templates/ErrorModal";

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[] | undefined>();
  const [content, setContent] = useState<"add" | "">("");
  const [showError, setShowError] = useState<boolean>(false);
  const [reloading, setReloading] = useState<boolean>(false);

  const { loading, refetch } = useQuery<PaymentsPayload>(GET_PAYMENTS, {
    onCompleted: (data) => {
      if (data.payments.payments) setPayments(data.payments.payments);
    },
    onError: (error) => {
      setShowError(true)
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "cache-and-network",
  });

  const handleRefetch = async () => {
    setReloading(true);
    try {
      setShowError(false)
      await refetch(); 
    } catch (error) {
      setShowError(true)
      console.error("Erro ao atualizar:", error);
    } finally {
      setReloading(false);
    }
  };


  if ((loading || reloading) && !payments)
    return (
      <Container>
        <Loading />
      </Container>
    );
    else if((!loading || !reloading) && !payments && showError)
      return (
        <Container>
          <ErrorModal onPressClose={()=>setShowError(false)} onPressError={()=>setShowError(false)} onPressTryAgain={handleRefetch} show={showError} loading={loading} content={{errorDescription:"Não foi possível buscar os pagamentos."}}/>
        </Container>
    )
    else if ((!loading || !reloading) && !payments && !showError  )
    return (
      <Container>
        <NoData />
      </Container>
    );
  return (
    <Body>
      <>
        {payments?.length ? (
          <PaymentList payments={payments} setPayments={setPayments} add={true} refresh={refetch} filterByAlumn={true} filterByDate={true} filterByType={true} filterByStatus={true} />
        ) : (
          <>
            <ButtonsBox>
              <IconButton
                name="addPayment"
                icon={content === "add" ? FaTimes : FaPlus}
                onPress={() =>
                  content === "add" ? setContent("") : setContent("add")
                }
              />
            </ButtonsBox>
            {content === "add" ? <CreatePaymentCard payments={payments} setPayments={setPayments} refresh={refetch}/> : null}
            <NoData />
          </>
        )}
      </>
    </Body>
  );
};

export default Payments;
