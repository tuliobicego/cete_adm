import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ILesson } from "../../types";
import {
  GET_LESSON_BY_ID,
  LessonInput,
  LessonPayload,
} from "../../api/database/queries/getLesson";
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
  FaClipboardList,
  FaUsers,
  FaUserTie,
  FaTrashAlt,
  FaCalendarCheck,
} from "react-icons/fa";
import { FaPeopleLine } from "react-icons/fa6";
import { alumnPresenceMap } from "../../utils/maps/status";
import UpdateLessonCard from "../../components/molecules/UpdateLessonCard";
import { Table, Tag, Space, Tooltip, Divider, Row } from "antd";
import { lessonStatusMap } from "../../utils/maps/status";
import { alumnColorPresenceMap, alumnColorTypeMap, axisTypeColorMap, lessonColorStatusMap, lessonLocationColorMap, lessonPeriodColorMap } from "../../utils/maps/color";
import ProfessorCard from "../../components/molecules/ProfessorCard";
import AxisCard from "../../components/molecules/AxisCard";
import { alumnTypeMap } from "../../utils/maps/type";
import LessonCallCard from "../../components/molecules/LessonCallCard";
import SubmitCallCard from "../../components/molecules/SubmitCallCard";
import { ReactComponent as ArrowRight } from "../../assets/svg/chevron-right.svg";
import { lessonPeriodMap } from "../../utils/maps/date";
import {  transformDateBr } from "../../utils/date/date";
import MutationModal from "../../components/templates/MutationModal";
import LessonCard from "../../components/molecules/LessonCard";
import { lessonErrorMap } from "../../utils/maps/error";
import { UPDATE_LESSON, UpdateLessonInput, UpdateLessonPayload } from "../../api/database/mutations/updateLesson";
import { lessonLocationMap } from "../../utils/maps/location";



