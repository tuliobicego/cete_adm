import { IAxis, ILesson, IPayment } from './index'

export type IFile = {
  _id?: string
  filename?: string
  contentType?: string
  base64?: string
}

export type IAlumn = {
    _id: string
    name: string
    email: string
    phoneNumber: string
    cpf: string
    birthDate: string
    type?: string
    enrollmentDate?: string
    address?: {
      street?: string,
      cep?: string,
      city?: string,
    }
    lessons?: ILesson[]
    frequences?: string[]
    grades?: string[]
    payments?: IPayment[]
    residenceFile?: IFile
    documentFile?: IFile
    documentNumber?: string
    documentExpeditor?: string
    diplomaFile?: IFile
    diplomaYear?: string
    diplomaUniversity?: string
    status: string
    axis?: [IAxis]
}