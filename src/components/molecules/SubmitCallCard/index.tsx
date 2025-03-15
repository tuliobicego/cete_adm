import React, { useState } from "react";
import { Container } from "./styles";
import { useMutation } from "@apollo/client";
import {
  CallInput,
  CallPayload,
  SUBMIT_CALL,
} from "../../../api/database/mutations/submitCall";
import Button from "../../atoms/Button";
import Disclaimer from '../../atoms/Disclaimer'
import MutationModal from "../../templates/MutationModal";
import { IAlumn, ILesson } from "../../../types";
import { Table } from "antd";
import CallCard from "../CallCard";
import IconButton from "../../atoms/IconButton";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router";

interface SubmitCallCardProps {
  lesson: ILesson
  alumns: [IAlumn]
  refetchLesson: ()=>Promise<void>
}


const callColumns = [
  {
    title: "Aluno",
    dataIndex: "name",
    key: "name",
  },
  
]


const SubmitCallCard: React.FC<SubmitCallCardProps> = ({ alumns, lesson, refetchLesson }) => {
  const [update, setUpdate] = useState<boolean>(false)
  const [disclaimer, setDisclaimer] = useState<'emptyAlumns' | ''>('')
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>
  ({show: false, type: 'confirmation'})

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const navigate = useNavigate();
  
    const handleReload = () => {
      navigate(0); 
    };

  const [submitCall, {loading: loadingSubmitCall}] = useMutation<CallPayload,CallInput>
  (SUBMIT_CALL, {
    onCompleted: (data) => {      
      console.log({ data });
      if (data.submitCall.success) setIsVisible({show: true, type: 'success'})
    },
    onError: (error) => {
      setIsVisible({show: true, type: 'error'})
      console.log(JSON.stringify(error, null, 2));
    },
  })

  const handleUpdate = () => {
    setUpdate(true)
    setSelectedRowKeys(lesson.alumns?.map((alumn) =>{ return alumn._id}) || [''])
  }

  const handleSubmit = () => {
    if (!selectedRowKeys.length) {
      setDisclaimer('emptyAlumns')
      return
    }  else {setDisclaimer('')}
    setDisclaimer('')
    
    setIsVisible({show: true, type: 'confirmation'})
  }

  const handleSubmitCall = () => {
    const callAlumnsIds = selectedRowKeys.map((row)=>{return row.toString()})
    submitCall({
      variables: {
        callInput: {
          lessonId: lesson._id,
          alumnsIds: callAlumnsIds
        },
      },
    });
  }

  const rowSelection = {
    selectedRowKeys, // Controla as seleções
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys); // Atualiza as seleções
    },
  };

  return (<>
    <Container>
      
      {((!isVisible.show && !lesson.alumns?.length) || update) ? (
        <>
          {update ? 
          <IconButton
          name="updateCall"
          icon={FaTimes}
          onPress={() => setUpdate(false)}
          />: null}
          <h2 key="register"> Submissão de chamada </h2>
          <Table
                columns={callColumns}
                rowSelection={rowSelection}
                //rowSelection={{ type: 'checkbox', onChange: onSelectCall }}
                dataSource={alumns?.map((alumn) => {
                  return {
                    key: (alumn._id).toString(),
                    name: alumn.name,
                  };
                })}
                pagination={{ pageSize: 200, position: ['none', 'none']}}
                style={{ width: "100%", height: "100%" }}
              />
            
          <Disclaimer disclaimer={disclaimer} />
              <Button
                key={`add_call_mutation_button`}
                name={`add_call_mutation_button`}
                onPress={handleSubmit}
                text="Enviar chamada"
              />
            
        </>
      ) : !isVisible.show && lesson.alumns?.length ? (<>
        <CallCard
          presents={alumns.filter(alumn=>lesson.alumns?.some(a => a._id === alumn._id))?.map((alumn)=>alumn.name.concat(",\n"))}
          absents={alumns.filter(alumn=>!lesson.alumns?.some(a => a._id === alumn._id))?.map((alumn)=>alumn.name.concat(",\n"))}
          lessonName={lesson.name} />
          <Button
                key={`update_call_mutation_button`}
                name={`update_call_mutation_button`}
                onPress={handleUpdate}
                text="Alterar chamada"
              />
      </>) : null}
    </Container>
    <MutationModal
      show={isVisible.show}
      stage={isVisible.type}
      onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}
      onPressMutate={() => {
        selectedRowKeys.length ? handleSubmitCall() : setIsVisible({show: true, type: 'error'})
        }
      }
      onPressError={() => setIsVisible({show: false, type: 'error'})}
      onPressSuccess={async() => {setIsVisible({show: false, type: 'success'}); handleReload()}}//await refetchLesson()}}
      content={{
        confirmationTopText: `Gostaria de enviar uma chamada?`,
        errorDescription: ' Não foi possível enviar o chamada. Verifique todos os dados inseridos e tente novamente. Se o erro persistir, fale com a administração.',
        successDescription: 'Nova chamada enviada com sucesso!',
      }}
      loading={loadingSubmitCall}
      children={
        <CallCard
          lessonName={lesson.name}
          presents={lesson.axis?.alumns?.filter(alumn=>selectedRowKeys.includes(alumn._id))?.map((alumn)=>alumn.name.concat(",\n")) } 
          absents={ lesson.axis?.alumns?.filter(alumn=>!selectedRowKeys.includes(alumn._id))?.map((alumn)=>alumn.name.concat(",\n")) }
          />
      }
  />
  </>
  );
};

export default SubmitCallCard;
