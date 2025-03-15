import React, {useEffect, useState} from 'react'
import { Container, DateContainer } from './styles'
import Input from '../../atoms/Input'
import { useMutation } from '@apollo/client'
import Loading from '../../atoms/Loading'
import { IPayment } from '../../../types'
import Select from '../../atoms/Select'
import { paymentStatusMap } from '../../../utils/maps/status'
import Button from '../../atoms/Button'
import { UpdatePaymentInput, UpdatePaymentPayload, UPDATE_PAYMENT } from '../../../api/database/mutations/updatePayment'
import { applyMask, removeMask } from '../../../utils/masks/masks'
import { DatePicker } from 'antd'

import dayjs, { Dayjs } from "dayjs";
import ptBR from "antd/es/date-picker/locale/pt_BR"; // 🔹 Importa Locale Padrão para Português
import "dayjs/locale/pt-br"; // 🔹 Importa suporte para português
import { revertDatePicker, transformDatePicker } from '../../../utils/date/date'
import { paymentTypeList, paymentTypeMap } from '../../../utils/maps/type'
import MutationModal from '../../templates/MutationModal'
import PaymentCard from '../PaymentCard'
import { paymentErrorMap } from '../../../utils/maps/error'
import { useNavigate } from 'react-router'

interface UpdatePaymentCardProps {
  payment: IPayment
}
const UpdatePaymentCard: React.FC<UpdatePaymentCardProps> = ({ payment }) => {
  const [type, setType] = useState<string>(payment.type)
  const [date, setDate] = useState<Dayjs | undefined>(revertDatePicker(payment.date, 'start'));
  const [value, setValue] = useState<string>(applyMask(payment.value, 'value'))
  const [availableTypesValues, setAvailableTypesValues] = useState<{ key: string; value: string }[]| undefined>();

  const [disclaimer, setDisclaimer] = useState<'emptyValue' | 'emptyAlumn' | 'emptyType' | 'emptyDate' | ''>('')
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})

  
  const [errorDescription, setErrorDescription] = useState<string>('')
  const navigate = useNavigate();
      
    const handleReload = () => {
      navigate(0); 
    };

  const [updatePayment, {loading: loadingCreatePayment}] = useMutation
  <UpdatePaymentPayload, UpdatePaymentInput>(
    UPDATE_PAYMENT,
    {
       onCompleted: data => {
        console.log(data.updatePayment.payment)
        if(data.updatePayment.payment) setIsVisible({show: true, type: 'success'})//setPayment(data.updatePayment.payment)
        else {
          setErrorDescription( paymentErrorMap[data.updatePayment.errors.message])
          setIsVisible({show: true, type: 'error'})}     
      },
      onError: (error) => {
        setErrorDescription( paymentErrorMap[error.message])
        setIsVisible({show: true, type: 'error'})
        console.log(JSON.stringify(error, null, 2));
      },
    }
  )
  
  useEffect(() => {
    const payedMonths = payment.alumn?.payments?.filter((payment): payment is IPayment=> payment.status === 'paid' && payment.type !== 'enrollment').map((payment) => {return payment.type})
    const typesListAvailable = paymentTypeList.filter(type=> !payedMonths?.includes(type))
    setAvailableTypesValues([{ key: '', value:"Selecione o mês em débito" }].concat(typesListAvailable.map((type) =>{ return { key: type, value: paymentTypeMap[type] }})))

  }, []);

  const changeDate = (chosenDate: Dayjs | null, dateString: string | string[]) => {
    if(chosenDate) {
      setDate(chosenDate);
    }
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
    setDisclaimer('')
    setIsVisible({show: true, type: 'confirmation'})
  }

  const handleUpdatePayment = () => {
    updatePayment(
      { variables:
        { updatePaymentInput: {
          paymentId: payment._id,
          type: type && type !== payment.type ? type : undefined,
          date: date && transformDatePicker(date) !== payment.date ? transformDatePicker(date) : undefined,
          value: payment.value !== removeMask(value, 'value') ? removeMask(value, 'value') : undefined,
          description: type && type !== payment.type ? payment.alumn?.name+' - '+paymentTypeMap[type] : undefined,
         } }
      })
  }

  
  
  
  return (<>
    <Container>
      {!loadingCreatePayment ? <>
        <h3>Alteração do pagamento</h3>
        {payment.alumn && payment.type !== 'enrollment' ?  (<>
            <h1 key="alumnLabel" style={{ marginTop: "2%", width: '100%'}}>
              Mensalidade
            </h1>
            {availableTypesValues ? <Select
              key="type"
              options={availableTypesValues}
              onSelect={setType}
            /> : null}
          </>) : null}
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
          placeholder={transformDatePicker(date)}
          allowClear={true}
          showTime={false}
          defaultValue={date}
          maxDate={dayjs()}
        />
      </DateContainer>
      <DateContainer>
        <h1 key="valueLabel" style={{ marginTop: "2%", width: '100%'}}>
        Valor do pagamento
        </h1>
        <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setValue(e.currentTarget.value)
          }}
          key='value_payment'
          name={'value'}
          placeholder={payment.value}
          autoComplete={'false'}
          maskType='value'
          initialValue={applyMask(payment.value, 'value')}
        />
        </DateContainer>
        
        {((removeMask(value, 'value') && removeMask(value, 'value') !== payment.value) ||
         (type && payment.type !== type ) ||
         (date && transformDatePicker(date) !== payment.date )) 
        ? <Button key={`update_payment_button`} name={`update_payment_button`} onPress={() => handleSubmit()} 
            text='Atualizar pagamento'
          /> 
        : null}
        </>: <Loading/>}
    </Container>

    <MutationModal
      show={isVisible.show}
      stage={isVisible.type}
      onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}
      onPressMutate={() => {
        removeMask(value, 'value') === payment.value && payment.type === type && transformDatePicker(date) === payment.date 
        ? setIsVisible({show: true, type: 'error'})
        : handleUpdatePayment()
        }
      }
      onPressError={() => setIsVisible({show: false, type: 'error'})}
      onPressSuccess={() => {
        setIsVisible({show: false, type: 'success'})
        handleReload()
      }}
      content={{
        confirmationTopText: `Gostaria de atualizar o pagamento?`,
        errorDescription,
        successDescription: 'Pagamento atualizado com sucesso!',
      }}
      loading={loadingCreatePayment}
      children={<PaymentCard useDescription={true} payment={{_id: payment._id, description: payment.description, status: payment.status, value, date: transformDatePicker(date), type}}/>}
    />
</>
  )
}

export default UpdatePaymentCard