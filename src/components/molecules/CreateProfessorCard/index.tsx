import React, { useState } from "react";
import { Container } from "./styles";
import Input from "../../atoms/Input";
import { useMutation } from "@apollo/client";
import {
  NewProfessorInput,
  NewProfessorPayload,
  CREATE_PROFESSOR,
} from "../../../api/database/mutations/createProfessor";
import Loading from "../../atoms/Loading";
import Button from "../../atoms/Button";
import Disclaimer from '../../atoms/Disclaimer'
import MutationModal from "../../templates/MutationModal";
import { isValid } from "../../../utils/verifiers/verifiers";
import ProfessorCard from "../ProfessorCard";
import { removeMask } from "../../../utils/masks/masks";
import { professorErrorMap } from "../../../utils/maps/error";
import { IProfessor } from "../../../types";
import { useNavigate } from "react-router";

interface CreateProfessorCardProps {
  refresh(): void
  setProfessors(professors: IProfessor[]): void
  professors: IProfessor[] | undefined
}

const CreateProfessorCard: React.FC<CreateProfessorCardProps> = ({ refresh, setProfessors, professors }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [newProfessor, setNewProfessor] = useState<IProfessor | undefined>();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [disclaimer, setDisclaimer] = useState<'professorName' | 'emptyEmail' | 'emptyPhone' | 'invalidEmail' |'invalidPhone' | ''>('')
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})

  const navigate = useNavigate();
      
    const handleReload = () => {
      navigate(0); 
    };

  const [createProfessor, { loading: loadingCreateProfessor }] = useMutation<
    NewProfessorPayload,
    NewProfessorInput
  >(CREATE_PROFESSOR, {
    onCompleted: (data) => {
      
      if(data.createProfessor.professor) {
        setIsVisible({show: true, type: 'success'})
        setNewProfessor(data.createProfessor.professor)
        console.log({newProfessor: data.createProfessor.professor})
      }
      else {
        setErrorDescription( professorErrorMap[data.createProfessor.errors.message])
        setIsVisible({show: true, type: 'error'})}     
    },
    onError: (error) => {
      setErrorDescription( professorErrorMap[''])
      setIsVisible({show: true, type: 'error'})
      console.log(JSON.stringify(error, null, 2));
    },
  });


  const handleSubmit = () => {
    console.log(phoneNumber)
    if (name === '') {
      setDisclaimer('professorName')
      return
    }  else {setDisclaimer('')}
    if (email === '') {      
      setDisclaimer('emptyEmail')
      return
    }  else {setDisclaimer('')}
    const rawPhoneNumber = removeMask(phoneNumber, 'phoneNumber')
    console.log(rawPhoneNumber)
    if(!isValid(rawPhoneNumber, "phoneNumber")) {
      setDisclaimer("invalidPhone")
      return
    } else { 
      setPhoneNumber(rawPhoneNumber)
      setDisclaimer('')
    }
    if (phoneNumber === '') {
      setDisclaimer('emptyPhone')
      return
    }  else {setDisclaimer('')}
    if(!isValid(email, "email")) {
      setDisclaimer("invalidEmail")
      return
    }  else {setDisclaimer('')}
    
    setIsVisible({show: true, type: 'confirmation'})
  }

  const handleCreateProfessor = () => {
    createProfessor({
      variables: {
        professorInput: {
          name,
          email,
          phoneNumber
        },
      },
    });
  }

  return (<>
    <Container>
      <h2 key="register"> Cadastro de Professor </h2>
      {!loadingCreateProfessor ? (
        <>
          <Input
            key="name"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              console.log(e.currentTarget.value)
              setName(e.currentTarget.value);
            }}
            label="Nome"
            name={"name"}
            placeholder={"Fulano da Silva Sauro"}
            autoComplete="off"
          />
          <Input
            key="email"
            label="Email"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              console.log(e.currentTarget.value)
              setEmail(e.currentTarget.value);
            }}
            name={"email"}
            placeholder={"usuario@mail.com"}
            autoComplete="off"
          />
          <Input
            key="phoneNumber"
            label="Contato principal"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setPhoneNumber(e.currentTarget.value);
            }}
            maskType="phoneNumber"
            name={"phoneNumber"}
            placeholder={"00000000000"}
            autoComplete="off"
          />
          <Disclaimer disclaimer={disclaimer} />
              <Button
                key={`add_professor_mutation_button`}
                name={`add_professor_mutation_button`}
                onPress={handleSubmit}
                text="Cadastrar professor"
              />
            
        </>
      ) : (
        <Loading />
      )}
    </Container>
    <MutationModal
      show={isVisible.show}
      stage={isVisible.type}
      onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}
      onPressMutate={() => {
        name && email && phoneNumber ? handleCreateProfessor() : setIsVisible({show: true, type: 'error'})
        }
      }
      onPressError={() => setIsVisible({show: false, type: 'error'})}
      onPressSuccess={() => {
          setIsVisible({show: false, type: 'success'})
          const newProfessorList = professors?.length ? [...professors, newProfessor] as IProfessor[] : newProfessor ? [newProfessor] : null
          if(newProfessorList) setProfessors(newProfessorList)
          handleReload()
        }//refresh()}
      }
      content={{
        confirmationTopText: `Gostaria de cadastrar um professor?`,
        errorDescription,
        successDescription: 'Novo professor cadastrado com sucesso!',
      }}
      loading={loadingCreateProfessor}
      children={<ProfessorCard professor={{_id: "newId", name, email, status: "active", phoneNumber }}/>}
    />
  </>
  );
};

export default CreateProfessorCard;
