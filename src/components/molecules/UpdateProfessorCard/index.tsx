import React, {useState} from 'react'
import { Container } from './styles'
import Input from '../../atoms/Input'
import { useMutation } from '@apollo/client'
import { ProfessorInput, ProfessorPayload, UPDATE_PROFESSOR } from '../../../api/database/mutations/updateProfessor'
import Loading from '../../atoms/Loading'
import { IProfessor } from '../../../types'
import Select from '../../atoms/Select'
import { professorStatusMap } from '../../../utils/maps/status'
import Button from '../../atoms/Button'
import MutationModal from '../../templates/MutationModal'
import { isValid } from '../../../utils/verifiers/verifiers'
import { maskPhone, removeMask } from '../../../utils/masks/masks'
import { professorErrorMap } from '../../../utils/maps/error'
import ProfessorCard from '../ProfessorCard'
import Disclaimer from '../../atoms/Disclaimer'
interface UpdateProfessorCardProps {
  professor: IProfessor
  setProfessor(professors: IProfessor): void
}
const UpdateProfessorCard: React.FC<UpdateProfessorCardProps> = ({ professor, setProfessor }) => {
  const [name, setName] = useState<string>(professor.name)
  const [email, setEmail] = useState<string>(professor.email)
  const [phoneNumber, setPhoneNumber] = useState<string>(professor.phoneNumber)
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [disclaimer, setDisclaimer] = useState<'professorName' | 'emptyEmail' | 'emptyPhone' | 'invalidEmail' |'invalidPhone' | 'noUpdate' | 'noName' | ''>('')
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>
  ({show: false, type: 'confirmation'})
  
  const [status, setStatus] = useState
    <{key: string, value: string}>
    ({key: professor.status, value: professorStatusMap[professor.status]})

  const [updateProfessor, {loading: loadingCreateProfessor}] = useMutation
  <ProfessorPayload, ProfessorInput>(
    UPDATE_PROFESSOR,
    {
      onCompleted: data => {
        setIsVisible({show: true, type: 'success'})
        if(data.updateProfessor.professor) setProfessor(data.updateProfessor.professor)
        else {
          setErrorDescription( professorErrorMap[data.updateProfessor.errors.message])
          setIsVisible({show: true, type: 'error'})}     
      },
      onError: (error) => {
        setErrorDescription( professorErrorMap[error.message])
        setIsVisible({show: true, type: 'error'})
        console.log(JSON.stringify(error, null, 2));
      },
    }
  )
  const setProfessorStatus = (key: string) => {
    
    setStatus({key, value: professorStatusMap[key] })
  }

  


  const handleSubmit = () => {
    if(!name || name === ""  ) {
      setDisclaimer("noName")
      return
    } else { 
      setDisclaimer('')
    }
    if(!phoneNumber || !isValid(phoneNumber, "phoneNumber") ) {
      setDisclaimer("invalidPhone")
      return
    } else { 
      setDisclaimer('')
    }
    if(!email || !isValid(email, "email")) {
      setDisclaimer("invalidEmail")
      return
    }  else {setDisclaimer('')}
    if(email===professor.email && phoneNumber === professor.phoneNumber && name === professor.name && status.key === professor.status) {
      setDisclaimer("noUpdate")
      return
    }  else {setDisclaimer('')}
    
    setIsVisible({show: true, type: 'confirmation'})
  }

  const handleUpdateProfessor = () => {
    updateProfessor({
      variables: {
        professorInput: {
          professorId: professor._id,
          name: name !== professor.name ? name : undefined,
          email: email !== professor.email ? email : undefined,
          phoneNumber: professor.phoneNumber !== removeMask(phoneNumber, 'phoneNumber') ? removeMask(phoneNumber, 'phoneNumber') : undefined,
          status: status.key !== professor.status ? status.key : undefined
        },
      },
    });
  }

  
  return (<>
    <Container>
      <h2>Alteração de dados cadastrais</h2>
      {!loadingCreateProfessor ? (<>
        <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setName(e.currentTarget.value)
            if(e.currentTarget.value && isValid(e.currentTarget.value, 'name')) setDisclaimer('')
          }}
          key={'name_professor'}
          name={'name'}
          label={'Nome'}
          placeholder={professor.name}
          autoComplete={'false'} 
          maskType='name'
          initialValue={professor.name}
        />
        <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setEmail(e.currentTarget.value)
            if(e.currentTarget.value && isValid(e.currentTarget.value, 'email')) setDisclaimer('')
          }}
          key={'email_professor'}
          name={'email'}
          label='E-mail'
          placeholder={professor.email}
          autoComplete={'false'}
          defaultValue={professor.email}
        />
        <Input
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setPhoneNumber(e.currentTarget.value)
            if(e.currentTarget.value && isValid(e.currentTarget.value, 'phoneNumber')) setDisclaimer('')
          }}
          label='Telefone'
          key='phoneNumeber_professor'
          name={'phoneNumber'}
          placeholder={maskPhone(professor.phoneNumber)}
          autoComplete={'false'}
          maskType='phoneNumber'
          initialValue={maskPhone(professor.phoneNumber)}
        />
        <h3 style={{marginTop: '10px'}}>Situação</h3>
        <Select
          onSelect={setProfessorStatus}
          options={professor.status === 'inactive' ?
            [{key: 'inactive', value: 'Inativo'}, {key: 'active', value: 'Ativo'}] :
            [{key: 'active', value: 'Ativo'}, {key: 'inactive', value: 'Inativo'}]
          }
        />
        <Disclaimer disclaimer={disclaimer} />
        {!email && !phoneNumber && !name && status.key === professor.status ? null :
        <Button key={`add_professor_button`} name={`add_professor_button`} onPress={() => handleSubmit()} text='Atualizar professor' />}
        
      </>) : (
        <Loading />
      )}
    </Container>
    <MutationModal
      show={isVisible.show}
      stage={isVisible.type}
      onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}
      onPressMutate={() => {
        name || email || phoneNumber || status.key !== professor.status ? handleUpdateProfessor() : setIsVisible({show: true, type: 'error'})
        }
      }
      onPressError={() => setIsVisible({show: false, type: 'error'})}
      onPressSuccess={() => {
        setIsVisible({show: false, type: 'success'})
        }//refresh()}
      }
      content={{
        confirmationTopText: `Gostaria de alterar as informações do professor?`,
        errorDescription,
        successDescription: 'O professor acaba de ser atualizado!',
      }}
      loading={loadingCreateProfessor}
      children={<ProfessorCard professor={{_id: professor._id, name: name || professor.name, email: email || professor.email, status: status.key, phoneNumber: phoneNumber || professor.phoneNumber }}/>}
    />
  </>
  );
};

export default UpdateProfessorCard