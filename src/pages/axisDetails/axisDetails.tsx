import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IAlumn, IAxis } from "../../types";
import {
  AssignmentAlumnsAxisInput,
  AssignmentAlumnsAxisPayload,
  ASSIGN_ALUMN_TO_AXIS,
  UNASSIGN_ALUMN_FROM_AXIS,
} from "../../api/database/mutations/assignmentAlumnsAxis";
import {
  GET_AXIS_BY_ID,
  AxisInput,
  AxisPayload,
  GET_AXIS,
} from "../../api/database/queries/getAxis";
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
  FaAward,
  FaUsers,
  FaUserTie,
  FaChalkboard,
  FaUserPlus,
  FaTrashAlt,
  FaUserMinus,
} from "react-icons/fa";
import { alumnStatusMap, axisStatusMap } from "../../utils/maps/status";
import { Table, Tag, Space, Tooltip, Divider } from "antd";
import { lessonStatusMap } from "../../utils/maps/status";
import { alumnColorStatusMap, axisColorStatusMap, axisTypeColorMap, lessonColorStatusMap } from "../../utils/maps/color";
import ProfessorCard from "../../components/molecules/ProfessorCard";
import { lessonPeriodMap } from "../../utils/maps/date";
import SubmitGradesCard from "../../components/molecules/SubmitGradesCard";
import { axisTypeMap } from "../../utils/maps/type";
import { ReactComponent as ArrowRight } from "../../assets/svg/chevron-right.svg";
import { stringToDateRed } from "../../utils/date/date";
import Button from "../../components/atoms/Button";
import MutationModal from "../../components/templates/MutationModal";
import AxisCard from "../../components/molecules/AxisCard";
import { UPDATE_AXIS, UpdateAxisInput, UpdateAxisPayload } from "../../api/database/mutations/updateAxis";
import { axisErrorMap } from "../../utils/maps/error";
import { generalTagStyle } from "../../utils/styles/generalStyles";

const availableAlumnsColumns = [
  {
    title: "Aluno",
    dataIndex: "availableAlumnName",
    key: "availableAlumnName",
  },
  {
    title: "Turma Atual",
    dataIndex: "currentAxis",
    key: "currentAxis",

    filters: [
      {text: 'A', value: 'A'},
      {text: 'B', value: 'B'},
      {text: 'C', value: 'C'},
      {text: 'D', value: 'D'},
      {text: 'E', value: 'E'},
      {text: 'Sem Turma', value: 'Sem Turma'}
    ],

    filterSearch: true,
    onFilter: (value, record) => record.currentAxis === value,
    width: '30%',
  },
  
]



