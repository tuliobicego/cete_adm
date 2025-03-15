import { IAxis } from "../../../types";
import { gql } from "@apollo/client";

export const GET_AXIS_BY_ID = gql`
  query GetAxis($axisId: String!) {
    axis(axisId: $axisId) {
      ... on AxisPayload {
        axis {
          ... on Axis {
            _id
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
            lessons {
              _id
              name
              date
              period
              status
            }
            alumns {
              _id
              name
              cpf
              enrollmentDate
              grades
              status
            }
          }
        }
      }
    }
  }
`;

export const GET_AXIS = gql`
  query GetAxiss($status: String) {
    axiss(status: $status)  {
      ... on AxisPayload {
        axiss {
          ... on Axis {
            _id
            type
            dateStart
            dateEnd
            professor {
              _id
              name
              email
              phoneNumber
              status
            }
            status
          }
          lessons {
            _id
            name
            date
            period
            status
          }
          alumns {
            _id
            name
            cpf
            status
            axis {
              _id
              dateStart
              dateEnd
              type
              status
            }
          }
        }
      }
    }
  }
`;

export interface AxisPayload {
  axis: {
    axis: IAxis;
  };
  axiss: {
    axiss: [IAxis];
  };
}


export interface AxisInput {
  axisId?: string;
  status?: string
}
