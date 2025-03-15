import React, { useState } from "react";
import { Container, InputContainer, InputGroup, DateContainer} from "./styles";
import Input from "../../atoms/Input";
import { useMutation, useQuery } from "@apollo/client";
import {
  NewAlumnInput,
  NewAlumnPayload,
  CREATE_ALUMN,
} from "../../../api/database/mutations/createAlumn";
import Loading from "../../atoms/Loading";
import Select from "../../atoms/Select";
import Button from "../../atoms/Button";
import { IAlumn, IAxis } from "../../../types/index";
import { DatePicker } from "antd";
import { GET_AXIS, AxisPayload } from "../../../api/database/queries/getAxis";
import Disclaimer from '../../atoms/Disclaimer'
import MutationModal from "../../templates/MutationModal";
import { emailVerifier, isValid } from "../../../utils/verifiers/verifiers";
import dayjs, { Dayjs } from "dayjs";
import { applyMask, removeMask } from "../../../utils/masks/masks";
import AlumnCard from "../AlumnCard";
import { alumnErrorMap } from "../../../utils/maps/error";
import FileUploadBox from "../../atoms/FileUploadBox";
import { revertDatePicker } from "../../../utils/date/date";
import { useNavigate } from "react-router";
import ptBR from "antd/es/date-picker/locale/pt_BR"; // 🔹 Importa Locale Padrão para Português
import "dayjs/locale/pt-br"; // 🔹 Importa suporte para português

interface CreateAlumnCardProps {
  refresh(): void
  alumns: IAlumn[] | undefined
  setAlumns(alumns: IAlumn[]): void
  enrolled?: IAlumn | undefined
}

