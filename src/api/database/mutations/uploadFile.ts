import { gql } from "@apollo/client";

export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!, $type: String, $entity: String, $entityId: String ) {
    uploadFile(file: $file, type: $type, entity: $entity, entityId: $entityId)
    }
  `
