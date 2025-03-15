import { IAxis, IError } from "../../../types";
import { gql } from "@apollo/client";

export const UPDATE_AXIS = gql`
  mutation UpdateAxis($updateAxisInput: UpdateAxisInput!) {
    updateAxis(updateAxisInput: $updateAxisInput) {
      ... on AxisPayload {
        axis {
          ... on Axis {
            _id
            type
            dateStart
            dateEnd
            status
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

export interface UpdateAxisPayload {
  updateAxis: {
    axis: IAxis;
    errors: IError
  };
}

export interface UpdateAxisInput {
  updateAxisInput: {
    axisId: string;
    professorId?: string
    status?: string;
  };
}
