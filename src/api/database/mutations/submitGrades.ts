import { gql } from "@apollo/client";

export const SUBMIT_GRADES = gql`
  mutation SubmitGrades($gradesInput: GradesInput!) {
    submitGrades(gradesInput: $gradesInput) {
      ... on GradesPayload {
          success
          errors {
        ... on Error {
          message
        }
      }
      }
    }
  }
`;

export interface GradesPayload {
  submitGrades: {
      success: boolean
      errors?: string
  };
}

export interface GradesInput {
  gradesInput: {
    alumnsIds: string[];
    axisId: string;
    grades: string[]
  };
}
