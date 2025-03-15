import { IError, ILesson } from "../../../types";
import { gql } from "@apollo/client";

export const CREATE_LESSON = gql`
  mutation CreateLesson($lessonInput: LessonInput!) {
    createLesson(lessonInput: $lessonInput) {
      ... on LessonPayload {
        lesson {
          ... on Lesson {
            _id
            axis {
              type
              dateStart
              dateEnd
              status
            }
            date
            period
            location
            name
            status
            professor {
              _id
              name
              email
              phoneNumber
              status
            }
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
`;

export interface NewLessonPayload {
  createLesson: {
    lesson: ILesson;
    errors: IError
  };
}

export interface NewLessonInput {
  lessonInput: {
    axisId: string;
    name: string;
    date: string;
    location: string;
    period: string;
    status: string;
    professorId: string;
    alumnsIds?: string[]
  };
}
