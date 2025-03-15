import { Tag } from "antd";
import React from "react";
import { ILesson } from "../../../types";
import IconButton from "../../atoms/IconButton";
import { Container, Info, ButtonContainer, Content } from "./styles";
import { lessonStatusMap } from "../../../utils/maps/status";
import { axisTypeColorMap, lessonColorStatusMap, lessonLocationColorMap } from "../../../utils/maps/color";
import { axisTypeMap } from "../../../utils/maps/type";
import { ReactComponent as ArrowRight } from "../../../assets/svg/chevron-right.svg";
import { useNavigate } from "react-router";
import { lessonLocationMap } from "../../../utils/maps/location";

interface LessonCardProps {
  lesson: ILesson;
  //update: boolean
  //index?: string;
  children?: any
  details?: boolean
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  //update,
  //index,
  details,
  children,
}) => {
  const navigate = useNavigate()

  return (
    <Container>
      <Content>
        <Info>
            <h2>{lesson.name}</h2>
            <Info>
              {lesson.date}
            </Info>
            <Info>
              Professor: {lesson.professor?.name}
            </Info>
            {lesson.location ? 
              <Tag
                color={lessonLocationColorMap[lesson.location ||""]}
                style={{
                  marginBottom: '1%',
                  width: "40%",
                  textAlign: "center",
                  borderRadius: ".5rem",
                  fontSize: "16px",
                }}
                key={lesson.axis?.status}
              >
              {lessonLocationMap[lesson.location || ""]}
              </Tag>
          : null}
          </Info>
          <Info>
          <Tag
            color={axisTypeColorMap[lesson.axis?.type ||""]}
            style={{
              marginBottom: '1%',
              width: "40%",
              textAlign: "center",
              borderRadius: ".5rem",
              fontSize: "16px",
            }}
            key={lesson.axis?.status}
          >
          Turma {axisTypeMap[lesson.axis?.type || ""]}
          </Tag>

          <Tag
            color={lessonColorStatusMap[lesson.status]}
            style={{
              width: "40%",
              textAlign: "center",
              borderRadius: ".5rem",
              fontSize: "16px",
            }}
            key={lesson.status}
          >
              {lessonStatusMap[lesson.status]}
          </Tag>
          </Info>
        </Content>
        <ButtonContainer>
          {details ? 
            <IconButton name={''} onPress={()=>navigate('/lessonDetails', {state:{lessonId: lesson._id}})} icon={ArrowRight} />: null}
        </ButtonContainer>
      {children}
    </Container>
    
  );
};

export default LessonCard;

/*
  const [page, setPage] = useState<"profile" | "update">("profile");

<Container>
      {update && <IconButton
        name="edit"
        icon={page === "update" ? FaTimes : FaEdit}
        onPress={() =>
          page === "profile" ? setPage("update") : setPage("profile")
        }
      />}
      {page === "profile" && (
        <>
          {index ? <Info>Aula número: {index}</Info> : null}
          <Info>
            <h2>{lesson.date}</h2>
            {lesson.location ? <h2>Local: {lesson.location}</h2> : null}
          </Info>
          <Info>
            <h2>{lesson.name}</h2>
          </Info>
          <Info>
          <Tag
            color={axisTypeColorMap[lesson.axis?.type ||""]}
            style={{
              width: "40%",
              textAlign: "center",
              borderRadius: ".5rem",
              fontSize: "16px",
            }}
            key={lesson.axis?.status}
          >
           {axisTypeMap[lesson.axis?.type || ""]}
          </Tag>
            <Info>
              Professor: {lesson.professor?.name}
            </Info>
          </Info>

          <Tag
            color={lessonColorStatusMap[lesson.status]}
            style={{
              width: "40%",
              textAlign: "center",
              borderRadius: ".5rem",
              fontSize: "16px",
            }}
            key={lesson.status}
          >
            {lessonStatusMap[lesson.status]}
          </Tag>

          

          {children}
        </>
      )}
      {page === "update" && update && (
        <>
          <UpdateLessonCard lesson={lesson} />
        </>
      )}
    </Container>



<Tag
            color={lesson.status === "notPaid" ? "#c00" : "#0c0"}
            style={{
              width: "30%",
              textAlign: "center",
              borderRadius: ".5rem",
              fontSize: "16px",
            }}
            key={lesson.status}
          >
            Situação: {lessonStatusMap[lesson.status]}
          </Tag>
          */