const alumnsColumn = [
  {
    title: "Número",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "Aluno",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Data de matrícula",
    dataIndex: "enrollmentDate",
    key: "enrollmentDate",
  },
  {
    title: "Tipo",
    dataIndex: "type",
    key: "type",
    render: (type) => (
      <Tag
        color={alumnColorTypeMap[type || '']}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={type}
      >
        {alumnTypeMap[type || '']}
      </Tag>
    )
  },
  {
    title: "",
    dataIndex: "presence",
    key: "presence",
    render: (presence) => (
      <Tag
        color={alumnColorPresenceMap[presence]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={presence}
      >
        {alumnPresenceMap[presence].toUpperCase()}
      </Tag>
    ),
  },
  {
    title: "",
    dataIndex: "",
    key: "",
    render: ({ _id, getAlumn }) => (
      <Space size="middle">
        <Tooltip placement="bottom" title="Detalhes do aluno">
          <IconButton
            name="axisDetails"
            onPress={getAlumn}
            icon={ArrowRight}
          />
        </Tooltip>
      </Space>
    ),
  },
];

const alumnsAssignedColumns = [
  {
    title: "Número",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "Aluno",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Data de matrícula",
    dataIndex: "enrollmentDate",
    key: "enrollmentDate",
  },
  {
    title: "Tipo",
    dataIndex: "type",
    key: "type",
    render: (type) => (
      <Tag
        color={alumnColorTypeMap[type || '']}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={type}
      >
        {alumnTypeMap[type || '']}
      </Tag>
    )
  },
  {
    title: "",
    dataIndex: "",
    key: "",
    render: ({ _id, getAlumn }) => (
      <Space size="middle">
        <Tooltip placement="bottom" title="Detalhes do aluno">
          <IconButton
            name="axisDetails"
            onPress={getAlumn}
            icon={ArrowRight}
          />
        </Tooltip>
      </Space>
    ),
  },
];

const LessonDetailsPage: React.FC = () => {
  const [lesson, setLesson] = useState<ILesson | undefined>();
  const [content, setContent] = useState<
    | "alumns"
    | "alumnsAssigned"
    | "update"
    | "confirm"
    | 'delete'
    | "professor"
    | "axis"
    | "call"
  >("axis");
  const navigator = useNavigate();
  const location = useLocation();
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [confirmationTopText, setConfirmationTopText] = useState<string>('')
  const [successDescription, setSuccessDescription] = useState<string>('')
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})

  
  const {
    loading: loadingGetLesson,
    refetch,
    error,
  } = useQuery<LessonPayload, LessonInput>(GET_LESSON_BY_ID, {
    
    variables: { lessonId: location.state.lessonId },
    onCompleted: (data) => {
      if (data.lesson.lesson) setLesson(data.lesson.lesson);
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
  });

  const [updateLesson, {loading: loadingUpdateLesson}] = useMutation
    <UpdateLessonPayload, UpdateLessonInput>(
      UPDATE_LESSON,
      {onCompleted: (data) => {
        const newStatus = data.updateLesson.lesson.status
        if(newStatus) {
          setLesson(prevLesson =>({...prevLesson, status: newStatus} as ILesson))
          setIsVisible({show: true, type: 'success'})
        }
        else {
          setErrorDescription( lessonErrorMap[data.updateLesson.errors.message])
          setIsVisible({show: true, type: 'error'})}     
      },
      onError: (error) => {
        setErrorDescription( lessonErrorMap[''])
        setIsVisible({show: true, type: 'error'})
        console.log(JSON.stringify(error, null, 2));
      },
    });

    const handleContent = ( content:
      | "alumns"
      | "alumnsAssigned"
      | "update"
      | "confirm"
      | 'delete'
      | "professor"
      | "axis"
      | "call") => {
        if(!isVisible.show) {
          if(content === 'confirm') {                              
            setConfirmationTopText(`Gostaria de confirmar esta aula?`)
            setSuccessDescription('Aula confirmada com sucesso!')
            setIsVisible({show: true, type: 'confirmation'})
          } else if(content === 'delete') {            
            setConfirmationTopText(`Gostaria de deletar esta aula?`)
            setSuccessDescription('Aula deletada com sucesso!')
            setIsVisible({show: true, type: 'confirmation'})
          }
          setContent(content)
        }
    }

  const handleDeleteLesson =  () =>  {
    if(lesson?._id) {
      updateLesson(
        { variables:
          { updateLessonInput:
            { lessonId: lesson._id, status: 'cancelled' }
          }
        })
    }
  }

  const handleConfirmLesson =  () =>  {
    if(lesson?._id) {
      updateLesson(
        { variables:
          { updateLessonInput:
            { lessonId: lesson._id, status: 'confirmed' }
          }
        })
    }
  }
  const handleRefetch = async () =>  {
    if(lesson?._id) {
      await refetch( )
    }
  }
  
  if (loadingGetLesson && !lesson)
    return (
      <Body>
        <Loading />
      </Body>
    );
  if (error) refetch();
  return (
    <Body>
      {lesson && (
        <>
          <Header>
            <Name>
              <h3>{lesson.name}</h3> 
              <Info>{lesson.date}</Info>
              {lesson.professor?.name && (
                <Info>
                  Professor: {lesson.professor?.name}
                  
                </Info>
              )}
              
              
            </Name>
            <InfoContainer>
            <Row>
            {lesson.axis?.type && (
                  
                    <Tag 
                      style={{
                        width: "100%",
                        marginTop: '1%',
                        textAlign: "center",
                        borderRadius: ".5rem",
                        fontSize: "16px",
                      }}
                      color={axisTypeColorMap[lesson.axis?.type]}>
                        {'Turma '+lesson.axis?.type+' de '+transformDateBr(lesson.axis.dateStart)+' a '+transformDateBr(lesson.axis.dateEnd)}
                    </Tag>
              )}
              
              <Tag
                color={lesson.period ? lessonPeriodColorMap[lesson.period] : 'transparent'}
                style={{
                  width: "100%",
                  marginTop: '1%',
                  textAlign: "center",
                  borderRadius: ".5rem",
                  fontSize: "16px",
                }}
                key={lesson.period}
              >
                {lesson.period ? lessonPeriodMap[lesson.period] :''}
              </Tag>
              <Tag
                color={lesson.location ? lessonLocationColorMap[lesson.location] : 'transparent'}
                style={{
                  width: "100%",
                  marginTop: '1%',
                  textAlign: "center",
                  borderRadius: ".5rem",
                  fontSize: "16px",
                }}
                key={lesson.location}
              >
                {lesson.location ? lessonLocationMap[lesson.location] :''}
              </Tag>
              
              <Tag
                color={lessonColorStatusMap[lesson.status]}                
                style={{
                  width: "100%",
                  marginTop: '1%',
                  textAlign: "center",
                  borderRadius: ".5rem",
                  fontSize: "16px",
                }}
                key={lesson.status}
              >
                {lessonStatusMap[lesson.status]}
              </Tag>
                  </Row>
            </InfoContainer>
            <InfoContainer color={content === "call" ? "#2d76b2" : "transparent"} 
            style={{ display: 'flex', justifyContent: "flex-end", alignItems: "center", height: '100%' }}>
              
             {lesson.status === 'confirmed' ? (<LessonCallCard lesson={lesson}/>) : null}
              
            </InfoContainer>
            <IconContainer
              color={content === "confirm" ? "#2d76b2" : "transparent"}
              style={{ display: 'flex', justifyContent: "center", alignItems: "center", height: '100%' }}
            >
              {lesson.status === 'scheduled' ?
              <IconButton
                name={"Confirmar aula"}
                label={"Confirmar aula"}
                onPress={() => {
                  handleContent("confirm")
                }}
                icon={FaCalendarCheck}
              /> : null}
              </IconContainer>
              <IconContainer
                  color={
                    content === "update" ? "#2d76b2" : "transparent"
                  }
                  style={{ display: 'flex', justifyContent: "center", alignItems: "center", height: '100%' }}
                >
              {lesson.status !== 'done' ?
              <IconButton
                name={"Editar aula"}
                label={"Editar aula"}
                onPress={() => {
                  handleContent("update")

                }}
                icon={FaEdit}
              /> : null}
              </IconContainer>
              <IconContainer
                  color={
                    content === "delete" ? "#2d76b2" : "transparent"
                  }
                  style={{ display: 'flex', justifyContent: "center", alignItems: "center", height: '100%' }}
                >
              {lesson.status !== 'cancelled' ?
              <IconButton
                name={"Deletar aula"}
                label={"Deletar aula"}
                onPress={() => {
                  handleContent("delete")                     
                }}
                icon={FaTrashAlt}
              /> : null}
            </IconContainer>
          </Header>
          <Divider />

          <Container>
            <ButtonsBox>
              {lesson.axis?.alumns?.length && (lesson.status === 'confirmed' || lesson.status === 'done') ? (
                <IconContainer
                  color={
                    content === "call" ? "#2d76b2" : "transparent"
                  }
                >
                  <IconButton
                    name={"Chamada"}
                    label={"Chamada"}
                    onPress={() => handleContent("call")}
                    icon={FaClipboardList}
                  />
                </IconContainer>
              ) : null}
            {lesson.axis ? (
                <IconContainer
                  color={
                    content === "axis" ? "#2d76b2" : "transparent"
                  }
                >
                  <IconButton
                    name={"Turma"}
                    label={"Turma"}
                    onPress={() => handleContent("axis")}
                    icon={FaPeopleLine}
                  />
                </IconContainer>
              ) : null}
            {lesson.professor ? (
                <IconContainer
                  color={
                    content === "professor" ? "#2d76b2" : "transparent"
                  }
                >
                  <IconButton
                    name={"Responsável"}
                    label={"Responsável"}
                    onPress={() => handleContent("professor")}
                    icon={FaUserTie}
                  />
                </IconContainer>
              ) : null}
              {lesson.alumns?.length ? (
                <IconContainer
                  color={
                    content === "alumns" ? "#2d76b2" : "transparent"
                  }
                >
                  <IconButton
                    name={"Alunos"}
                    label={"Alunos"}
                    onPress={() => handleContent("alumns")}
                    icon={FaUsers}
                  />
                </IconContainer>
                ) : lesson.axis?.alumns ? (
                  <IconContainer
                    color={
                      content === "alumns" ? "#2d76b2" : "transparent"
                    }
                  >
                    <IconButton
                      name={"Alunos inscritos"}
                      label={"Alunos inscritos"}
                      onPress={() => handleContent("alumnsAssigned")}
                      icon={FaUsers}
                    />
                  </IconContainer>
                )

              : null}

              
            </ButtonsBox>

            {content === "alumns" && !isVisible.show &&
            lesson.alumns &&
            lesson.alumns.length ? (
              <Table
                columns={alumnsColumn}
                dataSource={lesson.axis?.alumns?.map((alumn, index) => {
                  return {
                    key: (index + 1).toString(),
                    number: lesson.axis?.alumns
                      ? lesson.axis?.alumns.length - index
                      : 0,
                    name: alumn.name,
                    type: alumn.type,
                    enrollmentDate: alumn.enrollmentDate,
                    presence: lesson.alumns?.some(a => a._id === alumn._id) ? 'present' : 'absent',
                    getAlumn: () => {
                      navigator("/alumnProfile", {
                        state: {alumnId: alumn._id},
                      });
                    },
                  };
                })}
                pagination={{ pageSize: 200 }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : null}

            {content === "alumnsAssigned" && !isVisible.show &&
            lesson.axis &&
            lesson.axis.alumns?.length ? (
              <Table
                columns={alumnsAssignedColumns}
                dataSource={lesson.axis?.alumns?.map((alumn, index) => {
                  return {
                    key: (index + 1).toString(),
                    number: lesson.axis?.alumns
                      ? lesson.axis?.alumns.length - index
                      : 0,
                    name: alumn.name,
                    type: alumn.type,
                    enrollmentDate: alumn.enrollmentDate,
                    getAlumn: () => {
                      navigator("/alumnProfile", {
                        state: {alumnId: alumn._id},
                      });
                    },
                  };
                })}
                pagination={{ pageSize: 200 }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : null}

          {content === "professor" && !isVisible.show &&
            lesson.professor ? (
              <ProfessorCard
                professor={lesson.professor}
              />
            ) : null}
            
            
            {content === "axis" && !isVisible.show &&
            lesson.axis ? (
              <AxisCard
                axis={lesson.axis}
              />
            ) : null}

            {content === "call" && !isVisible.show &&
            lesson.axis?.alumns?.length ? (
              <SubmitCallCard lesson={lesson} alumns={lesson.axis.alumns} refetchLesson={handleRefetch}/> 
            ) : null}
            
            
            {content === "update" && !isVisible.show && lesson.status !== 'done' ? (
              <UpdateLessonCard
                key={`${lesson._id}_update`}
                lesson={lesson}
                setLesson={setLesson}
                refetchLesson={handleRefetch}
              />
            ) : null}
          </Container>
          {content === 'confirm' || content === 'delete' ?
          <MutationModal
            key={'deleteLessonMutationModal'}
            show={isVisible.show}
            stage={isVisible.type}
            onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}

            onPressMutate={() => {
              if(content === 'delete') handleDeleteLesson()
              else if(content === 'confirm') handleConfirmLesson()
              }
            }
            onPressError={() => setIsVisible({show: false, type: 'error'})}
            onPressSuccess={() => {
              if(content === 'delete') navigator('/lessons')
              else {
                setContent('axis')
                setIsVisible({show: false, type: 'confirmation'})
              }  
            }}
            content={{
              confirmationTopText,
              errorDescription,
              successDescription,
            }}
            loading={loadingUpdateLesson}
            children={<LessonCard lesson={{...lesson, status: content === 'delete' ? 'cancelled' : content === 'confirm' ? 'confirmed' : ''}}/>}
          /> : null}
        </>
      )}
    </Body>
  );
};
export default LessonDetailsPage;
