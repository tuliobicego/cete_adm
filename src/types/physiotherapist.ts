import { IPhoto } from "./photo"
import { ITeam } from "./team"

export type IPhysiotherapist = {
    id: string
    name: string
    crefito: string
    email: string
    period: 'morning' | 'evening'
    phoneNumber: string
    photo: IPhoto
    role: 'supervisor' | 'undergrad' | 'intern'
    teams: [ITeam]
    status: 'active' | 'inactive'
}