import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { ILesson } from "../../types";
import { GET_LESSONS, LessonsPayload } from "../../api/database/queries/getLessons";
import { ButtonsBox, Container } from "../styles";
import Loading from "../../components/atoms/Loading";
import LessonList from "../../components/organisms/LessonList";
import NoData from "../../components/atoms/NoData";
import CreateLessonCard from "../../components/molecules/CreateLessonCard";
import IconButton from "../../components/atoms/IconButton";
import { FaPlus, FaTimes } from "react-icons/fa";
import Body from "../../components/templates/Body";
import ErrorModal from "../../components/templates/ErrorModal";

const Lesson: React.FC = () => {
  const [lessons, setLessons] = useState<ILesson[] | undefined>();
  const [content, setContent] = useState<"add" | "">("");
  const [showError, setShowError] = useState<boolean>(false);
  const [reloading, setReloading] = useState<boolean>(false);

  const { loading, refetch } = useQuery<LessonsPayload>(GET_LESSONS, {
    onCompleted: (data) => {
      const notCancelledLessons = data.lessons.lessons.filter((lesson): lesson is ILesson => lesson.status !== 'cancelled')
      if (notCancelledLessons) setLessons(notCancelledLessons);
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "cache-and-network",
  });

  const handleRefetch = async () => {
    setReloading(true);
    try {
      setShowError(false)
      await refetch(); 
    } catch (error) {
      setShowError(true)
      console.error("Erro ao atualizar:", error);
    } finally {
      setReloading(false);
    }
  };


  if ((loading || reloading) && !lessons)
    return (
      <Container>
        <Loading />
      </Container>
    );
    else if((!loading || !reloading) && !lessons && showError)
      return (
        <Container>
          <ErrorModal onPressClose={()=>setShowError(false)} onPressError={()=>setShowError(false)} onPressTryAgain={handleRefetch} show={showError} loading={loading} content={{errorDescription:"Não foi possível buscar os alunos."}}/>
        </Container>
    )
    else if ((!loading || !reloading) && !lessons && !showError  )
    return (
      <Container>
        <NoData />
      </Container>
    );
  return (
    <Body>
      <>
        {lessons?.length ? (
          <LessonList lessons={lessons} setLessons={setLessons} add={true} refresh={refetch} filterByName={true} filterByDate={true} filterByProfessor={true} filterByStatus={true} />
        ) : (
          <>
            <ButtonsBox>
              <IconButton
                name="addLesson"
                icon={content === "add" ? FaTimes : FaPlus}
                onPress={() =>
                  content === "add" ? setContent("") : setContent("add")
                }
              />
            </ButtonsBox>
            {content === "add" ? <CreateLessonCard lessons={lessons} setLessons={setLessons} refresh={refetch} setContent={()=>setContent('')}/> : null}
            <NoData />
          </>
        )}
      </>
    </Body>
  );
};

export default Lesson;
