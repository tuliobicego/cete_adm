import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IAlumn, ILesson, IPayment } from "../../types";
import {
  GET_ALUMN_BY_ID,
  AlumnInput,
  AlumnPayload,
} from "../../api/database/queries/getAlumn";
import {
  ButtonsBox,
  Container,
  Info,
  InfoContainer,
  Name,
  IconContainer,
  Header,
  TagContainer,
  IdContainer
} from "../styles";
import Loading from "../../components/atoms/Loading";
import IconButton from "../../components/atoms/IconButton";
import Body from "../../components/templates/Body";
import { useLocation } from "react-router";
import {
  FaClipboardCheck,
  FaMoneyBill,
  FaEdit,
  FaFolder,
  FaChalkboardTeacher,
  FaIdCardAlt,
  FaTimes,
  FaLock,
  FaArchive,
  FaLockOpen,
} from "react-icons/fa";
import { FaPeopleLine } from "react-icons/fa6";
import { alumnPresenceMap, alumnStatusMap, axisStatusMap } from "../../utils/maps/status";
import UpdateAlumnCard from "../../components/molecules/UpdateAlumnCard";
import { Table, Tag, Space, Tooltip, Divider } from "antd";
import { ReactComponent as ArrowRight } from "../../assets/svg/chevron-right.svg";
import { alumnTypeMap, axisTypeMap, indexGradeMap, paymentTypeMap } from "../../utils/maps/type";
import { alumnColorPresenceMap, alumnColorStatusMap, alumnColorTypeMap, axisColorStatusMap, axisTypeColorMap, paymentColorTypeMap } from "../../utils/maps/color";
import { maskValue } from "../../utils/masks/masks";
import GradeAndFrequence from "../../components/molecules/GradeAndFrequenceCard";
import NoData from "../../components/atoms/NoData";
import { lessonPeriodMap } from "../../utils/maps/date";
import AlumnDeclarationCard from "../../components/molecules/AlumnDeclarationCard";
import AlumnHistoryCard from "../../components/molecules/AlumnHistoryCard";
import AlumnFinanceCard from "../../components/molecules/AlumnFinanceCard";
import AlumnDiplomaCard from "../../components/molecules/AlumnDiplomaCard";
import { stringToDateRed } from "../../utils/date/date";
import PaymentCard from "../../components/molecules/PaymentCard";
import Button from "../../components/atoms/Button";
import CreatePaymentCard from "../../components/molecules/CreatePaymentCard";
import { UPDATE_ALUMN, UpdateAlumnInput, UpdateAlumnPayload } from "../../api/database/mutations/updateAlumn";
import { alumnErrorMap } from "../../utils/maps/error";
import MutationModal from "../../components/templates/MutationModal";
import AlumnCard from "../../components/molecules/AlumnCard";
import UpdateUploadBox from "../../components/atoms/UpdateUploadBox";
import { FileItem } from "../../components/atoms/FileItem";




