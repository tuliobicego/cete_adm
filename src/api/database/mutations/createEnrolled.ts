import { IError } from "../../../types";
import { IAlumn } from "../../../types/alumn";
import { gql } from "@apollo/client";

export const CREATE_ENROLLED = gql`
  mutation createEnrolled($enrolledInput: EnrolledInput!) {
    createEnrolled(enrolledInput: $enrolledInput) {
      ... on AlumnPayload {
        alumns {
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

export interface NewEnrolledPayload {
  createEnrolled: {
    alumns: IAlumn[];
    errors: IError
  };
}

export interface NewEnrolled {
    name: string;
    email: string;
    cpf: string;
    enrollmentDate: string
    phoneNumber: string;
    birthDate: string;
    street: string;
    number: string
    complement: string
    cep: string;
    city: string;
    diplomaYear: string
    diplomaUniversity: string
    documentNumber: string
    documentExpeditor: string
}

export interface NewEnrollmentInput {
  enrolledInput: NewEnrolled[];
}
