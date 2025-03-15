import { IProfessor } from "../../../types";
import { gql } from "@apollo/client";

export const GET_PROFESSOR_BY_ID = gql`
  query GetProfessor($professorId: String) {
    professor(professorId: $professorId) {
      ... on ProfessorPayload {
        professor {
          ... on Professor {
            _id
            name
            email
            phoneNumber
            status
            axis {
              _id
              type
              dateStart
              dateEnd
              status
            }
            lessons {
              _id
              name
              date
              period
              axis {
                _id
                type
                dateStart
                dateEnd
                status
              }
              status
            }
           
          }
        }
      }
    }
  }
`;

export interface ProfessorPayload {
  professor: {
    professor: IProfessor;
  };
}

export interface ProfessorInput {
  professorId: string;
}
