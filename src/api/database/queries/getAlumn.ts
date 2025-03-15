import { IAlumn } from "../../../types/alumn";
import { gql } from "@apollo/client";

export const GET_ALUMN_BY_ID = gql`
  query GetAlumn($alumnId: String) {
    alumn(alumnId: $alumnId) {
      ... on AlumnPayload {
        alumn {
          ... on Alumn {
            _id
            name
            cpf
            type
            email
            enrollmentDate
            status
            grades
            frequences
            residenceFile {
              filename
              _id
              base64
              contentType
            }
            address {
              street
              cep
              city
            }
            phoneNumber
            birthDate
            documentNumber
            documentExpeditor
            documentFile {
              filename
              _id
              base64
              contentType       
            }
            diplomaUniversity
            diplomaYear
            diplomaFile {
              filename
              _id
              base64
              contentType
            }
            payments {
              _id
              value
              date
              description
              type
              status
              alumn {
                _id
                name
                email
                cpf
                status
              }
            }
            axis {
              _id
              dateStart
              dateEnd
              type
              status
              lessons {
                _id
                name
                date
                status
                period
              }
            }
            lessons {
              _id
              name
              date
              status
              period
              professor {
                _id
                name
                email
                status
              }
            }
            
          }
        }
      }
    }
  }
`;

export interface AlumnPayload {
  alumn: {
    alumn: IAlumn;
  };
}

export interface AlumnInput {
  alumnId: string;
}
