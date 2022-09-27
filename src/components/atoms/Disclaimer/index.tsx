import React from 'react'
import { Container, Text } from './styles'
import {ReactComponent as ExclamationIcon} from '../../../assets/svg/alert_circle_red.svg'
import IconButton from '../../atoms/IconButton'

interface DisclaimerProps {
  disclaimer: 'patientName' | 'invalidPhone' | 'emptyPhone' | 'emptyDiagnosis' | 'emptyEmail' 
  | 'invalidEmail' | 'emptyPassword' | 'emptyType' | 'invalidLocation' | 'invalidPatient'
  | 'invalidHour' | 'invalidDay' | 'lowLimit' | 'highLimit' | 'emptyEvolution' | 'emptySchedule'
  | 'emptyAvaliationType' | 'emptyAnamnesis' | 'emptyExpectations' | 'emptyPainDrugs' | 'emptyExercises'
  | 'emptyDyskinesis' | 'motionPainArc' | 'invalidPhysiotherapist' | 'emptyPatient' | 'emptyPhysiotherapist' | 'emptyDescription' 
  | 'emptyName' | 'emptyOffice' | 'emptyValue' | 'emptyPayment' | 'emptyDoctor' | 'emptyServicePlanDescription' | 'emptyServicePlanValue' 
  | 'emptyProduct' | 'emptyCpf' | 'emptyBirthDate' | 'emptyCompany' | 'emptyCrefito' | 'emptyCrm' | 'emptyCnpj' | 'emptyBank' | 'emptyAccount'
  | 'emptyAgency' | 'emptyRegistry' | 'emptyAddress' | 'emptySessions' | 'emptyDate' | 'emptyCategory' | ''
}

const Disclaimer: React.FC<DisclaimerProps> = ({ disclaimer }) => {
  return (
  <Container >
    {disclaimer !== '' ? <IconButton name='exclamation_button' style={{margin: '2px'}} onPress={() => {}} icon={ExclamationIcon} /> : null}
    {disclaimer === 'patientName' ? <Text>Insira o nome completo do paciente</Text>: null}
    {disclaimer === 'emptyPatient' ? <Text>Escolha um paciente</Text>: null}
    {disclaimer === 'emptyPhysiotherapist' ? <Text>Escolha um fisioterapeuta</Text>: null}
    {disclaimer === 'emptyDoctor' ? <Text>Escolha um médico</Text>: null}
    {disclaimer === 'invalidPhone' ? <Text>Insira um telefone válido</Text>: null}
    {disclaimer === 'emptyPhone' ? <Text>Insira um contato telefônico</Text>: null}
    {disclaimer === 'emptyDiagnosis' ? <Text>Insira o diagnóstico do paciente</Text>: null}
    {disclaimer === 'emptyEmail' ? <Text>Insira um email</Text>: null}
    {disclaimer === 'invalidEmail' ? <Text>Insira um email válido</Text>: null}
    {disclaimer === 'emptyPassword' ? <Text>Insira sua senha</Text>: null}
    {disclaimer === 'emptyType' ? <Text>Selecione o tipo de acesso</Text>: null}
    {disclaimer === 'invalidDay' ? <Text>Insira uma data válida.</Text>: null}
    {disclaimer === 'invalidHour' ? <Text>Insira um horário válido</Text>: null}
    {disclaimer === 'invalidPatient' ? <Text>Selecione um paciente.</Text>: null}
    {disclaimer === 'invalidLocation' ? <Text>Selecione o local do atendimento.</Text>: null}
    {disclaimer === 'lowLimit' ? <Text>Extrapola o limite inferior.</Text>: null}
    {disclaimer === 'highLimit' ? <Text>Extrapola o limite superior.</Text>: null}
    {disclaimer === 'emptyEvolution' ? <Text>Registre a evolução do paciente na sessão</Text>: null}
    {disclaimer === 'emptySchedule' ? <Text>Escolha um horário disponível.</Text>: null}
    {disclaimer === 'emptyAvaliationType' ? <Text>Determine a parte do corpo em foco na avaliação.</Text>: null}
    {disclaimer === 'emptyAnamnesis' ? <Text>Transcreva a anamnese feita com o paciente.</Text>: null}
    {disclaimer === 'emptyExpectations' ? <Text>Descreva as expectativas do paciente em relação ao tratamento.</Text>: null}
    {disclaimer === 'emptyPainDrugs' ? <Text>Descreva se o paciente utiliza medicação para dor.</Text>: null}
    {disclaimer === 'emptyExercises' ? <Text>Descreva o nível de atividade do paciente.</Text>: null}
    {disclaimer === 'emptyDyskinesis' ? <Text>Registre a discinesia do paciente</Text>: null}
    {disclaimer === 'motionPainArc' ? <Text>Descreva o arco de dor do paciente</Text>: null}
    {disclaimer === 'invalidPhysiotherapist' ? <Text>Selecione um fisioterapeuta</Text>: null}
    {disclaimer === 'emptyDescription' ? <Text>Adicione uma descrição</Text>: null}
    {disclaimer === 'emptyName' ? <Text>Defina um nome</Text>: null}
    {disclaimer === 'emptyValue' ? <Text>Defina o valor</Text>: null}
    {disclaimer === 'emptyOffice' ? <Text>Selecione uma unidade</Text>: null}
    {disclaimer === 'emptyPayment' ? <Text>Defina a forma de pagamento</Text>: null}
    {disclaimer === 'emptyServicePlanDescription' ? <Text>Adicione uma descrição do plano de serviços</Text>: null}
    {disclaimer === 'emptyServicePlanValue' ? <Text>Defina o valor do plano de serviços</Text>: null}
    {disclaimer === 'emptyCpf' ? <Text>Preencha o CPF</Text>: null}
    {disclaimer === 'emptyCrefito' ? <Text>Preencha o CREFITO</Text>: null}
    {disclaimer === 'emptyCrm' ? <Text>Preencha o CRM</Text>: null}
    {disclaimer === 'emptyCnpj' ? <Text>Preencha o CNPJ</Text>: null}
    {disclaimer === 'emptyProduct' ? <Text>Escolha um produto cadastrado</Text>: null}
    {disclaimer === 'emptyBirthDate' ? <Text>Defina a data de nascimento do paciente</Text>: null}
    {disclaimer === 'emptyCompany' ? <Text>Selecione uma prestadora de serviço cadastrada</Text>: null}
    {disclaimer === 'emptyRegistry' ? <Text>Defina o registro municipal</Text>: null}
    {disclaimer === 'emptyAddress' ? <Text>Defina o endereço</Text>: null}
    {disclaimer === 'emptyBank' ? <Text>Defina um banco</Text>: null}
    {disclaimer === 'emptyAgency' ? <Text>Defina uma agência</Text>: null}
    {disclaimer === 'emptyAccount' ? <Text>Defina uma conta</Text>: null}
    {disclaimer === 'emptySessions' ? <Text>Escolha uma sessão pelo menos</Text>: null}
    {disclaimer === 'emptyDate' ? <Text>Insira uma data</Text>: null}
    {disclaimer === 'emptyCategory' ? <Text>Escolha uma categoria</Text>: null}
  </Container>)
}


export default Disclaimer