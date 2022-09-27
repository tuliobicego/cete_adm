import { IAthlet } from './athlet'
import {IPhysiotherapist} from './physiotherapist'
import { ISport } from './sport'

export type ITeam = {
    id: string
    coach: string
    sport: ISport
    sex: 'male' | 'female'
    physiotherapist: IPhysiotherapist
    athlets: [IAthlet]
    weeklyFollowUp: [IWeeklyFollowUp]
}

export type IWeeklyFollowUp = {
    id: string
    date: string
    exposureHours: string
    physiotherapist: IPhysiotherapist
    athlets: [IAthlet]
    description: string
}