import { IAlumn, ILesson, IProfessor } from './index'

export type IAxis = {
    _id: string
    type: string
    dateStart: string
    dateEnd: string
    professor?: IProfessor
    alumns?: [IAlumn]
    lessons?: [ILesson]
    status: string
}