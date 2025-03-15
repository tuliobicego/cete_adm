import { IError, ILesson } from "../../../types";
import { gql } from "@apollo/client";

export const GET_LESSON_BY_ID = gql`
  query GetLesson($lessonId: String!) {
    lesson(lessonId: $lessonId) {
      ... on LessonPayload {
        lesson {
          ... on Lesson {
            _id
            date
            period
            name
            location
            status
            alumns {
              _id
              name
              email
              cpf
              enrollmentDate
              type
              status
            }
            professor {
              _id
              name
              email
              phoneNumber
              status
            }
            axis {
              _id
              dateStart
              dateEnd
              type
              status
              alumns {
                _id
                name
                email
                cpf
                enrollmentDate
                type
                status
              }
            }
          }
        }
      }
    }
  }
`;

export interface LessonPayload {
  lesson: {
    lesson: ILesson;
    errors: IError
  };
}

export interface LessonInput {
  lessonId: string;
}
