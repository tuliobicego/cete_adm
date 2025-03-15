import { useQuery } from "@apollo/client";
import React, {  useState } from "react";
import { IAlumn } from "../../types";
import { Container, DarkContainer } from "../styles";
import Loading from "../../components/atoms/Loading";
import NoData from "../../components/atoms/NoData";
import CreateAlumnCard from "../../components/molecules/CreateAlumnCard";
import Body from "../../components/templates/Body";
import ErrorModal from "../../components/templates/ErrorModal";
import { useLocation } from "react-router";
import { AlumnInput, AlumnPayload, GET_ALUMN_BY_ID } from "../../api/database/queries/getAlumn";

const CreateAlumnEnrolled: React.FC = () => {

  const [alumn, setAlumn] = useState<IAlumn | undefined>();
  const [alumns, setAlumns] = useState<IAlumn[] | undefined>();
  const [showError, setShowError] = useState<boolean>(false);
  const [reloading, setReloading] = useState<boolean>(false);

  const location = useLocation();

  
  
  const {
    loading,
    refetch,
    error,
  } = useQuery<AlumnPayload, AlumnInput>(GET_ALUMN_BY_ID, {
    
    variables: { alumnId: location.state.alumnId },
    onCompleted: (data) => {
      if (data.alumn.alumn) {
        setAlumn(data.alumn.alumn);
      }
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

  
  if ((loading || reloading) && !alumn)
    return (
      <Container>
        <Loading />
      </Container>
    );
    else if((!loading || !reloading) && !alumn && showError)
      return (
        <Container>
          <ErrorModal onPressClose={()=>setShowError(false)} onPressError={()=>setShowError(false)} onPressTryAgain={handleRefetch} show={showError} loading={loading} content={{errorDescription:"Não foi possível buscar os alunos."}}/>
        </Container>
    )
    else if ((!loading || !reloading) && !alumn && !showError  )
    return (
      <Container>
        <NoData />
      </Container>
    );
  return (
    <Body>
      <DarkContainer>
        <CreateAlumnCard enrolled={alumn} setAlumns={setAlumns} alumns={alumns} refresh={refetch}/>
      </DarkContainer>
    </Body>
  );
};

export default CreateAlumnEnrolled;
