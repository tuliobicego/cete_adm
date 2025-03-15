import React, { useState } from "react";
import { Container } from "./styles";
import { useMutation } from "@apollo/client";
import {
  GradesInput,
  GradesPayload,
  SUBMIT_GRADES,
} from "../../../api/database/mutations/submitGrades";
import Button from "../../atoms/Button";
import Disclaimer from '../../atoms/Disclaimer'
import MutationModal from "../../templates/MutationModal";
import { IAxis } from "../../../types";
import { Table } from "antd";
import GradesCard from "../GradesCard";
import Input from "../../atoms/Input";
import { maskGrade } from "../../../utils/masks/masks";
import { axisErrorMap } from "../../../utils/maps/error";
import { useNavigate } from "react-router";



interface AlumnsAndGrades {
  _id: string
  name: string
  grade: string
}

interface SubmitGradesCardProps {
  axis: IAxis
  alumns: AlumnsAndGrades[] | []
  refetchAxis: ()=>Promise<void>
}

const SubmitGradesCard: React.FC<SubmitGradesCardProps> = ({ axis, alumns, refetchAxis }) => {
  const [alumnsAndGrades, setAlumnsAndGrades] = useState<AlumnsAndGrades[] | []>(alumns);
  const [disclaimer, setDisclaimer] = useState<'emptyGrades' | 'invalidGrade' | ''>('')
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>
  ({show: false, type: 'confirmation'})
  const navigate = useNavigate();
    
  const handleReload = () => {
    navigate(0); 
  };

  const [submitGrades, {loading: loadingSubmitGrades}] = useMutation<GradesPayload,GradesInput>
  (SUBMIT_GRADES, {
    onCompleted: (data) => {      
      console.log({ data });
      if (!data.submitGrades.success) setIsVisible({show: true, type: 'error'})
    },
    onError: (error) => {
      setIsVisible({show: true, type: 'error'})
      console.log(JSON.stringify(error, null, 2));
    },
  })


  const handleSubmit = () => {
    if (!alumnsAndGrades.length) {
      setDisclaimer('emptyGrades')
      return
    }  else {setDisclaimer('')}
    setDisclaimer('')
    
    setIsVisible({show: true, type: 'confirmation'})
  }

  const handleSubmitGrades = () => {
    submitGrades({
      variables: {
        gradesInput: {
          alumnsIds: alumnsAndGrades.map((alumn)=>alumn._id),
          grades: alumnsAndGrades.map((alumn)=>alumn.grade),
          axisId: axis._id
        },
      },
    });
  }
  
  const handleInputChange = (value: string, key: string) => {
    let newData
    if(value) {
      console.log({newData, alumnsAndGrades})
        newData = axis.alumns?.map((alumn) =>
        alumn._id === key
        ? { _id: alumn._id, name: alumn.name, grade: value }
        : { _id: alumn._id, name: alumn.name, grade: alumnsAndGrades.find((axisAlumn) => axisAlumn._id === alumn._id )?.grade  || '0'}
      ) as AlumnsAndGrades[]
      setAlumnsAndGrades(newData);
    }
  }

  const gradesColumns = [
    {
      title: "Aluno",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nota",
      dataIndex: "grade",
      key: "grade",
      render: (_, record) => (
        <Input
          value={record.grade}
          maskType="grade"
          onChange={(e) => handleInputChange(e.target.value, record.key)}
          defaultValue={record.grade}
        />
      )
    }
  ]

  return (<>
    <Container>
      
      {!isVisible.show && !alumns?.length ? (
        <>
          <h2 key="register">Atribuir notas</h2>
          <Table
                columns={gradesColumns}
                dataSource={axis.alumns?.map((alumn) => {
                  return {
                    key: (alumn._id).toString(),
                    name: alumn.name,
                    grade: alumnsAndGrades.find((axisAlumn) => axisAlumn._id === alumn._id )?.grade
                  };
                })}
                pagination={{ pageSize: 200, position: ['none', 'none']}}
                style={{ width: "100%", height: "100%" }}
              />
            
          <Disclaimer disclaimer={disclaimer} />
              <Button
                key={`add_notes_mutation_button`}
                name={`add_notes_mutation_button`}
                onPress={handleSubmit}
                text="Enviar notas"
              />
            
        </>
      ) : !isVisible.show && alumns?.length && axis.status === 'finished' ? (
        <GradesCard
          alumnsAndGrades={alumnsAndGrades}
          axis={axis} />
      ) : null}
    </Container>
    <MutationModal
      show={isVisible.show}
      stage={isVisible.type}
      onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}
      onPressMutate={() => {
        alumnsAndGrades.length ? handleSubmitGrades() : setIsVisible({show: true, type: 'error'})
        }
      }
      onPressError={() => setIsVisible({show: false, type: 'error'})}
      onPressSuccess={async() => {setIsVisible({show: false, type: 'success'}); handleReload()}} //await refetchAxis()}}
      content={{
        confirmationTopText: `Gostaria de enviar as notas?`,
        errorDescription: ' Não foi possível enviar as notas. Verifique todos os dados inseridos e tente novamente. Se o erro persistir, fale com a administração.',
        successDescription: 'Novas notas enviadas com sucesso!',
      }}
      loading={loadingSubmitGrades}
      children={
        <GradesCard
          axis={axis}
          alumnsAndGrades={alumnsAndGrades} 
          />
      }
  />
  </>
  );
};

export default SubmitGradesCard;
