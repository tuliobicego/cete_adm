import { IAlumn } from './index'

export type IPayment = {
    _id: string
    date: string
    type: string
    alumn?: IAlumn
    value: string
    description: string
    category?: string
    status: string
}