const lessonColumns = [
  {
    title: "Número",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "Nome",
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
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag
        color={lessonColorStatusMap[status]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={status}
      >
        {lessonStatusMap[status].toUpperCase()}
      </Tag>
    ),
  },
  {
    title: "",
    dataIndex: "",
    key: "",
    render: ({ _id, getlesson }) => (
      <Space size="middle">
        <Tooltip placement="bottom" title="Detalhes da aula">
          <IconButton
            name="lessonDetails"
            onPress={getlesson}
            icon={ArrowRight}
          />
        </Tooltip>
      </Space>
    ),
  },
];

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
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag
        color={alumnColorStatusMap[status]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={status}
      >
        {alumnStatusMap[status].toUpperCase()}
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




const AxisDetailsPage: React.FC = () => {

  
  const [availableAlumns, setAvailableAlumns] = useState<IAlumn[]>([] as IAlumn[]);
  const [alumnsIdsAdd, setAlumnsIdsAdd] = useState<string[] | undefined>(undefined);
  const [alumnsIdsRemove, setAlumnsIdsRemove] = useState<string[] | undefined>(undefined);

  const [axis, setAxis] = useState<IAxis | undefined>();
  const [content, setContent] = useState<
    | "alumns"
    | "addAlumns"
    | 'removeAlumns'
    | "delete"
    | 'update'
    | "professor"
    | "lessons"
    | "grades"
  >("alumns");
  const navigator = useNavigate();
  const location = useLocation();
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [confirmationTopText, setConfirmationTopText] = useState<string>('')
  const [successDescription, setSuccessDescription] = useState<string>('')
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})

  const navigate = useNavigate();
      
  const handleReload = () => {
    navigate(0); 
  };



  const {
    loading: loadingGetAxis,
    refetch,
    error,
  } = useQuery<AxisPayload, AxisInput>(GET_AXIS_BY_ID, {
    
    variables: { axisId: location.state.axisId },
    onCompleted: (data) => {
      if (data.axis.axis) {
        setAxis(data.axis.axis)
      }
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "cache-and-network",
  });

 

  const [getAvailableAlumns, { loading: loadingAvailableAlumns }] = useLazyQuery<AxisPayload>(GET_AXIS, {
    onCompleted: (data) => {
      if (data.axiss.axiss) {
          const alumnsOnCourse = data.axiss.axiss?.map((ax)=> {return ax.alumns?.filter(alumn=>(alumn.status === 'waiting' && alumn.type !== 'enrolled') || alumn.status === 'onCourse') || []}).flat().sort((a,b)=>a.name.localeCompare(b.name)).flat()
          const uniqueAlumns = alumnsOnCourse?.length ? Array.from(new Map(alumnsOnCourse?.map(obj => [obj?._id, obj])).values()) : [] as IAlumn[]
          setAvailableAlumns(uniqueAlumns.filter((alumn)=>!alumn.axis?.find((ax)=> ax.type === axis?.type && (ax.status === "onCourse" || ax.status === "finished" ))))
        }
      },
      onError: (error) => {
        console.log(JSON.stringify(error, null, 2));
      },
      fetchPolicy: "network-only",
    });

    const [assignAlumnsToAxis, {loading: loadingAddAlumns}] = useMutation
    <AssignmentAlumnsAxisPayload, AssignmentAlumnsAxisInput>(
      ASSIGN_ALUMN_TO_AXIS,
      {onCompleted: (data) => {
        console.log(data)
        if(data.assignmentAlumnsAxis.success) {
          //setAxis(data.updateAxis.axis)
          setIsVisible({show: true, type: 'success'})
        }
        else {
          setErrorDescription( axisErrorMap[data.assignmentAlumnsAxis.errors.message])
          setIsVisible({show: true, type: 'error'})}     
      },
      onError: (error) => {
        setErrorDescription( axisErrorMap[''])
        setIsVisible({show: true, type: 'error'})
        console.log(JSON.stringify(error, null, 2));
      },
    });
    
    const onSelectAlumnsAdd = (selectedRow) => {
      setAlumnsIdsAdd(selectedRow);
    };

    const handleAddAlumns =  () =>  {
      if(axis?._id && alumnsIdsAdd?.length) {
        assignAlumnsToAxis(
          { variables:
            { assignmentInput:
              { axisId: axis._id, alumnsIds: alumnsIdsAdd}
            }
          })
      }
    }

    const [unassignAlumnsFromAxis, {loading: loadingRemoveAlumns}] = useMutation
    <AssignmentAlumnsAxisPayload, AssignmentAlumnsAxisInput>(
      UNASSIGN_ALUMN_FROM_AXIS,
      {onCompleted: (data) => {
      
        if(data.assignmentAlumnsAxis.success) {
          //setAxis(data.updateAxis.success)
          setIsVisible({show: true, type: 'success'})
        }
        else {
          setErrorDescription( axisErrorMap[data.assignmentAlumnsAxis.errors.message])
          setIsVisible({show: true, type: 'error'})}     
      },
      onError: (error) => {
        setErrorDescription( axisErrorMap[''])
        setIsVisible({show: true, type: 'error'})
        console.log(JSON.stringify(error, null, 2));
      },
    });


    const handleRemoveAlumns =  () =>  {
      if(axis?._id && alumnsIdsRemove?.length) {
        unassignAlumnsFromAxis(
          { variables:
            { assignmentInput:
              { axisId: axis._id, removeAlumnsIds: alumnsIdsRemove}
            }
          })
      }
    }

    

  const [deleteAxis, { loading: loadingDeleteAxis }] = useMutation<
    UpdateAxisPayload,
    UpdateAxisInput
  >(UPDATE_AXIS, {
    onCompleted: (data) => {
      
      if(data.updateAxis.axis) {
        setIsVisible({show: true, type: 'success'})
      }
      else {
        setErrorDescription( axisErrorMap[data.updateAxis.errors.message])
        setIsVisible({show: true, type: 'error'})}     
    },
    onError: (error) => {
      setErrorDescription( axisErrorMap[''])
      setIsVisible({show: true, type: 'error'})
      console.log(JSON.stringify(error, null, 2));
    },
  });

    const handleDeleteAxis =  () =>  {
      if(axis?._id) {
        deleteAxis(
          { variables:
            { updateAxisInput:
              { axisId: axis._id, status: 'cancelled'}
            }
          })
      }
    }

    const onSelectAlumnsRemove = (selectedRow) => {
      setAlumnsIdsRemove(selectedRow);
    };

    const handleContent = ( content:
      | "alumns"
      | "addAlumns"
      | 'removeAlumns'
      | "delete"
      | 'update'
      | "professor"
      | "lessons"
      | "grades") => {
        if(!isVisible.show) {
          if(content === 'addAlumns')   getAvailableAlumns(); 
          setContent(content)
        }
    }




  if (loadingGetAxis && !axis)
    return (
      <Body>
        <Loading />
      </Body>
    );
  if (error) refetch();
  return (
    <Body>
      {axis && (
        <>
          <Header>
            <Name> 
                <Tag
                color={axisTypeColorMap[axis.type]}
                style={generalTagStyle}
                key={axis.type}
              >
                {axisTypeMap[axis.type]}
              </Tag>

              <Info>Data de início: {axis.dateStart}</Info>
              <Info>Data do fim: {axis.dateEnd}</Info>
              
              {axis.professor?.name && (
                <Info>
                  Professor responsável: {axis.professor?.name}
                  
                </Info>
              )}
              <Tag
                color={axisColorStatusMap[axis.status]}
                style={generalTagStyle}
                key={axis.status}
              >
                {axisStatusMap[axis.status]}
              </Tag>
            </Name>
            <InfoContainer style={{ justifyContent: "space-evenly" }}>
              
              
            </InfoContainer>{/*
            <IconContainer
              color={content === "update" ? "#2d76b2" : "transparent"}
            >
              <IconButton
                name={"Editar turma"}
                label={"Editar turma"}
                onPress={() => handleContent("update")}
                icon={FaEdit}
              />
            </IconContainer>*/}
            <IconContainer
              color={content === "delete" ? "#2d76b2" : "transparent"}
            >
              <IconButton
                name={"Deletar turma"}
                label={"Deletar turma"}
                onPress={() => {
                  setSuccessDescription('Turma deletada com sucesso!!')
                  setConfirmationTopText(`Tem certeza que gostaria de deletar a turma? \n A ação cancelará também as aulas cadastradas nesta turma.`)
                  setIsVisible({show: true, type: 'confirmation'})
                  handleContent("delete")
                }}
                icon={FaTrashAlt}
              />
            </IconContainer>
          </Header>
          <Divider />

          <Container>
            <ButtonsBox>
            
            {axis.professor ? (
                <IconContainer
                  color={
                    content === "professor" ? "#2d76b2" : "transparent"
                  }
                >
                  <IconButton
                    name={"Professor Responsável"}
                    label={"Professor Responsável"}
                    onPress={() => handleContent("professor")}
                    icon={FaUserTie}
                  />
                </IconContainer>
              ) : null}
              
                            
              {axis.alumns ? (
                <IconContainer
                  color={
                    content === "alumns" ? "#2d76b2" : "transparent"
                  }
                >
                  <IconButton
                    name={"Alunos matriculados"}
                    label={"Alunos matriculados"}
                    onPress={() => handleContent("alumns")}
                    icon={FaUsers}
                  />
                </IconContainer>
              ) : null}
              {axis.status === "onCourse" || axis.status === "scheduled" ? (
                <IconContainer
                  color={
                    content === "addAlumns" ? "#2d76b2" : "transparent"
                  }
                >
                  <IconButton
                    name={"Adicionar alunos"}
                    label={"Adicionar alunos"}
                    onPress={() => {handleContent("addAlumns")}}
                    icon={FaUserPlus}
                  />
                </IconContainer>
              ) : null}
              {(axis.status === "onCourse" || axis.status === "scheduled") && axis.alumns?.length  ? (
                <IconContainer
                  color={
                    content === "removeAlumns" ? "#2d76b2" : "transparent"
                  }
                >
                  <IconButton
                    name={"Remover alunos"}
                    label={"Remover alunos"}
                    onPress={() => {handleContent("removeAlumns")}}
                    icon={FaUserMinus}
                  />
                </IconContainer>
              ) : null}
              
              {axis.lessons ? (
                <IconContainer
                  color={content === "lessons" ? "#2d76b2" : "transparent"}
                >
                  <IconButton
                    name={"Aulas"}
                    label={"Aulas"}
                    onPress={() => handleContent("lessons")}
                    icon={FaChalkboard}
                  />
                </IconContainer>
              ) : null}

              {axis.status !== "cancelled" ? (
                <IconContainer
                  color={
                    content === "grades" ? "#2d76b2" : "transparent"
                  }
                >
                  <IconButton
                    name={"Notas"}
                    label={"Notas"}
                    onPress={() => handleContent("grades")}
                    icon={FaAward}
                  />
                </IconContainer>
              ) : null}

              
            </ButtonsBox>

            {content === "alumns"  && !isVisible.show &&
            axis.alumns &&
            axis.alumns.length ? (
              <><Table
                columns={alumnsColumn}
                dataSource={axis.alumns.map((alumn, index) => {
                  return {
                    key: (index + 1).toString(),
                    number: axis.alumns?.length
                      ? axis.alumns.length - index
                      : 0,
                    name: alumn.name,
                    type: alumn.type,
                    enrollmentDate: alumn.enrollmentDate,
                    status: alumn.status,
                    getAlumn: () => {
                      navigator("/alumnProfile", {
                        state: {alumnId: alumn._id},
                      });
                    },
                  };
                })}
                pagination={{ pageSize: 200 }}
                style={{ width: "100%", height: "100%" }}
              /></>
            ) : null}

          {content === "addAlumns" && availableAlumns?.length && axis.status && axis.type && !isVisible.show ? <>
             <h2 key="availableAlumnsLabel" style={{ marginTop: "2%" }}> Alunos habilitados </h2>
            <Table
              columns={availableAlumnsColumns}
              rowSelection={{ type: 'checkbox', onChange: onSelectAlumnsAdd }}
              dataSource={availableAlumns?.map((alumn) => {
                const alumnAxis = alumn.axis?.filter((axis)=>axis.status === 'onCourse')
                const alumnCurrentAxisType = alumn.status === "cancelled" || alumn.status === 'completed' ? '' : alumnAxis?.length ? alumnAxis.sort((a, b) => stringToDateRed(a.dateStart).getTime() - stringToDateRed(b.dateStart).getTime())[0]?.type : ''
                return {
                  key: (alumn._id).toString(),
                  availableAlumnName: alumn.name,
                  currentAxis: alumn.axis && alumn.axis.length && alumnCurrentAxisType ? alumnCurrentAxisType : "Sem Turma",
                  
                };
              })}
              pagination={{ pageSize: 200, position: ['none', 'none']}}
              style={{ width: "100%", height: "100%" }}
            />
              {alumnsIdsAdd?.length ? <Button
                key={`add_axis_mutation_button`}
                name={`add_axis_mutation_button`}
                onPress={() =>  {
                  setSuccessDescription('Aluno adicionado(s) à turma com sucesso!')
                  setConfirmationTopText(`Gostaria de adicionar aluno(s) à turma?`)
                  setIsVisible({show: true, type: 'confirmation'})
                }}
                text="Adicionar aluno(s) selecionado(s)"
              /> : null}
            </>
          : loadingAvailableAlumns  ? <Loading/> : null}

          {content === "removeAlumns" && axis.alumns?.length && axis.status && axis.type && !isVisible.show ? <>
             <h2 key="availableAlumnsLabel" style={{ marginTop: "2%" }}> Alunos matriculados na turma </h2>
            <Table
              columns={availableAlumnsColumns}
              rowSelection={{ type: 'checkbox', onChange: onSelectAlumnsRemove }}
              dataSource={axis.alumns?.map((alumn) => {
                const alumnAxis = alumn.axis?.filter((axis)=>axis.status === 'onCourse')
                const alumnCurrentAxisType = alumn.status === "cancelled" || alumn.status === 'completed' ? '' : alumnAxis?.length ? alumnAxis.sort((a, b) => stringToDateRed(a.dateStart).getTime() - stringToDateRed(b.dateStart).getTime())[0]?.type : ''
                return {
                  key: (alumn._id).toString(),
                  availableAlumnName: alumn.name,
                  currentAxis: alumn.axis && alumn.axis.length && alumnCurrentAxisType ? alumnCurrentAxisType : "Sem Turma",
                  
                };
              })}
              pagination={{ pageSize: 200, position: ['none', 'none']}}
              style={{ width: "100%", height: "100%" }}
            />
            {alumnsIdsRemove?.length ? <Button
              key={`remove_axis_mutation_button`}
              name={`remove_axis_mutation_button`}
              onPress={() =>  {
                setSuccessDescription('Aluno(s) removido(s) da turma com sucesso!')
                setConfirmationTopText(`Gostaria de remover aluno(s) da turma?`)
                setIsVisible({show: true, type: 'confirmation'})
              }}
              text="Remover aluno(s) selecionado(s)"
            /> : null}
            </>
          : loadingAvailableAlumns  ? <Loading/> : null}



          {content === "professor" && !isVisible.show &&
            axis.professor ? (
              <ProfessorCard
                professor={axis.professor}
              />
            ) : null}
            
            
            {content === "lessons" && !isVisible.show &&
            axis.lessons &&
            axis.lessons.length ? (
              <Table
                columns={lessonColumns}
                dataSource={axis.lessons.map((lesson, index) => {
                  return {
                    key: (index + 1).toString(),
                    number: axis.lessons?.length
                      ? axis.lessons.length - index
                      : 0,
                    name: lesson.name,
                    date: lesson.date,
                    period: lessonPeriodMap[lesson.period],
                    status: lesson.status,
                    getlesson: () => {
                      navigator("/lessonDetails", {
                        state: {lessonId: lesson._id},
                      });
                    },
                  };
                })}
                pagination={{ pageSize: 200 }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : null}

          {content === "grades" && !isVisible.show &&
            axis.alumns &&
            axis.alumns.length ? (
              <SubmitGradesCard
                axis={axis} 
                alumns={
                  axis.alumns?.map((alumn) => {
                    let grade = ''
                    if (axis.type === "A") { grade = alumn.grades?.length ? alumn.grades[0] : ''}
                    else if(axis.type === "B") { grade = alumn.grades?.length && alumn.grades?.length >= 1 ? alumn.grades[1] : ''}
                    else if(axis.type === "C") { grade = alumn.grades?.length && alumn.grades?.length >= 2 ? alumn.grades[2] : ''}
                    else if(axis.type === "D") { grade = alumn.grades?.length && alumn.grades?.length >= 3 ? alumn.grades[3] : ''}
                    else if(axis.type === "E") { grade = alumn.grades?.length && alumn.grades?.length >= 4 ? alumn.grades[4] : ''}
                    return {_id: alumn._id, name: alumn.name, grade}
                  }).filter((alumn) => alumn.grade !== '')
                }
                refetchAxis={async()=>{await refetch(); handleReload()}}
              />
            ) : null}
          </Container>
          <MutationModal
            show={isVisible.show}
            stage={isVisible.type}
            onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}
            onPressMutate={() => {
              if(content === 'delete') {
                handleDeleteAxis()
              } else if(content === 'addAlumns' && alumnsIdsAdd?.length) {
                handleAddAlumns()
              } else if(content === 'removeAlumns' && alumnsIdsRemove?.length) {
                handleRemoveAlumns()
              }              
            }}
            onPressError={() => setIsVisible({show: false, type: 'error'})}
            onPressSuccess={() => {
              setIsVisible({show: false, type: 'success'})
              if(content === 'delete') {
                navigator('/axis')  
              } else {
                handleReload()
              }            
            }}
            content={{
              confirmationTopText,
              errorDescription,
              successDescription,
            }}
            loading={loadingDeleteAxis || loadingAddAlumns || loadingRemoveAlumns}
            children={ content === 'delete' ? <AxisCard axis={{...axis, status: 'cancelled' }}/> : null}
          />
        </>
      )}
    </Body>
  );
};
export default AxisDetailsPage;
