import { IError } from "../../../types";
import { IAlumn } from "../../../types/alumn";
import { gql } from "@apollo/client";

export const CREATE_ALUMN = gql`
  mutation createAlumn($alumnInput: AlumnInput!, $diplomaFile: Upload!, $residenceFile: Upload! , $documentFile: Upload! ) {
    createAlumn(alumnInput: $alumnInput, diplomaFile: $diplomaFile, residenceFile: $residenceFile, documentFile: $documentFile) {
      ... on AlumnPayload {
        alumn {
          ... on Alumn {
            _id
            name
            email
            cpf
            type
            status
            axis {
              type
              dateStart
              dateEnd
              status
            }
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

export interface NewAlumnPayload {
  createAlumn: {
    alumn: IAlumn;
    errors: IError
  };
}

export interface NewAlumnInput {
  alumnInput: {
    enrollementId?: string
    name: string;
    email: string;
    cpf: string;
    enrollmentDate: string
    phoneNumber: string;
    axisId?: string;
    birthDate: string;
    type: string;
    street: string;
    cep: string;
    city: string;
    diplomaYear: string
    diplomaUniversity: string
    documentNumber: string
    documentExpeditor: string
    paymentDate?: string
    paymentValue?: string
  };
  diplomaFile: File
  residenceFile: File
  documentFile: File
}
