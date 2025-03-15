import { IAxis, IError } from "../../../types";
import { gql } from "@apollo/client";

export const CREATE_AXIS = gql`
  mutation CreateAxis($axisInput: AxisInput!) {
    createAxis(axisInput: $axisInput) {
      ... on AxisPayload {
        axis {
          ... on Axis {
            type
            dateStart
            dateEnd
            status
            professor {
              _id
              name
              email
              phoneNumber
              status
            }
            alumns {
              _id
              name
              email
              cpf
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

export interface NewAxisPayload {
  createAxis: {
    axis: IAxis;
    errors: IError
  };
}

export interface NewAxisInput {
  axisInput: {
    type: string;
    dateStart: string | string[];
    dateEnd: string | string[];
    professorId: string
    alumnsIds?: string[]
  };
}
