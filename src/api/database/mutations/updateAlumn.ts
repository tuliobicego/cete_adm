import { IError } from "../../../types";
import { IAlumn } from "../../../types/alumn";
import { gql } from "@apollo/client";

export const UPDATE_ALUMN = gql`
  mutation UpdateAlumn($alumnInput: UpdateAlumnInput!) {
    updateAlumn(updateAlumnInput: $alumnInput) {
      ... on AlumnPayload {
        alumn {
          ... on Alumn {
            _id
            name
            email
            phoneNumber
            birthDate
            cpf
            type
            status
            address {
              street
              cep
              city
            }
            diplomaYear
            diplomaUniversity
            documentNumber
            documentExpeditor
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

export interface UpdateAlumnPayload {
  updateAlumn: {
    alumn: IAlumn;
    errors: IError
  };
}

export interface UpdateAlumnInput {
  alumnInput: {
    alumnId: string;
    name?: string;
    email?: string;
    cpf?: string;
    birthDate?: string;
    status?: string;
    phoneNumber?: string;
    street?: string;
    cep?: string;
    city?: string;
    diplomaYear?: string
    diplomaUniversity?: string
    documentNumber?: string
    documentExpeditor?: string
  };
}
