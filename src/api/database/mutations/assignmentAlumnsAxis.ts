import { IAxis, IError } from "../../../types";
import { gql } from "@apollo/client";

export const ASSIGN_ALUMN_TO_AXIS = gql`
  mutation AssignAlumns($assignmentInput: AssignAlumnsInput!) {
    assignmentAlumnsAxis(assignmentAlumnsAxisInput: $assignmentInput) {
      ... on AssignmentPayload {
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


export const UNASSIGN_ALUMN_FROM_AXIS = gql`
  mutation UnassignAlumns($assignmentInput: AssignAlumnsInput!) {
    assignmentAlumnsAxis(assignmentAlumnsAxisInput: $assignmentInput) {
      ... on AssignmentPayload {
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

export interface AssignmentAlumnsAxisPayload {
  assignmentAlumnsAxis: {
      success: boolean
      errors: IError
  }
}

export interface AssignmentAlumnsAxisInput {
  assignmentInput: {
    axisId: string;
    alumnsIds?: string[]
    removeAlumnsIds?: string[]
  };
}
