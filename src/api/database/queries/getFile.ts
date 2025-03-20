import { gql } from "@apollo/client";

export const GET_FILE = gql`
  query GetFile($fileId: String) {
    downloadFile(fileId: $fileId)  }
`

export const GET_FILE_64 = gql`
  query GetFile($fileId: String) {
    downloadFileBase64(fileId: $fileId)  }
`