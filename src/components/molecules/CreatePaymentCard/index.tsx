import React, { useState } from "react";
import { Container, DateContainer, Content, Horizontal } from "./styles";
import Input from "../../atoms/Input";
import { useMutation, useQuery } from "@apollo/client";
import {
  NewPaymentInput,
  NewPaymentPayload,
  CREATE_PAYMENT,
} from "../../../api/database/mutations/createPayment";
import Loading from "../../atoms/Loading";
import Select from "../../atoms/Select";
import Button from "../../atoms/Button";
import { IAlumn, IPayment } from "../../../types/index";
import { DatePicker } from "antd";
import Disclaimer from '../../atoms/Disclaimer'
import MutationModal from "../../templates/MutationModal";
import { AlumnsPayload, GET_ALUMNS } from "../../../api/database/queries/getAlumns";
import { paymentTypeList, paymentTypeMap } from "../../../utils/maps/type";
import dayjs, { Dayjs } from "dayjs";
import ptBR from "antd/es/date-picker/locale/pt_BR"; // 🔹 Importa Locale Padrão para Português
import "dayjs/locale/pt-br"; // 🔹 Importa suporte para português
import { paymentErrorMap } from "../../../utils/maps/error";
import PaymentCard from "../PaymentCard";
import { dateToStringRed } from "../../../utils/date/date";
import { removeMask } from "../../../utils/masks/masks";

interface CreatePaymentCardProps {
  refresh(): void
  setPayments(payments: IPayment[]): void
  payments: IPayment[] | undefined
  alumn?: IAlumn
}

