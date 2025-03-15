import React, {useState} from 'react'
import { Container } from './styles'
import Input from '../../atoms/Input'
import { useMutation } from '@apollo/client'
import { UpdateAlumnInput, UpdateAlumnPayload, UPDATE_ALUMN } from '../../../api/database/mutations/updateAlumn'
import Loading from '../../atoms/Loading'
import { IAlumn } from '../../../types/alumn'
import { alumnStatusMap } from '../../../utils/maps/status'
import Button from '../../atoms/Button'
import { revertDatePicker, transformDatePicker } from '../../../utils/date/date'
import { Dayjs } from 'dayjs'
import { DatePicker } from 'antd'
import ptBR from "antd/es/date-picker/locale/pt_BR"; // 🔹 Importa Locale Padrão para Português
import "dayjs/locale/pt-br"; // 🔹 Importa suporte para português
import { applyMask, removeMask } from '../../../utils/masks/masks'
import { alumnErrorMap } from '../../../utils/maps/error'
import MutationModal from '../../templates/MutationModal'
import AlumnCard from '../AlumnCard'
import Disclaimer from '../../atoms/Disclaimer'
import { emailVerifier, isValid } from '../../../utils/verifiers/verifiers'
import { useNavigate } from 'react-router'

interface UpdateAlumnCardProps {
  alumn: IAlumn
}

