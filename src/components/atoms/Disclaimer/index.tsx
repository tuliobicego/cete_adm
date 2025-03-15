import React from 'react'
import { Container, Text } from './styles'
import {ReactComponent as ExclamationIcon} from '../../../assets/svg/alert_circle_red.svg'

interface DisclaimerProps {
  disclaimer: 'alumnName' | 'invalidPhone' | 'emptyPhone' | 'emptyEmail' | 'emptyAlumns' | 'emptyGrades'  | 'invalidGrade'  | 'invalidCpf'
  | 'invalidEmail' | 'emptyPassword' | 'emptyType' | 'invalidLocation' | 'invalidAlumn' | 'emptyTime' | 'emptyStatus' | 'invalidYear' | 'invalidDiploma' | 'invalidDocument'
  | 'invalidHour' | 'invalidDay' | 'invalidDate' | 'emptyDate' | 'lowLimit' | 'highLimit' | 'emptyEvolution' | 'emptySchedule' | 'professorName'
  | 'emptyAvaliationType' | 'emptyAnamnesis' | 'emptyExpectations' | 'emptyPainDrugs' | 'emptyExercises' | 'emptyPeriod'
  | 'emptyDyskinesis' | 'motionPainArc' | 'invalidProfessor' | 'emptyAlumn' | 'emptyProfessor' | 'emptyDescription' | 'emptyAxis'
  | 'emptyName' | 'emptyOffice' | 'emptyValue' | 'emptyPayment' | 'emptyDoctor' | 'emptyServicePlanDescription' | 'emptyServicePlanValue' 
  | 'emptyProduct' | 'emptyCpf' | 'emptyBirthDate' | 'emptyCompany' | 'emptyCrefito' | 'emptyCrm' | 'emptyCnpj' | 'emptyBank' | 'emptyAccount'
  | 'emptyAgency' | 'emptyRegistry' | 'emptyAddress' | 'emptyLessons' | 'emptyDate' | 'emptyCategory' | 'noUpdate' | 'noName' | 'sameName' | ''
}

const Disclaimer: React.FC<DisclaimerProps> = ({ disclaimer }) => {
  return (
  <Container >
    {disclaimer !== '' ? <ExclamationIcon  color='#2d76b2'   /> : null}
    {disclaimer === 'professorName' ? <Text>Insira o nome completo do professor</Text>: null}
    {disclaimer === 'invalidGrade' ? <Text>Nota inválida, verifique as notas dadas.</Text>: null}
    {disclaimer === 'invalidPhone' ? <Text>Insira um telefone válido</Text>: null}
    {disclaimer === 'invalidCpf' ? <Text>Insira um cpf válido</Text>: null}
    {disclaimer === 'invalidYear' ? <Text>Insira um ano válido</Text>: null}
    {disclaimer === 'invalidDay' ? <Text>Insira um dia válido.</Text>: null}
    {disclaimer === 'invalidDate' ? <Text>Insira uma data válida.</Text>: null}
    {disclaimer === 'invalidDiploma' ? <Text>Insira um nome válido.</Text>: null}
    {disclaimer === 'invalidDocument' ? <Text>Insira um documento válido.</Text>: null}
    {disclaimer === 'invalidEmail' ? <Text>Insira um email válido</Text>: null}
    {disclaimer === 'invalidProfessor' ? <Text>Selecione um professor</Text>: null}
    {disclaimer === 'invalidLocation' ? <Text>Selecione o local do atendimento.</Text>: null}
    {disclaimer === 'invalidHour' ? <Text>Insira um horário válido</Text>: null}
    {disclaimer === 'invalidAlumn' ? <Text>Selecione os alunos</Text>: null}
    {disclaimer === 'emptyPhone' ? <Text>Insira um contato telefônico</Text>: null}
    {disclaimer === 'emptyEmail' ? <Text>Insira um email</Text>: null}
    {disclaimer === 'emptyPassword' ? <Text>Insira sua senha</Text>: null}
    {disclaimer === 'emptyAlumn' ? <Text>Escolha um aluno</Text>: null}
    {disclaimer === 'emptyAxis' ? <Text>Escolha uma turma</Text>: null}
    {disclaimer === 'emptyProfessor' ? <Text>Escolha um professor</Text>: null}
    {disclaimer === 'emptyGrades' ? <Text>Dê as notas antes de enviar</Text>: null}
    {disclaimer === 'emptyType' ? <Text>Selecione o tipo de acesso</Text>: null}
    {disclaimer === 'emptyTime' ? <Text>Selecione a hora</Text>: null}
    {disclaimer === 'emptyStatus' ? <Text>Status indefinido</Text>: null}
    {disclaimer === 'emptyDate' ? <Text>Data não preenchida.</Text>: null}
    {disclaimer === 'emptyAlumns' ? <Text>Selecione um aluno</Text>: null}
    {disclaimer === 'emptyEvolution' ? <Text>Registre a presença do aluno na aula</Text>: null}
    {disclaimer === 'emptySchedule' ? <Text>Escolha um horário disponível.</Text>: null}
    {disclaimer === 'emptyAvaliationType' ? <Text>Determine a parte do corpo em foco na avaliação.</Text>: null}
    {disclaimer === 'emptyAnamnesis' ? <Text>Transcreva a anamnese feita com o aluno.</Text>: null}
    {disclaimer === 'emptyExpectations' ? <Text>Descreva as expectativas do aluno em relação ao tratamento.</Text>: null}
    {disclaimer === 'emptyPainDrugs' ? <Text>Descreva se o aluno utiliza medicação para dor</Text>: null}
    {disclaimer === 'emptyExercises' ? <Text>Descreva o nível de atividade do aluno.</Text>: null}
    {disclaimer === 'emptyDyskinesis' ? <Text>Registre a discinesia do aluno</Text>: null}
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
    {disclaimer === 'emptyBirthDate' ? <Text>Defina a data de nascimento do aluno</Text>: null}
    {disclaimer === 'emptyCompany' ? <Text>Selecione uma prestadora de serviço cadastrada</Text>: null}
    {disclaimer === 'emptyRegistry' ? <Text>Defina o registro municipal</Text>: null}
    {disclaimer === 'emptyAddress' ? <Text>Defina o endereço</Text>: null}
    {disclaimer === 'emptyBank' ? <Text>Defina um banco</Text>: null}
    {disclaimer === 'emptyAgency' ? <Text>Defina uma agência</Text>: null}
    {disclaimer === 'emptyAccount' ? <Text>Defina uma conta</Text>: null}
    {disclaimer === 'emptyLessons' ? <Text>Escolha uma aula pelo menos</Text>: null}
    {disclaimer === 'emptyDate' ? <Text>Insira uma data</Text>: null}
    {disclaimer === 'emptyCategory' ? <Text>Escolha uma categoria</Text>: null}
    {disclaimer === 'sameName' ? <Text>Nome inalterado</Text>: null}
    {disclaimer === 'alumnName' ? <Text>Insira o nome completo do aluno</Text>: null}
    {disclaimer === 'noUpdate' ? <Text>Nenhum campo foi alterado</Text>: null}
    {disclaimer === 'noName' ? <Text>Campo nome vazio</Text>: null}
    {disclaimer === 'lowLimit' ? <Text>Extrapola o limite inferior</Text>: null}
    {disclaimer === 'highLimit' ? <Text>Extrapola o limite superior</Text>: null}
    {disclaimer === 'motionPainArc' ? <Text>Descreva o arco de dor do aluno</Text>: null}
  </Container>)
}


export default Disclaimer