const CreatePaymentCard: React.FC<CreatePaymentCardProps> = ({ refresh, payments, setPayments, alumn }) => {
  const [alumns, setAlumns] = useState<IAlumn[] | undefined>();
  const [date, setDate] = useState<Dayjs | undefined>();
  const [value, setValue] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [availableTypesValues, setAvailableTypesValues] = useState<{ key: string; value: string }[]| undefined>();
  const [type, setType] = useState<string>("");
  const [chosenAlumnId, setChosenAlumnId] = useState<string>("");
  const [alumnsValues, setAlumnsValues] = useState< { key: string; value: string }[] >([ { key: "", value: "Escolha um aluno" } ]);
  
  const [disclaimer, setDisclaimer] = useState<'emptyValue' | 'emptyAlumn' | 'emptyType' | 'emptyDate' | ''>('')
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})

  
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [chosenAlumn, setChosenAlumn] = useState<IAlumn | undefined>();
  const [newPayment, setNewPayment] = useState<IPayment | undefined>();

  


  const { loading: loadingAlumns } = useQuery<AlumnsPayload>(GET_ALUMNS, {
    onCompleted: (data) => {
      if(alumn?._id) {
        setChosenAlumn(alumn)
        console.log(alumn)
        const payedMonths = alumn?.payments?.filter((payment): payment is IPayment=> payment.status === 'paid' && payment.type !== 'enrollment').map((payment) => {return payment.type})
        console.log(payedMonths)
        const typesListAvailable = paymentTypeList.filter(type=> !payedMonths?.includes(type))
        
        setAvailableTypesValues([{ key: '', value:"Selecione o mês em débito" }].concat(typesListAvailable.map((type) =>{ return { key: type, value: paymentTypeMap[type] }})))
      
      } else {
        const availableAlumns = data.alumns.alumns.filter((alumn): alumn is IAlumn=> ((alumn.status === 'waiting'&&alumn.type !== "enrolled") || alumn.status === 'onCourse')&&alumn.type === 'regular')
        if (availableAlumns.length) {
          setAlumns(availableAlumns)
          setAlumnsValues(
            alumnsValues.concat(
              availableAlumns.map((alumn) => {
                console.log();
                return { key: alumn._id, value: alumn.name };
              })
            )
          );
        }
      }
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
  });

  const [createPayment, { loading: loadingCreatePayment }] = useMutation<
    NewPaymentPayload,
    NewPaymentInput
  >(CREATE_PAYMENT, {
    onCompleted: (data) => {
      
      if(data.createPayment.payment) {
        setIsVisible({show: true, type: 'success'})
        setNewPayment(data.createPayment.payment)
      }
      else {
        setErrorDescription( paymentErrorMap[data.createPayment.errors.message])
        setIsVisible({show: true, type: 'error'})}     
    },
    onError: (error) => {
      setErrorDescription( paymentErrorMap[''])
      setIsVisible({show: true, type: 'error'})
      console.log(JSON.stringify(error, null, 2));
    },
  });

  const changeDate = (date: Dayjs | undefined, dateString: string | string[]) => {
    console.log({ date, dateString });
    setDate(date);
  };


  const handleSubmit = () => {
    if (!type) {
      setDisclaimer('emptyType')
      return
    }   else {
      setDisclaimer('')
    }
    if (!date) {
      setDisclaimer('emptyDate')
      return
    }   else {
      setDisclaimer('')
    }
    if (value === '') {
      setDisclaimer('emptyValue')
      return
    } else {
      setDisclaimer('')
    }
    if (chosenAlumnId === '') {
      setDisclaimer('emptyAlumn')
      return
    } else {
      setDisclaimer('')
    }
    setDisclaimer('')
    setIsVisible({show: true, type: 'confirmation'})
  }

  const handleCreatePayment = () => {
    if(value && chosenAlumn && date && type) {
      createPayment({
        variables: {
          paymentInput: {
            alumnId: chosenAlumn?._id,
            value: removeMask(value, "value"),
            date: date?.toDate().toDateString(),
            type,
            description: chosenAlumn?.name+' - '+paymentTypeMap[type],
            status: 'paid',
            category: 'revenue'
          },
        },
      });
    }
  }
  const setAlumn = (id: string) => {

    setChosenAlumnId(id)
    const chosenAlumnById = alumns?.find((alumn): alumn is IAlumn=>alumn._id.toString() === id)
    setChosenAlumn(chosenAlumnById)
    const payedMonths = chosenAlumnById?.payments?.filter((payment): payment is IPayment=> payment.status === 'paid').map((payment) => {return payment.type})
    const typesListAvailable = paymentTypeList.filter(type=> !payedMonths?.includes(type))
    
    setAvailableTypesValues([{ key: '', value:"Selecione o mês em débito" }].concat(typesListAvailable.map((type) =>{ return { key: type, value: paymentTypeMap[type] }})))
  };

  return (<>
    <Container>
      <h3 key="register"> Cadastro de pagamento </h3>
      {!loadingCreatePayment ? (
        <Content>
          <Horizontal>
            <DateContainer>
              <h1 key="dateLabel" style={{ marginTop: "2%", marginBottom: "2%" }}>
                Data
              </h1>
              
              <DatePicker
                format={"DD-MMMM-YYYY"}
                key="date"
                locale={ptBR}
                style={{ width: "80%" }}
                onChange={changeDate}
                placeholder={"Selecione a data do pagamento"}
                allowClear={true}
                showTime={false}
                maxDate={dayjs()}
              />
            </DateContainer>
            <DateContainer>
              <h1 key="valueLabel" style={{ marginTop: "2%", width: '100%'}}>
              Valor do pagamento
              </h1>
              <Input
                key="value"
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  setValue(e.currentTarget.value);
                }}
                name={"value"}
                label=''
                placeholder={"Valor"}
                autoComplete={"false"}
                maskType="value"
              />
            </DateContainer>
          </Horizontal>
          {alumn ?  (<>
            <h1 key="alumnLabel" style={{ marginTop: "2%", width: '100%'}}>
              Mensalidade
            </h1>
            {availableTypesValues ? <Select
              key="type"
              options={availableTypesValues}
              onSelect={setType}
            /> : null}
          </>) 
          : <>
          <h1 key="alumnLabel" style={{ marginTop: "2%", width: '100%'}}>
            Aluno pagador
          </h1>
          {loadingAlumns ? (
            <Loading />
          ) : (
            <>
              <Select
                key="alumns"
                options={ alumnsValues}
                onSelect={setAlumn}
              />
              {availableTypesValues ? (<>
                <h1 key="alumnLabel" style={{ marginTop: "2%", width: '100%'}}>
                  Mensalidade
                </h1>
                <Select
                  key="type"
                  options={availableTypesValues}
                  onSelect={setType}
                />
              </>) : null}
            </>
          )}
          </>}
          <Disclaimer disclaimer={disclaimer} />
              <Button
                key={`add_payment_mutation_button`}
                name={`add_payment_mutation_button`}
                onPress={handleSubmit}
                text="Cadastrar pagamento"
              />
            
        </Content>
      ) : (
        <Loading />
      )}
    </Container>
    <MutationModal
      show={isVisible.show}
      stage={isVisible.type}
      onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}
      onPressMutate={() => {
        value && type && date && chosenAlumnId ? handleCreatePayment()
        : setIsVisible({show: true, type: 'error'})
        }
      }
      onPressError={() => setIsVisible({show: false, type: 'error'})}
      onPressSuccess={() => {
        setIsVisible({show: false, type: 'success'})
        const newPaymentList = payments?.length ? [...payments, newPayment] as IPayment[] : newPayment ? [newPayment] : null
        if(newPaymentList) setPayments(newPaymentList)        
      }}
      content={{
        confirmationTopText: `Gostaria de cadastrar um novo pagamento?`,
        errorDescription,
        successDescription: 'Novo pagamento criado com sucesso!',
      }}
      loading={loadingCreatePayment}
      children={<PaymentCard useDescription={true} payment={{_id: 'newId',type, date: dateToStringRed(date?.toDate()) , value, status: 'paid', category: '', description: chosenAlumn?.name || ""}}/>}
    />
  </>
  );
};

export default CreatePaymentCard;