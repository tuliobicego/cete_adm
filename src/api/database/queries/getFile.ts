import { gql } from "@apollo/client";

export const GET_FILE = gql`
  query GetFile($fileId: String) {
    downloadFile(fileId: $fileId)  }
`