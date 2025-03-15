import { IAlumn, IAxis, IProfessor} from './index'

export type ILesson = {
    _id: string
    name: string
    date: string
    period: string
    location?: string
    axis?: IAxis
    professor?: IProfessor
    alumns?: [IAlumn]
    status: string
}