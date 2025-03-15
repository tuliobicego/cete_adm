import { IError, IProfessor } from "../../../types";
import { gql } from "@apollo/client";

export const CREATE_PROFESSOR = gql`
  mutation CreateProfessor($professorInput: ProfessorInput!) {
    createProfessor(professorInput: $professorInput) {
      ... on ProfessorPayload {
        professor {
          ... on Professor {
            _id
            name
            email
            phoneNumber
            status
          }
        }
      errors {
        ... on Error {
          message
        }
      }
      }
    }
  }
`;

export interface NewProfessorPayload {
  createProfessor: {
    professor: IProfessor;
    errors: IError
  };
}

export interface NewProfessorInput {
  professorInput: {
    name: string
    email: string
    phoneNumber: string
  };
}