const CreateAlumnCard: React.FC<CreateAlumnCardProps> = ({ refresh, alumns, setAlumns, enrolled}) => {
  console.log({enrolled})
  const navigate = useNavigate()
  
  const enrolledStreet = enrolled?.address?.street?.split(' n: ')[0]
  const rest = enrolled?.address?.street?.split(' n: ')[1]?.split(' complemento: ')
  const enrolledNumber = rest?.length ? rest[0] : undefined
  const enrolledComplement = rest?.length && rest.length > 1 ? rest[1] : undefined
  
  const [newAlumn, setNewAlumn] = useState<IAlumn | undefined>()
  const [name, setName] = useState<string>(enrolled?.name || "")
  const [email, setEmail] = useState<string>(enrolled?.email || "")
  const [cpf, setCpf] = useState<string>(enrolled?.cpf || "")
  const [phoneNumber, setFirstPhone] = useState<string>(enrolled?.phoneNumber || "")
  const [birthDate, setBirthDate] = useState<Dayjs | undefined>(revertDatePicker(enrolled?.birthDate, "start") || undefined)
  const [street, setStreet] = useState<string>(enrolledStreet || "")
  const [number, setNumber] = useState<string>(enrolledNumber || "")
  const [complement, setComplement] = useState<string>(enrolledComplement || "")
  const [cep, setCep] = useState<string>(enrolled?.address?.cep || "")
  const [city, setCity] = useState<string>(enrolled?.address?.city || "")
  const [type, setType] = useState<string>()
  const [residenceFile, setResidenceFile] = useState<File | undefined>(undefined)
  const [diplomaYear, setDiplomaYear] = useState<string>(enrolled?.diplomaYear || "")
  const [diplomaUniversity, setDiplomaUniversity] = useState<string>(enrolled?.diplomaUniversity || "")
  const [diplomaFile, setDiplomaFile] = useState<File | undefined>(undefined)
  const [documentNumber, setDocumentNumber] = useState<string>(enrolled?.documentNumber || "")
  const [documentExpeditor, setDocumentExpeditor] = useState<string>(enrolled?.documentExpeditor || "")
  const [documentFile, setDocumentFile] = useState<File | undefined>(undefined)
  const [status, setStatus] = useState<string>("");
  //const [payment, setPayment] = useState<string>('')
  //const [paymentDescription, setPaymentDescription] = useState<string>('')
  const [paymentDate, setPaymentDate] = useState<Dayjs | undefined>(undefined)
  const [paymentValue, setPaymentValue] = useState<string>('')
  const [axissValues, setAxissValues] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "Escolha uma turma agendado ou em curso" }]);
  const [axiss, setAxiss] = useState<
    IAxis[] | undefined
  >();
  const [axisId, setAxisId] = useState<string | undefined>(
    undefined
  ); 
  const typeValues: { key: string; value: string }[] = ([{ key: "", value: "Escolha  tipo do aluno" }, {key: "regular", value: "Comum"}, {key: 'intern', value: "Bolsista"}]);

  const [disclaimer, setDisclaimer] = useState<
  'alumnName' | 'invalidEmail' | 'invalidCpf' | 'invalidPhone' | 'emptyBirthDate' | 'invalidYear' | 'invalidDocument' | 'invalidDiploma' | ''>('')
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})
  const [errorDescription, setErrorDescription] = useState<string>('')

  const handleReload = () => {
    navigate(0); 
  };


  const { loading: loadingAxis } = useQuery<AxisPayload>(GET_AXIS, {
    onCompleted: (data) => {
      if(data.axiss.axiss) {
        const available = data.axiss.axiss?.filter((axis): axis is IAxis => axis.status === 'scheduled' || axis.status === 'onCourse')
        
        setAxiss(available)
        setAxissValues(
          axissValues.concat(
            available.map((axis)=>{
              return {key: axis?._id || "", value: axis?.type+" - Início "+axis?.dateStart}
            })
          )
        )
      }
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
  });

  const [createAlumn, { loading: loadingCreateAlumn }] = useMutation<
    NewAlumnPayload,
    NewAlumnInput
  >(CREATE_ALUMN, {
    onCompleted: (data) => {
      
      if(data.createAlumn.alumn) {
        setIsVisible({show: true, type: 'success'})
        setNewAlumn(data.createAlumn.alumn)
      }
      else {
        setErrorDescription( alumnErrorMap[data.createAlumn.errors.message])
        setIsVisible({show: true, type: 'error'})}     
    },
    onError: (error) => {
      setErrorDescription( alumnErrorMap[''])
      setIsVisible({show: true, type: 'error'})
      console.log(JSON.stringify(error, null, 2));
    },
  });

  const setAxis = (id: string) => {
    const chosenAxis = axiss?.find((axis): axis is IAxis => axis._id === id)
    if(chosenAxis?.status === 'scheduled') {
      setStatus('waiting')
    } else if(chosenAxis?.status === 'onCourse') {
      setStatus('onCourse')
    }
    setAxisId(id)
  
  }

  const changeBirthDay = (date: Dayjs | undefined, dateString: string | string[]) => {
    setBirthDate(date);
  };

  const changeDate = (date: Dayjs | undefined, dateString: string | string[]) => {
      setPaymentDate(date);
    };


  const handleSubmit = () => {
    
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

  const handleCreateAlumn = () => {
    if(name && email && cpf && type && birthDate && phoneNumber && street && number  && cep && city && diplomaUniversity && diplomaYear && documentNumber && documentExpeditor && diplomaFile && documentFile && residenceFile ) {
    
       createAlumn({
        variables: {
          alumnInput: {
            enrollementId: enrolled?._id ? enrolled._id : undefined,
            name,
            email,
            phoneNumber: removeMask(phoneNumber, "phoneNumber"),
            birthDate: birthDate?.toDate().toISOString(),
            street: street+" n "+number+' '+complement,
            enrollmentDate: dayjs().toDate().toISOString(),
            cep,
            city,
            type,
            axisId: axisId ? axisId : undefined,
            cpf,
            diplomaUniversity,
            diplomaYear,
            documentNumber,
            documentExpeditor, 
            paymentDate: paymentDate ? paymentDate?.toDate().toDateString() : undefined,
            paymentValue: paymentValue ? removeMask(paymentValue, 'value') : undefined,
          },          
          residenceFile,
          documentFile,
          diplomaFile,
        },
      });
    }
  }

  return (<>
    <Container>
      <h2 key="register"> Matrícula de Aluno </h2>
      {!loadingCreateAlumn ? (
        <>
          <Input
            initialValue={name}
            key="name"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setName(e.currentTarget.value);
            }}
            label="Nome"
            name={"name"}
            placeholder={"Fulano de tal..."}
            autoComplete={"false"}
            maskType="name"
          />
          <Input
            defaultValue={email}
            key="email"
            label="Email"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setEmail(e.currentTarget.value);
            }}
            name={"email"}
            placeholder={"usuario@mail.com"}
            autoComplete={"false"}
          />
          <Input
            initialValue={applyMask(cpf, 'cpf')}
            key="cpf"
            label="CPF"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setCpf(e.currentTarget.value);
            }}
            name={"cpf"}
            placeholder={"000.000.000-00"}
            autoComplete={"false"}
            maskType="cpf"
          />
          <Input
            initialValue={applyMask(phoneNumber, 'phoneNumber')}
            key="phoneNumber"
            label="Telefone"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setFirstPhone(e.currentTarget.value);
            }}
            name={"phoneNumber"}
            placeholder={"(00) 00000-0000"}
            autoComplete={"false"}
            maskType="phoneNumber"
          />   
          <div style={{display: 'flex', width: '100%', justifyContent: 'flex-start', flexDirection: 'column'}}>
            <h1 key="birthDateLabel" style={{ marginBottom: "2%", marginTop: "2%", alignSelf: 'flex-start' }}>
              Data de nascimento
            </h1>
            <DatePicker
              format={"DD-MM-YYYY"}
              showTime={true}
              locale={ptBR}
              key="birthDate"
              style={{ width: "50%" }}
              onChange={changeBirthDay}
              placeholder="Selecione a data de nascimento" 
              defaultValue={birthDate}             
            />
          </div>
          
          <InputGroup>
            <h1 key="addressLabel" style={{ marginTop: "2%" }}>
              Endereço do aluno
            </h1>
            <InputContainer>
              <InputGroup>
                <Input
                  defaultValue={street}
                  key="street"
                  onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    setStreet(e.currentTarget.value);
                  }}
                  label="Rua"
                  name={"street"}
                  placeholder={"Rua tal..."}
                  autoComplete={"false"}
                />                
                <Input
                  initialValue={number}
                  key="number"
                  onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    setNumber(e.currentTarget.value);
                  }}
                  name={"number"}
                  label={"Número"}
                  placeholder={"00"}
                  autoComplete={"false"}
                  maskType="number"
                />
                <Input
                  defaultValue={complement}
                  key="complement"
                  onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    setComplement(e.currentTarget.value);
                  }}
                  name={"complement"}
                  label={"Complemento"}
                  autoComplete={"false"}
                />
                <Input
                  initialValue={applyMask(cep, 'cep')}
                  key="CEP"
                  onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    setCep(e.currentTarget.value);
                  }}
                  name={"CEP"}
                  label='CEP'
                  placeholder={"00000-000"}
                  autoComplete={"false"}
                  maskType="cep"
                />     
                <Input
                  key="city"
                  onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    setCity(e.currentTarget.value);
                  }}
                  name={"city"}
                  label={"Cidade"}
                  placeholder="Cidade tal..."
                  autoComplete={"false"}
                  defaultValue={city}
                />
              
              </InputGroup>
              <FileUploadBox title={"Upload de diploma de documento"} onFileSelect={setResidenceFile}/>
            </InputContainer>
          </InputGroup>
           
          
          
          <InputGroup>
            <h1 key="documentLabel">Documento de Identidade</h1>
            <InputContainer>
              <InputGroup>

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
                
              </InputGroup>
            <FileUploadBox title={"Upload de documento"} onFileSelect={setDocumentFile}/>
            </InputContainer>
          </InputGroup>
          <InputGroup>
            <h3 key="diplomaLabel" >Formação</h3>
            <InputContainer>
              <InputGroup>
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
              </InputGroup>
              <FileUploadBox title={"Upload de diploma de graduação"} onFileSelect={setDiplomaFile}/>
            </InputContainer>
          </InputGroup>

          <div style={{display: 'flex', width: '100%', justifyContent: 'flex-start', flexDirection: 'column'}}>
            <h1 key="typeLabel" style={{ marginBottom: "2%", marginTop: "2%", alignSelf: 'flex-start' }}>
              Aluno comum ou bolsista
            </h1>      
            <Select
              key="type"
              options={typeValues}
              onSelect={setType}
            />
          </div>
          {type === 'regular' ? (<>
            <h1 key="paymentLabel" style={{ marginTop: "2%", alignSelf: 'flex-start' }}>
            Pagamento de matrícula
          </h1>
            <InputGroup>
            <DateContainer>
              <h1 key="dateLabel" style={{ marginBottom: "2%" }}>
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
                  setPaymentValue(e.currentTarget.value);
                }}
                name={"value"}
                label=''
                placeholder={"Valor"}
                autoComplete={"false"}
                maskType="value"
              />
            </DateContainer>
            </InputGroup>

            </>) : null}
          <InputGroup>
            <h1 key="axisLabel" style={{ marginTop: "2%" }}>
              Turma para matrícula
            </h1>
            {loadingAxis ? (
              <Loading />
            ) : (
                <Select
                  key="axis"
                  options={[
                    ...new Map(
                      axissValues.map((item) => [item["key"], item])
                    ).values(),
                  ]}
                  onSelect={setAxis}
                />
            )}
          </InputGroup>


          <Disclaimer disclaimer={disclaimer} />
              <Button
                key={`add_alumn_mutation_button`}
                name={`add_alumn_mutation_button`}
                onPress={handleSubmit}
                text="Cadastrar aluno"
              />
            
        </>
      ) : (
        <Loading />
      )}
    </Container>
    <MutationModal
      show={isVisible.show}
      stage={isVisible.type}
      onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}
      onPressMutate={() => {
        if(name && email && cpf && phoneNumber && type && birthDate && street && number && cep && city && residenceFile && diplomaUniversity && diplomaFile && diplomaYear && documentNumber && documentExpeditor && documentFile) {
          
          handleCreateAlumn()
        }
        else setIsVisible({show: true, type: 'error'})
        }
      }
      onPressError={() => setIsVisible({show: false, type: 'error'})}
      onPressSuccess={() => {
        setIsVisible({show: false, type: 'success'})
        if(!enrolled) {
          const newAlumnList = alumns?.length ? [...alumns, newAlumn] as IAlumn[] : newAlumn ? [newAlumn] : null
          if(newAlumnList) setAlumns(newAlumnList)    
            handleReload() 
        } else if(newAlumn?._id) {
          navigate( "/alumnProfile", { state: {alumnId: newAlumn._id} })
        }
      }}
      content={{
        confirmationTopText: `Gostaria de cadastrar um aluno?`,
        errorDescription,
        successDescription: 'Novo aluno cadastrado com sucesso!',
      }}
      loading={loadingCreateAlumn}
      children={<AlumnCard alumn={{_id: 'newId', name, email, cpf, phoneNumber, type, birthDate: birthDate?.toDate().toISOString() || "", status }}/>}
      
    />
  </>
  );
};

export default CreateAlumnCard;
