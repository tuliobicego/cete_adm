import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IProfessor } from "../../types";
import {
  GET_PROFESSOR_BY_ID,
  ProfessorInput,
  ProfessorPayload,
} from "../../api/database/queries/getProfessor";
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
  FaAngleRight,
  FaEdit,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { FaPeopleLine } from "react-icons/fa6";
import { axisStatusMap, professorStatusMap } from "../../utils/maps/status";
import UpdateProfessorCard from "../../components/molecules/UpdateProfessorCard";
import { Table, Tag, Space, Tooltip, Divider } from "antd";
import { lessonStatusMap } from "../../utils/maps/status";
import { lessonPeriodMap } from "../../utils/maps/date";
import { axisColorStatusMap, axisTypeColorMap, lessonColorStatusMap, professorColorStatusMap } from "../../utils/maps/color";
import { ReactComponent as ArrowRight } from "../../assets/svg/chevron-right.svg";
import { maskPhone } from "../../utils/masks/masks";
import { axisTypeMap } from "../../utils/maps/type";



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

const axisColumns = [
  {
    title: "Número",
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
    title: "Data de Início",
    dataIndex: "dateStart",
    key: "dateStart",
  },
  {
    title: "Data do fim",
    dataIndex: "dateEnd",
    key: "dateEnd",
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
            icon={FaAngleRight}
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
}

const ProfessorProfilePage: React.FC = () => {
  const [professor, setProfessor] = useState<IProfessor | undefined>();
  const [content, setContent] = useState<
    | "update"
    | "axis"
    | "lessons"
  >("lessons");
  const history = useNavigate();
  const location = useLocation();
  
  const {
    loading: loadingGetProfessor,
    refetch,
    error,
  } = useQuery<ProfessorPayload, ProfessorInput>(GET_PROFESSOR_BY_ID, {
    
    variables: { professorId: location.state.professorId },
    onCompleted: (data) => {
      if (data.professor.professor) setProfessor(data.professor.professor);
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "cache-and-network",
  });
  if (loadingGetProfessor && !professor)
    return (
      <Body>
        <Loading />
      </Body>
    );
  if (error) refetch();
  return (
    <Body>
      {professor && (
        <>
          <Header>
            <Name>
              <h3>{professor?.name}</h3>
              <Info>Telefone: {maskPhone(professor.phoneNumber)}</Info>
              <Info>E-mail: {professor.email}</Info>

              <Tag
                color={professorColorStatusMap[professor.status]}
                style={tagStyle}
                key={professor.status}
              >
                {professorStatusMap[professor.status]}
              </Tag>
            </Name>
            <InfoContainer>
            </InfoContainer>
            <InfoContainer style={{ justifyContent: "space-evenly" }}>
              
              
            </InfoContainer>
            <IconContainer
              color={content === "update" ? "#2d76b2" : "transparent"}
            >
              <IconButton
                name={"Editar perfil"}
                label={"Editar perfil"}
                onPress={() => setContent("update")}
                icon={FaEdit}
              />
            </IconContainer>
          </Header>
          <Divider />

          <Container>
            <ButtonsBox>
              {professor.axis?.length ? (
                <IconContainer
                  color={
                    content === "axis" ? "#2d76b2" : "transparent"
                  }
                >
                  <IconButton
                    name={"Turmas"}
                    label={"Turmas"}
                    onPress={() => setContent("axis")}
                    icon={FaPeopleLine}
                  />
                </IconContainer>
              ) : null}
              
              
              {professor.lessons ? (
                <IconContainer
                  color={content === "lessons" ? "#2d76b2" : "transparent"}
                >
                  <IconButton
                    name={"Aulas"}
                    label={"Aulas"}
                    onPress={() => setContent("lessons")}
                    icon={FaChalkboardTeacher}
                  />
                </IconContainer>
              ) : null}

              
            </ButtonsBox>

            {content === "axis" &&
            professor.axis &&
            professor.axis.length ? (
              <Table
                columns={axisColumns}
                dataSource={professor.axis.map((axis, index) => {
                  return {
                    key: (index + 1).toString(),
                    number: professor.axis?.length
                      ? professor.axis.length - index
                      : 0,
                    type: axis.type,
                    dateStart: axis.dateStart,
                    dateEnd: axis.dateEnd,
                    status: axis.status,
                    getAxis: () => {
                      history("/axisDetails", {
                        state: {axisId: axis._id},
                      });
                    },
                  };
                })}
                pagination={{ pageSize: 200 }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : null}
            
            
            {content === "lessons" &&
            professor.lessons &&
            professor.lessons.length ? (
              <Table
                columns={lessonColumns}
                dataSource={professor.lessons.map((lesson, index) => {
                  return {
                    key: (index + 1).toString(),
                    number: professor.lessons?.length
                      ? professor.lessons.length - index
                      : 0,
                    name: lesson.name,
                    date: lesson.date,
                    period: lessonPeriodMap[lesson.period],
                    status: lesson.status,
                    getlesson: () => {
                      history("/lessonDetails", {
                        state: {lessonId: lesson._id},
                      });
                    },
                  };
                })}
                pagination={{ pageSize: 200 }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : null}
            
            
            
            {content === "update" ? (
              <UpdateProfessorCard
                key={`${professor._id}_update`}
                professor={professor}
                setProfessor={setProfessor}
              />
            ) : null}
          </Container>
        </>
      )}
    </Body>
  );
};
export default ProfessorProfilePage;
