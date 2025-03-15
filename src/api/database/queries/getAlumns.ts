import { IError } from "../../../types";
import { IAlumn } from "../../../types/alumn";
import { gql } from "@apollo/client";

export const GET_ALUMNS = gql`
  query GetAlumns($type: String) {
    alumns(type: $type) {
      ... on AlumnPayload {
        alumns {
          ... on Alumn {
            _id
            name
            type
            cpf
            birthDate
            email
            phoneNumber
            enrollmentDate
            axis {
              _id
              type
              dateStart
              dateEnd
              status
            }
            payments {
              _id
              date
              type
              category
              value
              status
            }
            status
            
          }
        }
      }
    }
  }
`;

export interface AlumnsPayload {
  alumns: {
    alumns: IAlumn[];
    errors: IError
    deleted: Boolean
  };
}


export interface AlumnsInput {
  type: string;
}