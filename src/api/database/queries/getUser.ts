import { IUser } from "../../../types";
import { gql } from "@apollo/client";

export const GET_USER_BY_ID = gql`
  query GetUser($firebaseUid: String) {
    user(firebaseUid: $firebaseUid) {
      ... on UserPayload {
        user {
          ... on User {
            _id
            email
            role
          }
        }
      }
    }
  }
`;

export interface UserPayload {
  user: {
    user: IUser;
  };
}

export interface UserInput {
  firebaseUid: string;
}
