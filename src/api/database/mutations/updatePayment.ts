import { IError, IPayment } from "../../../types";
import { gql } from "@apollo/client";

export const UPDATE_PAYMENT = gql`
  mutation UpdatePayment($updatePaymentInput: UpdatePaymentInput!) {
    updatePayment(updatePaymentInput: $updatePaymentInput) {
      ... on PaymentPayload {
        payment {
          ... on Payment {
            _id
            date
            value
            description
            type
            status
            alumn {
              _id
              name
              cpf
              email
              phoneNumber
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

export interface UpdatePaymentPayload {
  updatePayment: {
    payment: IPayment;
    errors: IError
  };
}

export interface UpdatePaymentInput {
  updatePaymentInput: {
    paymentId: string;
    description?: string
    type?: string;
    value?: string;
    date?: string;
    status?: string;
  };
}
