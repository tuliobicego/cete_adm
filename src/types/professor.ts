import { IAxis } from "./axis"
import { ILesson } from "./lesson"

export type IProfessor = {
    _id: string
    name: string
    email: string
    phoneNumber: string
    axis?: IAxis[]
    lessons?: ILesson[]
    status: string
}