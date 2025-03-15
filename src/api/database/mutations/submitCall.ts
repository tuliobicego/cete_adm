import { gql } from "@apollo/client";
import { IError } from "../../../types";

export const SUBMIT_CALL = gql`
  mutation SubmitCall($callInput: CallInput!) {
    submitCall(callInput: $callInput) {
      ... on CallPayload {
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

export interface CallPayload {
  submitCall: {
      success: boolean
      errors?: IError
  };
}

export interface CallInput {
  callInput: {
    alumnsIds: string[];
    lessonId: string;
  };
}