const UpdateAlumnCard: React.FC<UpdateAlumnCardProps> = ({ alumn }) => {
  const [name, setName] = useState<string>(alumn.name)
  const [email, setEmail] = useState<string>(alumn.email)
  const [cpf, setCpf] = useState<string>(alumn.cpf)
  const [phoneNumber, setPhoneNumber] = useState<string>(alumn.phoneNumber)
  const [birthDate, setBirthDate] = useState<Dayjs | undefined>(revertDatePicker(alumn.birthDate, 'start'));
  const [street, setStreet] = useState<string | undefined>(alumn.address?.street)
  const [cep, setCep] = useState<string | undefined>(alumn.address?.cep)
  const [city, setCity] = useState<string | undefined>(alumn.address?.city)
  const [status, setStatus] = useState
    <{key: string, value: string}>
    ({key: alumn.status, value: alumnStatusMap[alumn.status]})
  const [residenceFile, setResidenceFile] = useState<File | undefined>(undefined)
  const [diplomaYear, setDiplomaYear] = useState<string>(alumn?.diplomaYear || "")
  const [diplomaUniversity, setDiplomaUniversity] = useState<string>(alumn?.diplomaUniversity || "")
  const [diplomaFile, setDiplomaFile] = useState<File | undefined>(undefined)
  const [documentNumber, setDocumentNumber] = useState<string>(alumn?.documentNumber || "")
  const [documentExpeditor, setDocumentExpeditor] = useState<string>(alumn?.documentExpeditor || "")
  const [documentFile, setDocumentFile] = useState<File | undefined>(undefined)
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [disclaimer, setDisclaimer] = useState<
    'alumnName' | 'invalidEmail' | 'invalidCpf' | 'invalidPhone' | 'emptyBirthDate' | 'invalidYear' | 'invalidDocument' | 'invalidDiploma' | ''>('')
  const navigate = useNavigate()

  const [updateAlumn, {loading: loadingCreateAlumn}] = useMutation
  <UpdateAlumnPayload, UpdateAlumnInput>(
    UPDATE_ALUMN,
    {
      onCompleted: (data) => {
        if(data.updateAlumn.alumn) setIsVisible({show: true, type: 'success'})
        else {setIsVisible({show: true, type: 'error'}); setErrorDescription( alumnErrorMap[''])}
      },
      onError: (error) => {
        setErrorDescription( alumnErrorMap[error.message])
        setIsVisible({show: true, type: 'error'})
        console.log(JSON.stringify(error, null, 2));
      },
    }
  )

  const handleReload = () => {
    navigate(0); 
  };


  const setAlumnStatus = (key: string) => {
    
    setStatus({key, value: alumnStatusMap[key] })
  }

      
    const changeDate = (date: Dayjs | null, dateString: string | string[]) => {
      if(date) {
        setBirthDate(date);
      }
    };

    const handleUpdate = () => {
    
      if (name === '') {
        setDisclaimer('alumnName')
        return
      }  else {
        setDisclaimer('')
      } 
      if (email === '' || !emailVerifier(email)) {
        setDisclaimer('invalidEmail')
        return
      } else {
        setDisclaimer('')
      }
      if (cpf === '' || !isValid(cpf, "cpf")) {
        setDisclaimer('invalidCpf')
        return
      } else {
        setDisclaimer('')
      }
      if (phoneNumber === '' || !isValid(phoneNumber, "phoneNumber")) {
        setDisclaimer('invalidPhone')
        return
      } else {
        setDisclaimer('')
      }   
      if (diplomaYear === '' || !isValid(diplomaYear, 'year')) {
        setDisclaimer('invalidYear')
        return
      } else {
        setDisclaimer('')
      }  
      if (diplomaUniversity === '') {
        setDisclaimer('invalidDiploma')
        return
      } else {
        setDisclaimer('')
      }  
      if (documentNumber === '') {
        setDisclaimer('invalidDocument')
        return
      } else {
        setDisclaimer('')
      }  
      if (documentExpeditor === '') {
        setDisclaimer('invalidDocument')
        return
      } else {
        setDisclaimer('')
      }  
      setDisclaimer('')
      setIsVisible({show: true, type: 'confirmation'})
    }
  return (<>
    <Container>
      {!loadingCreateAlumn ? <>
        <h3>Alteração de dados cadastrais</h3>
        
        <h2 style={{ marginBottom: "2%", marginTop: "2%", alignSelf: 'flex-start' }}>Dados pessoais</h2>
        <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setName(e.currentTarget.value)
          }}
          key={'name_alumn'}
          name={'name'}
          label={'Nome'}
          placeholder={alumn.name}
          autoComplete={'false'} 
          initialValue={alumn.name}
          maskType='name'
        />
        <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setEmail(e.currentTarget.value)
          }}
          key={'email_alumn'}
          name={'email'}
          label='E-mail'
          placeholder={alumn.email}
          autoComplete={'false'}
          defaultValue={alumn.email}
        />
        <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setCpf(e.currentTarget.value)
          }}
          label='CPF'
          key='CPF_alumn'
          name={'cpf'}
          placeholder={applyMask(alumn.cpf || "", 'cpf')}
          autoComplete={'false'}
          initialValue={applyMask(alumn.cpf || "", 'cpf')}
          maskType='cpf'
        />
        <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setPhoneNumber(e.currentTarget.value)
          }}
          label='Telefone'
          key='phoneNumber_alumn'
          name={'phoneNumber'}
          placeholder={applyMask(alumn.phoneNumber || "", 'phoneNumber')}
          autoComplete={'false'}
          initialValue={applyMask(alumn.phoneNumber || "", 'phoneNumber')}
          maskType='phoneNumber'
        />
        <DatePicker
          format={"DD-MM-YYYY"}
          key={"date_picker"}
          locale={ptBR}
          style={{ width: "50%" }}
          onChange={changeDate}
          placeholder={transformDatePicker(birthDate)}
          defaultValue={birthDate}
        />
        <h2 style={{ marginBottom: "2%", marginTop: "2%", alignSelf: 'flex-start' }}>Endereço</h2>
        <Input
        label='Rua'
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setStreet(e.currentTarget.value)
          }}
          name={'street'}
          key={'street_alumn'}
          placeholder={alumn.address?.street}
          autoComplete={'false'}
          defaultValue={alumn.address?.street}
        />
        <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setCep(e.currentTarget.value)
          }}
          label='CEP'
          key={'cep_alumn'}
          name={'cep'}
          placeholder={applyMask(alumn.address?.cep || "", 'cep')}
          autoComplete={'false'}
          initialValue={applyMask(alumn.address?.cep || "", 'cep')}
          maskType='cep'
        />
        <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setCity(e.currentTarget.value)
          }}
          label='Cidade'
          key={'city_alumn'}
          name={'city'}
          placeholder={alumn.address?.city}
          autoComplete={'false'}
          defaultValue={alumn.address?.city}
        />

        <h2 style={{ marginBottom: "2%", marginTop: "2%", alignSelf: 'flex-start' }}>Documento de identidade</h2>
        <Input
          defaultValue={documentNumber}
          key="documentNumber"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setDocumentNumber(e.currentTarget.value);
          }}
          label='Número do documento'
          name={"documentNumber"}
          placeholder={"1234-X..."}
          autoComplete={"false"}
        />
        <Input
          defaultValue={documentExpeditor}
          key="documentoExpeditor"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setDocumentExpeditor(e.currentTarget.value);
          }}
          name={"documentoExpeditor"}
          label='Expeditor do documento'
          placeholder={"SSP-SP, SSP-MG..."}
          autoComplete={"false"}
        />
        <h2 style={{ marginBottom: "2%", marginTop: "2%", alignSelf: 'flex-start' }}>Formação</h2>
        <Input
          defaultValue={diplomaUniversity}
          style={{width: '80%'}}
          key="diplomaUniversity"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setDiplomaUniversity(e.currentTarget.value);
          }}
          label='Universidade de formação'
          name={"diplomaUniversity"}
          placeholder={"nome da univesidade, campus..."}
          autoComplete={"false"}
        />
        <Input
          initialValue={diplomaYear}
          style={{width: '80%'}}
          key="diplomaYear"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setDiplomaYear(e.currentTarget.value);
          }}
          name={"diplomaYear"}
          label='Ano da graduação'
          placeholder={"2000, 1998..."}
          autoComplete={"false"}
          maskType="year"
        />
          <Disclaimer disclaimer={disclaimer} />
        {name !== alumn.name || email !== alumn.email || phoneNumber !== alumn.phoneNumber || cpf !== alumn.cpf 
        || transformDatePicker(birthDate) !== alumn.birthDate || street !== alumn.address?.street
        || cep !== alumn.address?.cep || city !== alumn.address?.city || 
        diplomaUniversity !== alumn.diplomaUniversity || diplomaYear !== alumn.diplomaYear ||
        documentExpeditor !== alumn.documentExpeditor || documentNumber !== alumn.documentNumber? 
        <Button key={`add_alumn_button`} name={`add_alumn_button`} onPress={handleUpdate}
            text='Atualizar aluno'
          /> : null} 
        </>: <Loading/>}
    </Container>
    <MutationModal
      show={isVisible.show}
      stage={isVisible.type}
      onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}
      onPressMutate={() => updateAlumn(
        { variables:
          { alumnInput: {
              alumnId: alumn._id,
              name: name !== alumn.name ? name : undefined,
              email: email !== alumn.email ? email : undefined,
              cpf: removeMask(cpf || '','cpf') !== alumn.cpf ? cpf : undefined,
              phoneNumber: removeMask(phoneNumber || '','phoneNumber') !== alumn.phoneNumber ? removeMask(phoneNumber || '','phoneNumber') : undefined,
              birthDate: transformDatePicker(birthDate) !== alumn.birthDate ? birthDate?.toDate().toISOString() : undefined,
              street: street !== alumn.address?.street ? street : undefined,
              cep: removeMask(cep || '', 'cep') !== alumn.address?.cep ? removeMask(cep || '', 'cep') : undefined,
              city: city !== alumn.address?.city ? city : undefined,
              documentNumber: documentNumber !== alumn.documentNumber ? documentNumber : undefined,
              documentExpeditor: documentExpeditor !== alumn.documentExpeditor ? documentExpeditor : undefined,
              diplomaUniversity: diplomaUniversity !== alumn.diplomaUniversity ? diplomaUniversity : undefined,
              diplomaYear: diplomaYear !== alumn.diplomaYear ? diplomaYear : undefined,
            }
          } })
      }
      onPressError={() => setIsVisible({show: false, type: 'error'})}
      onPressSuccess={() => {
        handleReload()
      }}
      content={{
        confirmationTopText: `Gostaria de cadastrar um aluno?`,
        errorDescription,
        successDescription: 'Novo aluno cadastrado com sucesso!',
      }}
      loading={loadingCreateAlumn}
      children={<AlumnCard alumn={{_id: 'newId', name, email, cpf, phoneNumber, type: alumn.type, birthDate: birthDate?.toDate().toISOString() || "", status: alumn.status }}/>}
      
    />
    </>
  )
}

export default UpdateAlumnCard