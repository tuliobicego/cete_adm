import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { IProfessor } from "../../types";
import { GET_PROFESSORS, ProfessorsPayload } from "../../api/database/queries/getProfessors";
import { ButtonsBox, Container } from "../styles";
import Loading from "../../components/atoms/Loading";
import ProfessorList from "../../components/organisms/ProfessorList";
import NoData from "../../components/atoms/NoData";
import CreateProfessorCard from "../../components/molecules/CreateProfessorCard";
import IconButton from "../../components/atoms/IconButton";
import { FaPlus, FaTimes } from "react-icons/fa";
import Body from "../../components/templates/Body";
import ErrorModal from "../../components/templates/ErrorModal";

const Professors: React.FC = () => {
  const [professors, setProfessors] = useState<IProfessor[] | undefined>();
  const [content, setContent] = useState<"add" | "">("");
  const [showError, setShowError] = useState<boolean>(false);
  const [reloading, setReloading] = useState<boolean>(false);

  const { loading, refetch } = useQuery<ProfessorsPayload>(GET_PROFESSORS, {
    onCompleted: (data) => {
      if (data.professors.professors) setProfessors(data.professors.professors);
    },
    onError: (error) => {
      setShowError(true)
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
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


  if ((loading || reloading) && !professors)
    return (
      <Container>
        <Loading />
      </Container>
    );
    else if((!loading || !reloading) && !professors && showError)
      return (
        <Container>
          <ErrorModal onPressClose={()=>setShowError(false)} onPressError={()=>setShowError(false)} onPressTryAgain={handleRefetch} show={showError} loading={loading} content={{errorDescription:"Não foi possível buscar os professores."}}/>
        </Container>
    )
    else if ((!loading || !reloading) && !professors && !showError  )
    return (
      <Container>
        <NoData />
      </Container>
    );
  return (
    <Body>
      <>
        {professors?.length && content=="" ? (
          <ProfessorList professors={professors} setProfessors={setProfessors} add={true} refresh={refetch} />
        ) : (
          <>
            <ButtonsBox>
              <IconButton
                name="addProfessor"
                icon={content === "add" ? FaTimes : FaPlus}
                onPress={() =>
                  content === "add" ? setContent("") : setContent("add")
                }
              />
            </ButtonsBox>
            {content === "add" ? <CreateProfessorCard refresh={refetch} setProfessors={setProfessors} professors={professors}/> : null}
            <NoData />
          </>
        )}
      </>
    </Body>
  );
};

export default Professors;