const paymentColumns = [
  {
    title: "Número",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "Mensalidade",
    dataIndex: "type",
    key: "type",
    render: (type) => (
        <Tag
          color={paymentColorTypeMap[type]}
          style={{
            width: "100%",
            textAlign: "center",
            borderRadius: ".5rem",
            fontSize: "16px",
          }}
          key={type}
        >
          {paymentTypeMap[type].toUpperCase()}
        </Tag>
    ),
  },
  {
    title: "Data",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Valor",
    dataIndex: "value",
    key: "value",
    render: (value) => (
      <Tag
        color={Number(value) < 0 ? "#D35400" : "#2ECC71"}
        key={value}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
      >
        {maskValue(value)}
      </Tag>
    ),
  },
  {
    title: "",
    dataIndex: "",
    key: "",
    render: ({ getPayment }) => (
      <Space size="middle">
        <Tooltip placement="bottom" title="Detalhes">
          <IconButton
            name="getPaymentIcon"
            onPress={getPayment}
            icon={ArrowRight}
          />
        </Tooltip>
      </Space>
    ),
  },
];
const axisColumns = [
  {
    title: "Number",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "Tipo",
    dataIndex: "type",
    key: "type",
    render: (type) => (
      <Tag
        color={axisTypeColorMap[type]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={type}
      >
        {axisTypeMap[type].toUpperCase()}
      </Tag>
    ),
    
  },
  {
    title: "Datas",
    dataIndex: "dateStartEnd",
    key: "dateStartEnd",
    render: (dateStartEnd) => (
      <Space direction="vertical">
        {dateStartEnd[0]}
        {dateStartEnd[1]}
      </Space>
    ),
  },
  {
    title: "Notas",
    dataIndex: "grades",
    key: "grades",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag
        color={axisColorStatusMap[status]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={status}
      >
        {axisStatusMap[status].toUpperCase()}
      </Tag>
    ),
  },
  {
    title: "",
    dataIndex: "",
    key: "",
    render: ({ _id, getAxis }) => (
      <Space size="middle">
        <Tooltip placement="bottom" title="Detalhes da turma">
          <IconButton
            name="axisDetails"
            onPress={getAxis}
            icon={ArrowRight}
          />
        </Tooltip>
      </Space>
    ),
  },
];
const lessonColumns = [
  {
    title: "Number",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Data",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Período",
    dataIndex: "period",
    key: "period",
  },
  {
    title: "Turma",
    dataIndex: "axisType",
    key: "axisType",
    render: (axisType) => (
      <Tag
        color={axisTypeColorMap[axisType]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={axisType}
      >
        {axisTypeMap[axisType].toUpperCase()}
      </Tag>
    ),
  },
  {
    title: "Chamada",
    dataIndex: "call",
    key: "call",
    render: (call) => (
      <Tag
        color={alumnColorPresenceMap[call]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={call}
      >
        {alumnPresenceMap[call].toUpperCase()}
      </Tag>
    ),
  },
  {
    title: "",
    dataIndex: "",
    key: "",
    render: ({ _id, getLesson }) => (
      <Space size="middle">
        <Tooltip placement="bottom" title="Detalhes da aula">
          <IconButton
            name="lessonDetails"
            onPress={getLesson}
            icon={ArrowRight}
          />
        </Tooltip>
      </Space>
    ),
  },
];

const tagStyle: React.CSSProperties = {
  width: "50%",
  textAlign: "center",
  borderRadius: ".5rem",
  fontSize: "16px",
  alignSelf: "flex-start",
  marginTop: '1%'
}

const AlumnProfilePage: React.FC = () => {
  const [alumn, setAlumn] = useState<IAlumn | undefined>();
  const [alumnPayments, setAlumnPayments] = useState<IPayment[] | undefined>();
  
  const [totalLessons, setTotalLessons] = useState<(ILesson | undefined)[]>([])
  const [content, setContent] = useState<
    | "enrollment"
    | "update"
    | "axis"
    | "lessons"
    | "payments"
    | "docs"
    | "freqsAndGrades"
    | 'addPayment'
    | 'cancel'
    | 'pause'
    | 'resume'
  >("enrollment");
  const navigator = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [confirmationTopText, setConfirmationTopText] = useState<string>('')
  const [successDescription, setSuccessDescription] = useState<string>('')
  
  
  const {
    loading: loadingGetAlumn,
    refetch,
    error,
  } = useQuery<AlumnPayload, AlumnInput>(GET_ALUMN_BY_ID, {
    
    variables: { alumnId: location.state.alumnId },
    onCompleted: (data) => {
      if (data.alumn.alumn) {
        
    console.log({alumn: data.alumn.alumn})
        setAlumn(data.alumn.alumn);
        const total = data.alumn.alumn.axis?.flatMap(axis=>axis.lessons)?.sort((a, b) => - stringToDateRed(a?.date || '').getTime() + stringToDateRed(b?.date || '').getTime()) || []
        setTotalLessons(total)
        if(data.alumn.alumn.payments?.length) setAlumnPayments(data.alumn.alumn.payments)
      }
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
  });

  const [updateAlumn, {loading: loadingUpdateAlumn}] = useMutation
      <UpdateAlumnPayload, UpdateAlumnInput>(
        UPDATE_ALUMN,
        {onCompleted: (data) => {
        
          if(data.updateAlumn.alumn) {
            setIsVisible({show: true, type: 'success'})
          }
          else {
            setErrorDescription( alumnErrorMap[data.updateAlumn.errors.message])
            setIsVisible({show: true, type: 'error'})}     
        },
        onError: (error) => {
          setErrorDescription( alumnErrorMap[''])
          setIsVisible({show: true, type: 'error'})
          console.log(JSON.stringify(error, null, 2));
        },
        fetchPolicy: "no-cache",
      });


  const handleContent = ( content:
    | "enrollment"
    | "update"
    | "axis"
    | "lessons"
    | "payments"
    | "docs"
    | "freqsAndGrades"
    | 'addPayment'
    | 'cancel'
    | 'pause'
    | 'resume'
  ) => {
      if(!isVisible.show) {
        if(content === 'cancel') {          
          setConfirmationTopText(`Gostaria de cancelar a matrícula deste aluno?`)
          setSuccessDescription('Matrícula cancelada com sucesso!')
          setIsVisible({show: true, type: 'confirmation'})
        } else if(content === 'pause') {
          setConfirmationTopText(`Gostaria de trancar a matrícula deste aluno?`)
          setSuccessDescription('Matrícula trancada com sucesso!')
          setIsVisible({show: true, type: 'confirmation'})
        } else if(content === 'resume') {
          setConfirmationTopText(`Gostaria de reativar a matrícula deste aluno?`)
          setSuccessDescription('Matrícula reativada com sucesso!')
          setIsVisible({show: true, type: 'confirmation'})
        }
        setContent(content)
      }
  }


  if (loadingGetAlumn) {
    return (
      <Body>
        <Loading />
      </Body>
    ); 
  } else if(!loadingGetAlumn && !alumn){
      
    return (
      <Body>
        <NoData />
      </Body>
    )
  }
  if (error) refetch();
  return (
    <Body>
      {alumn && (
        <>
          <Header>
            <Name>
              <h3>{alumn?.name}</h3>
              <Info>CPF: {alumn.cpf}</Info>
              <Info>E-mail: {alumn.email}</Info>

              <Info>Data da matrícula: {alumn.enrollmentDate}</Info>
            </Name>
            <InfoContainer>
              {alumn.axis && alumn.axis.length ? (
                <Info>
                  Turmas:{" "}
                  <TagContainer>
                  {alumn.axis?.map((axis) => {
                    return (
                      <Tag
                      color={axisTypeColorMap[axis.type || '']}
                      style={tagStyle}
                      key={axis.type}
                    >
                      {axisTypeMap[axis.type || '']}
                    </Tag>)
                  })}
                  </TagContainer> 
                </Info>
              ) : null}
              <Tag
                color={alumnColorTypeMap[alumn.type || '']}
                style={tagStyle}
                key={alumn.type}
              >
                {alumnTypeMap[alumn.type || '']}
              </Tag>
              <Tag
                color={alumnColorStatusMap[alumn.status]}
                style={tagStyle}
                key={alumn.status}
              >
                {alumnStatusMap[alumn.status]}
              </Tag>
              
            </InfoContainer>
            
            {alumn.status === 'onCourse' || alumn.status === 'waiting' ?
            <><IconContainer
              color={content === "pause" ? "#2d76b2" : "transparent"}
            >
              <IconButton
                name={"Trancar matrícula"}
                label={"Trancar matrícula"}
                onPress={() => handleContent("pause")}
                icon={FaLock}
              />
            </IconContainer>
            
            <IconContainer
              color={content === "cancel" ? "#2d76b2" : "transparent"}
            >
              <IconButton
                name={"Cancelar matrícula"}
                label={"Cancelar matrícula"}
                onPress={() => handleContent("cancel")}
                icon={FaArchive}
              />
            </IconContainer></> : null}

            {alumn.status === 'paused'  ?
            <><IconContainer
              color={content === "pause" ? "#2d76b2" : "transparent"}
            >
              <IconButton
                name={"Reativar matrícula"}
                label={"Reativar matrícula"}
                onPress={() => handleContent("resume")}
                icon={FaLockOpen}
              />
            </IconContainer>
            
            <IconContainer
              color={content === "cancel" ? "#2d76b2" : "transparent"}
            >
              <IconButton
                name={"Cancelar matrícula"}
                label={"Cancelar matrícula"}
                onPress={() => handleContent("cancel")}
                icon={FaArchive}
              />
            </IconContainer></> : null}
            <IconContainer
              color={content === "update" ? "#2d76b2" : "transparent"}
            >
              <IconButton
                name={"Editar perfil"}
                label={"Editar perfil"}
                onPress={() => handleContent("update")}
                icon={FaEdit}
              />
            </IconContainer>
          </Header>
          <Divider />

          <Container>
            <ButtonsBox>
              {alumn.address ? (<>
                <IconContainer
                  color={content === "enrollment" ? "#2d76b2" : "transparent"}
                >
                  <IconButton
                    name={"Matrícula"}
                    label={"Matrícula"}
                    onPress={() => handleContent("enrollment")}
                    icon={FaIdCardAlt}
                  />
                </IconContainer>
              </>) : null}
              {alumn.grades ? (
                <IconContainer
                  color={content === "freqsAndGrades" ? "#2d76b2" : "transparent"}
                >
                  <IconButton
                    name={"Notas e Faltas"}
                    label={"Notas e Faltas"}
                    onPress={() => handleContent("freqsAndGrades")}
                    icon={FaClipboardCheck}
                  />
                </IconContainer>
              ) : null}
              {alumn.axis ? (
                <IconContainer
                  color={
                    content === "axis" ? "#2d76b2" : "transparent"
                  }
                >
                  <IconButton
                    name={"Turmas"}
                    label={"Turmas"}
                    onPress={() => handleContent("axis")}
                    icon={FaPeopleLine}
                  />
                </IconContainer>
              ) : null}
              
              
              {alumn.lessons ? (
                <IconContainer
                  color={content === "lessons" ? "#2d76b2" : "transparent"}
                >
                  <IconButton
                    name={"Aulas"}
                    label={"Aulas"}
                    onPress={() => handleContent("lessons")}
                    icon={FaChalkboardTeacher}
                  />
                </IconContainer>
              ) : null}
              {alumnPayments && alumn.type !== 'intern' ? (
                <IconContainer
                  color={content === "payments" ? "#2d76b2" : "transparent"}
                >
                  <IconButton
                    name={"Pagamentos"}
                    label={"Pagamentos"}
                    onPress={() => handleContent("payments")}
                    icon={FaMoneyBill}
                  />
                </IconContainer>
              ) : null}
              {alumn.status !== "cancelled" ? (
                <IconContainer
                  color={content === "docs" ? "#2d76b2" : "transparent"}
                >
                  <IconButton
                    name={"Documentos"}
                    label={"Documentos"}
                    onPress={() => handleContent("docs")}
                    icon={FaFolder}
                  />
                </IconContainer>
              ) : null}

              
            </ButtonsBox> 

            {content === 'enrollment' && alumn.documentNumber && alumn.documentExpeditor && !isVisible.show ?
            <IdContainer><>
              <InfoContainer>
                <h3>Identificação</h3>
                <Info>
                  Número do documento:{alumn.documentNumber}
                </Info>
                <Info>
                  Órgão expeditor: {alumn.documentExpeditor}
                </Info>
                <Info>
                  { alumn.documentFile?._id ? <UpdateUploadBox title={'Substituir arquivo'} type='document' entity="alumn" entityId={alumn._id}/> : null}
                </Info>
              </InfoContainer>
              {alumn.documentFile?._id ? null
                  :
                  <UpdateUploadBox title={'Documento de identidade'} type='document' entity="alumn" entityId={alumn._id}/>
                }
              {alumn?.documentFile ? <FileItem file={alumn.documentFile}/> : null}
            </>
            </IdContainer> 
            : content === "enrollment" ? <NoData/> : null}

            {content === 'enrollment' && alumn.address && !isVisible.show ?
            <IdContainer><>
              <InfoContainer>
                <h3>Endereço</h3>
                <Info>
                  {alumn.address?.street},
                </Info>
                <Info>
                  CEP: {alumn.address?.cep}
                </Info>
                <Info>
                  Cidade: {alumn.address?.city}
                </Info>
                {alumn.residenceFile?._id ? <UpdateUploadBox title={'Substituir arquivo'} type='residence' entity="alumn" entityId={alumn._id} /> : null}
              </InfoContainer>
              {alumn.residenceFile?._id ? null
                  :
                  <UpdateUploadBox title={'Comprovante de residência'} type='residence' entity="alumn" entityId={alumn._id} />
                }
              {alumn?.residenceFile ? <FileItem file={alumn.residenceFile}/> : null
              }
            </>
            </IdContainer>
            

            : content === "enrollment" ? <NoData/> : null}

            {content === 'enrollment' && alumn.diplomaUniversity && alumn.diplomaYear && !isVisible.show ?
            <IdContainer><>
              <InfoContainer>
                <h3>Graduação</h3>
                <Info>
                  Instituição de ensino: {alumn.diplomaUniversity}
                </Info>
                <Info>
                  Ano de formação: {alumn.diplomaYear}
                </Info>
                {alumn.diplomaFile?._id ? <UpdateUploadBox title={'Substituir arquivo'} type='diploma' entity="alumn" entityId={alumn._id} /> : null}
              </InfoContainer>

              {alumn.diplomaFile?._id ? null                  
                  :
                  <UpdateUploadBox title={'Diploma de graduação'} type='diploma' entity="alumn" entityId={alumn._id} />
                }
              
              {alumn?.diplomaFile ? <FileItem file={alumn.diplomaFile}/> : null
              }
            </>
            </IdContainer>
            

            : content === "enrollment" ? <NoData/> : null}

            {content === 'enrollment' && alumnPayments?.length && !isVisible.show ?
            
            <PaymentCard payment={alumnPayments.filter((payment): payment is IPayment=>payment.type === 'enrollment')[0]} details={true}/>
            : content === 'enrollment' ? <NoData/> : null}
            
            {content === "freqsAndGrades" && !isVisible.show &&
            alumn.frequences &&
            alumn.frequences.length ? (<>
              <GradeAndFrequence grade={alumn.grades?.[0]} frequence={alumn.frequences?.[0]} axisType={"A"} />
              <GradeAndFrequence grade={alumn.grades?.[1]} frequence={alumn.frequences?.[1]} axisType={"B"} />
              <GradeAndFrequence grade={alumn.grades?.[2]} frequence={alumn.frequences?.[2]} axisType={"C"} />
              <GradeAndFrequence grade={alumn.grades?.[3]} frequence={alumn.frequences?.[3]} axisType={"D"} />
              {alumn.frequences?.[4] ? (<GradeAndFrequence grade={alumn.grades?.[4]} frequence={alumn.frequences?.[4]} axisType={"E"} />):null}
            </>
            ) : content === "freqsAndGrades" ? <NoData/> : null}
            
            {content === "lessons" && !isVisible.show &&
            alumn.lessons &&
            alumn.lessons.length ? (
              <Table
                columns={lessonColumns}
                dataSource={totalLessons?.map((lesson, index) => {
                  return {
                    key: (index + 1).toString(),
                    number: totalLessons?.length
                      ? totalLessons.length - index
                      : 0,
                    name: lesson?.name,
                    date: lesson?.date,
                    period: lesson?.period ? lessonPeriodMap[lesson.period] : '',
                    professor: lesson?.professor?.name,
                    call: alumn.lessons?.some((alumnLesson) => alumnLesson._id === lesson?._id) ? 'present' : 'absent',
                    axisType: alumn.axis?.find(axis=>axis.lessons?.some(lessonAxis=>lessonAxis._id === lesson?._id))?.type,
                    getLesson: () => {
                      navigator("/lessonDetails", {
                        state: {lessonId: lesson?._id},
                      });
                    },
                  };
                })}
                pagination={{ pageSize: 200 }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : content === "lessons" ? <NoData/> : null}

          {content === "axis" && !isVisible.show &&
            alumn.axis &&
            alumn.axis.length ? (
              <Table
                columns={axisColumns}
                dataSource={alumn.axis.map((axis, index) => {
                  return {
                    key: (index + 1).toString(),
                    number: alumn.axis?.length
                      ? alumn.axis.length - index
                      : 0,
                    type: axis.type,
                    dateStartEnd: [axis.dateStart,axis.dateEnd],
                    grades: alumn.grades?.[indexGradeMap[axis.type]],
                    status: axis.status,
                    getAxis: () => {
                      navigator("/axisDetails", {
                        state: {axisId: axis._id},
                      });
                    },
                  };
                })}
                pagination={{ pageSize: 200 }}
                style={{ width: "100%", height: "100%" }}
              />
            )  : content === "axis" ? <NoData/> : null}
            {content === "addPayment" && !isVisible.show && (
                <>
                <IconButton
                  name="addPayment"
                  icon={FaTimes}
                  onPress={() => setContent("payments")}
                />
                <CreatePaymentCard payments={alumnPayments} setPayments={setAlumnPayments} refresh={refetch} alumn={alumn}/>
                </>
              )}
            
            {content === "payments" && alumnPayments?.length ? (<>
              
              
              { alumnPayments.filter((payment): payment is IPayment => payment.type !== 'enrollment').length ? 
              
                
              <Table
                columns={paymentColumns}
                
                dataSource={alumnPayments.filter(payment=>payment.type !== 'enrollment').sort((a, b) => stringToDateRed(a.date).getTime() - stringToDateRed(b.date).getTime()).map((payment, index) => {
                  return {
                    key: (index + 1).toString(),
                    number: alumnPayments?.length
                      ? alumnPayments.length - index - 1
                      : 0,
                    date: payment.date,
                    type: payment.type,
                    value: payment.value,
                    alumn: payment.alumn?.name,
                    getPayment: () =>
                      navigator("/paymentDetails", {
                      state: { paymentId: payment._id},
                    }),
                  };
                })}
                pagination={{ pageSize: 150 }}
                style={{ width: "100%", height: "100%" }}
              /> : null}
              {alumnPayments.length < 13 ? <Button
                  name="addPayment"
                  onPress={() => setContent("addPayment")}
                  text="Adicionar pagamento"
                /> : null}
            </>
            )  : content === "payments" ? <NoData/> : null}
            {content === "docs" && alumn.status === "completed" && !isVisible.show ? (
              <AlumnDiplomaCard
                key={`${alumn._id}_declaration`}
                alumn={alumn}
              />) : null}
            {content === "docs" && alumn.status === "onCourse" && !isVisible.show ? (
              <AlumnDeclarationCard
                key={`${alumn._id}_declaration`}
                alumn={alumn}
              />) : null}
            {content === "docs" ? (
              <AlumnHistoryCard
                key={`${alumn._id}_navigator`}
                alumn={alumn}
              />) : null}
            {content === "docs" && alumn.type === "regular" && !isVisible.show ? (
              <AlumnFinanceCard
                key={`${alumn._id}_finance`}
                alumn={alumn}
              />
            ) : null}
            {content === "update" && !isVisible.show ? (
              <UpdateAlumnCard
                key={`${alumn._id}_update`}
                alumn={alumn}
              />
            ) : null}
          </Container>
          {content === 'cancel' || content === 'pause' || content === 'resume' ?
          <MutationModal
            key={'updateAlumnEnrollmentMutationModal'}
            show={isVisible.show}
            stage={isVisible.type}
            onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}

            onPressMutate={() => {
              if(content === 'cancel') updateAlumn({variables: {alumnInput: {alumnId: alumn._id, status: "cancelled"}}})
              else if(content === 'pause') updateAlumn({variables: {alumnInput: {alumnId: alumn._id, status: "paused"}}})
                else if(content === 'resume') updateAlumn({variables: {alumnInput: {alumnId: alumn._id, status: "onCourse"}}})
              }
            }
            onPressError={() => setIsVisible({show: false, type: 'error'})}
            onPressSuccess={() => {
              navigator('/alumns')  
            }}
            content={{
              confirmationTopText,
              errorDescription,
              successDescription,
            }}
            loading={loadingUpdateAlumn}
            children={<AlumnCard alumn={{...alumn, status: content === 'cancel' ? 'cancelled' : content === 'pause' ? 'paused' : content === 'resume' ? 'onCourse' : ''}}/>}
          /> : null}
        </>
      )}
    </Body>
  );
};
export default AlumnProfilePage;
