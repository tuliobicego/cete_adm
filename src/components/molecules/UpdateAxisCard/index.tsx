import React, {useState} from 'react'
import { Container } from './styles'
import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_AXIS, UpdateAxisInput, UpdateAxisPayload } from '../../../api/database/mutations/updateAxis'
import Loading from '../../atoms/Loading'
import { IAxis, IProfessor } from '../../../types'
import Select from '../../atoms/Select'
import Button from '../../atoms/Button'
import { GET_PROFESSORS, ProfessorsInput, ProfessorsPayload } from '../../../api/database/queries/getProfessors'
import NoData from '../../atoms/NoData'
import { axisErrorMap } from '../../../utils/maps/error'
interface UpdateAxisCardProps {
  axis: IAxis
}
const UpdateAxisCard: React.FC<UpdateAxisCardProps> = ({ axis }) => {
  //const [dateEnd, setDateEnd] = useState<string>(axis.dateEnd)
  //const [type, setType] = useState<string>(axis.type)
  //const [dateStart, setDateStart] = useState<string>(axis.dateStart)
  
  /*const [status, setStatus] = useState
    <{key: string, value: string}>
    ({key: axis.status, value: axisStatusMap[axis.status]})*/

  const [professorId, setProfessorId] = useState<string | undefined>(axis.professor?._id);
  const [professorValues, setProfessorValues] = useState<{ key: string; value: string }[]>([{ key: "", value: "Escolha um professor cadastrado" }]);


  const { loading: loadingProfessors } = useQuery<ProfessorsPayload, ProfessorsInput>(GET_PROFESSORS, {
    variables: {status: 'leader'},
    onCompleted: (data) => {
      if (data.professors.professors) {
        setProfessorValues(
          professorValues.concat(
            data.professors.professors.filter((professor): professor is IProfessor => professor._id !== axis.professor?._id).map((professor) => {
              return { key: professor._id, value: professor.name };
            })
          )
        );
      }
    },
    onError: (error) => {
      //setErrorDescription( axisErrorMap[error.message])
      //setIsVisible({show: true, type: 'error'})
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
  });

  const [updateAxis, {loading: loadingCreateAxis}] = useMutation
  <UpdateAxisPayload, UpdateAxisInput>(
    UPDATE_AXIS,
    {
      onCompleted: data => {
        console.log(data.updateAxis.axis)
      },
      onError: error => {
        console.log(JSON.stringify(error, null, 2))
      }
    }
  )

  
  /*const setAxisStatus = (key: string) => {
    
    setStatus({key, value: axisStatusMap[key] })
  }*/
  return (
    <Container>
      {!loadingCreateAxis ? <>
        <h3>Alteração de dados da turma</h3>
       
        <h2 key="professorLabel" style={{ marginTop: "2%" }}> Professor responsável </h2>
          {loadingProfessors ? (
            <Loading />
          ) : (
            <>
              
              {professorValues ? (
                <Select
                  key="professors"
                  options={professorValues}
                  onSelect={setProfessorId}
                />
              ) : <NoData/>}
            </>
          )}
        {professorId !== axis.professor?._id ? <Button key={`add_axis_button`} name={`add_axis_button`} onPress={() => updateAxis(
          { variables:
            { updateAxisInput: { axisId: axis._id, professorId } }
          })}
            text='Atualizar turma'
          /> : null}
        </>: <Loading/>}
    </Container>
  )
}

export default UpdateAxisCard

/*
 <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setDateStart(e.currentTarget.value)
          }}
          key={'dateStart_axis'}
          name={'dateStart'}
          label={'Data de início'}
          placeholder={axis.dateStart}
          autoComplete={'false'} 
        />
        <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setDateEnd(e.currentTarget.value)
          }}
          key={'dateEnd_axis'}
          name={'dateEnd'}
          label='Data do fim'
          placeholder={axis.dateEnd}
          autoComplete={'false'}
        />
        <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setType(e.currentTarget.value)
          }}
          key='type_axis'
          name={'type'}
          label='Tipo'
          placeholder={axis.type}
          autoComplete={'false'}
        /> 
        
        <h3 style={{marginTop: '10px'}}>Situação</h3>
        <Select
          onSelect={setAxisStatus}
          options={axis.status === 'active' ?
            [{key: 'active', value: 'Ativo'}, {key: 'inactive', value: 'Inativo'}]
            : [{key: 'inactive', value: 'Inativo'}, {key: 'active', value: 'Ativo'}]
          }
        />
        */