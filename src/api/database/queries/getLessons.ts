import { ILesson } from "../../../types";
import { gql } from "@apollo/client";

export const GET_LESSONS = gql`
  query GetLessons {
    lessons {
      ... on LessonPayload {
        lessons {
          ... on Lesson {
            _id
            name
            date
            location
            period
            status
            alumns {
              _id
              name
              email
              cpf
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
              type
              dateStart
              dateEnd
              status
            }
          }
        }
      }
    }
  }
`;

export interface LessonsPayload {
  lessons: {
    lessons: ILesson[];
  };
}
