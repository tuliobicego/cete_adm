import { IError, IProfessor } from "../../../types";
import { gql } from "@apollo/client";

export const UPDATE_PROFESSOR = gql`
  mutation UpdateProfessor($professorInput: UpdateProfessorInput!) {
    updateProfessor(updateProfessorInput: $professorInput) {
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

export interface ProfessorPayload {
  updateProfessor: {
    professor: IProfessor;
    errors: IError
  };
}

export interface ProfessorInput {
  professorInput: {
    professorId: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    status?: string;
  };
}
