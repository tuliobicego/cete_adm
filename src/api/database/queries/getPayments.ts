import { IPayment } from "../../../types";
import { gql } from "@apollo/client";

export const GET_PAYMENTS = gql`
  query GetPayments {
    payments {
      ... on PaymentPayload {
        payments {
          ... on Payment {
            _id
            value
            description
            type
            category
            date
            alumn {
              _id
              name
              email
              cpf
              phoneNumber
              status
            }
            status
          }
        }
      }
    }
  }
`;

export interface PaymentsPayload {
  payments: {
    payments: IPayment[];
  };
}
