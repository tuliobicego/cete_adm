import { useQuery } from "@apollo/client";
import React, {  useState } from "react";
import { IAlumn } from "../../types";
import { GET_ALUMNS, AlumnsPayload } from "../../api/database/queries/getAlumns";
import { ButtonsBox, Container } from "../styles";
import Loading from "../../components/atoms/Loading";
import AlumnList from "../../components/organisms/AlumnList";
import NoData from "../../components/atoms/NoData";
import CreateAlumnCard from "../../components/molecules/CreateAlumnCard";
import IconButton from "../../components/atoms/IconButton";
import { FaPlus, FaTimes } from "react-icons/fa";
import Body from "../../components/templates/Body";
import ErrorModal from "../../components/templates/ErrorModal";

const Alumns: React.FC = () => {
  const [alumns, setAlumns] = useState<IAlumn[] | undefined>();
  const [content, setContent] = useState<"add" | "">("");
  const [showError, setShowError] = useState<boolean>(false);
  const [reloading, setReloading] = useState<boolean>(false);

  const { loading, refetch } = useQuery<AlumnsPayload>(GET_ALUMNS, {
    onCompleted: (data) => {      
      if (data.alumns.alumns) setAlumns(data.alumns.alumns);
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


  if ((loading || reloading) && !alumns)
    return (
      <Container>
        <Loading />
      </Container>
    );
    else if((!loading || !reloading) && !alumns && showError)
      return (
        <Container>
          <ErrorModal onPressClose={()=>setShowError(false)} onPressError={()=>setShowError(false)} onPressTryAgain={handleRefetch} show={showError} loading={loading} content={{errorDescription:"Não foi possível buscar os alunos."}}/>
        </Container>
    )
    else if ((!loading || !reloading) && !alumns && !showError  )
    return (
      <Container>
        <NoData />
      </Container>
    );
  return (
    <Body>
      <>
        {alumns?.length ? (
          <AlumnList alumns={alumns} setAlumns={setAlumns} add={true} refresh={refetch} />
        ) : (
          <>
            <ButtonsBox>
              <IconButton
                name="addAlumn"
                icon={content === "add" ? FaTimes : FaPlus}
                onPress={() =>
                  content === "add" ? setContent("") : refetch
                }
              />
            </ButtonsBox>
            {content === "add" ? <CreateAlumnCard alumns={alumns} setAlumns={setAlumns} refresh={refetch}/> : null}
            <NoData />
          </>
        )}
      </>
    </Body>
  );
};

export default Alumns;
