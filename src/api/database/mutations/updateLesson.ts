import { IError, ILesson } from "../../../types";
import { gql } from "@apollo/client";

export const UPDATE_LESSON = gql`
  mutation UpdateLesson($updateLessonInput: UpdateLessonInput!) {
    updateLesson(updateLessonInput: $updateLessonInput) {
      ... on LessonPayload {
        lesson {
          ... on Lesson {
            _id
            date
            location
            axis {
              dateStart
              dateEnd
              type
              status
            }
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

export interface UpdateLessonPayload {
  updateLesson: {
    lesson: ILesson;
    errors: IError
  };
}

export interface UpdateLessonInput {
  updateLessonInput: {
    lessonId: string
    name?: string
    professorId?: string
    date?: string
    location?: string
    period?: string
    axisId?: string
    status?: string
  };
}
