import { IError, IPayment } from "../../../types";
import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($paymentInput: PaymentInput!) {
    createPayment(paymentInput: $paymentInput) {
      ... on PaymentPayload {
        payment {
          ... on Payment {
            _id
            description
            value
            date
            category
            type
            alumn {
              _id
              name
              email
              phoneNumber
              cpf
              status
            }
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

export interface NewPaymentPayload {
  createPayment: {
    payment: IPayment;
    errors: IError
  };
}

export interface NewPaymentInput {
  paymentInput: {
    date: string
    value: string
    type: string
    alumnId: string
    description: string
    status: string
    category: string
  };
}
