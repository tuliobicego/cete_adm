import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { IAxis } from "../../types";
import { GET_AXIS, AxisPayload } from "../../api/database/queries/getAxis";
import { ButtonsBox, Container } from "../styles";
import Loading from "../../components/atoms/Loading";
import AxisList from "../../components/organisms/AxisList";
import NoData from "../../components/atoms/NoData";
import CreateAxisCard from "../../components/molecules/CreateAxisCard";
import IconButton from "../../components/atoms/IconButton";
import { FaPlus, FaTimes } from "react-icons/fa";
import Body from "../../components/templates/Body";
import ErrorModal from "../../components/templates/ErrorModal";

const Axis: React.FC = () => {
  const [axis, setAxis] = useState<IAxis[] | undefined>();
  const [content, setContent] = useState<"add" | "">("");
  const [showError, setShowError] = useState<boolean>(false);
  const [reloading, setReloading] = useState<boolean>(false);

  const { loading, refetch } = useQuery<AxisPayload>(GET_AXIS, {
    onCompleted: (data) => {
      const notCancelledAxiss = data.axiss.axiss.filter((axis): axis is IAxis => axis.status !== 'cancelled')
      if (notCancelledAxiss.length) setAxis(notCancelledAxiss);
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


  if ((loading || reloading) && !axis)
    return (
      <Container>
        <Loading />
      </Container>
    );
    else if((!loading || !reloading) && !axis && showError)
      return (
        <Container>
          <ErrorModal onPressClose={()=>setShowError(false)} onPressError={()=>setShowError(false)} onPressTryAgain={handleRefetch} show={showError} loading={loading} content={{errorDescription:"Não foi possível buscar as turmas."}}/>
        </Container>
    )
    else if ((!loading || !reloading) && !axis && !showError  )
    return (
      <Container>
        <NoData />
      </Container>
    );
  return (
    <Body>
      <>
        {axis?.length && content === "" ? (
          <AxisList axis={axis} add={true} refresh={refetch} setAxiss={setAxis} />
        ) : (
          <>
            <ButtonsBox>
              <IconButton
                name="addAxis"
                icon={content === "add" ? FaTimes : FaPlus}
                onPress={() =>
                  content === "add" ? setContent("") : setContent("add")
                }
              />
            </ButtonsBox>
            {content === "add" ? <CreateAxisCard refresh={refetch} axiss={axis} setAxiss={setAxis}/> : null}
            <NoData />
          </>
        )}
      </>
    </Body>
  );
};

export default Axis;
