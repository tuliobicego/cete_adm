import { IPayment } from "../../../types";
import { gql } from "@apollo/client";

export const GET_PAYMENT_BY_ID = gql`
  query GetPayment($paymentId: String, $alumnId: String) {
    payment(paymentId: $paymentId, alumnId: $alumnId) {
      ... on PaymentPayload {
        payment {
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
              payments {
                _id
                value
                description
                type
                category
                date
                status
              }
            }
            status
           
          }
        }
      }
    }
  }
`;

export interface PaymentPayload {
  payment: {
    payment: IPayment;
  };
}

export interface PaymentInput {
  paymentId: string;
  alumnId: string;
}
