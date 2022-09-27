import { IAthlet } from "./athlet"
import { IPhysiotherapist } from "./physiotherapist"

export type ISingleEvolution = {
    _id: string
    date: string
    athlet?: IAthlet
    physiotherapist: IPhysiotherapist
    office: 'COTP' | 'CETE'
    type: 'regular' | 'recovery' | 'preventive'
    description: string
}