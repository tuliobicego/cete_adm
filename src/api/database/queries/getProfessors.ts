import { IProfessor } from "../../../types";
import { gql } from "@apollo/client";

export const GET_PROFESSORS = gql`
  query GetProfessors($status: String) {
    professors(status: $status) {
      ... on ProfessorPayload {
        professors {
          ... on Professor {
            _id
            name
            email
            status
            phoneNumber
          }
        }
      }
    }
  }
`;

export interface ProfessorsPayload {
  professors: {
    professors: IProfessor[];
  };
}

export interface ProfessorsInput {
  status?: string;
}
