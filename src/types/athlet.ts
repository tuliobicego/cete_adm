import { ITeam, IWeeklyFollowUp } from "./team"
import {IPhysiotherapist} from './physiotherapist'
import { IAvaliation } from "./avaliation"
import { ISingleEvolution } from "./evolution"

export type IAthlet = {
    id: string
    name: string
    birthDate: string
    sex: 'male' | 'female'
    height: string
    weight: string
    origin: 'CETE' | 'COTP' | 'external'
    avaliations: [IAvaliation]
    evolutions: [ISingleEvolution]
    team?: ITeam
    modality: 'athletism' | 'automobilism' | 'badminton' | 'basketball'
    category: string
    role: 'professional' | 'amateur'
    sportRoutine: string
    sportExperience: string
    teamAvaliations: [ITeamAvaliation]
    physiotherapist: IPhysiotherapist
    situation: 'noRestrictions' | 'restrited' | 'stopped'
    injury: [IInjury]
    status: 'active' | 'inactive' | 'interrupted'
}

export type IInjury = {
    medicalDiagnosis: string
    medicalName: string
    bodyPart: 'abdome' | 'upperArm' | 'arm'
    bodyTissue: 'cartilaginous' | 'muscle'
    type: 'artrit' | 'scratch' | 'unknown'
    diagnosis: 'x'
}

export type ITeamAvaliation = {
    date: string
    followUp: IWeeklyFollowUp
    participation: string
    volumeReduction: string
    performanceDecline: string
    injurySymptons: string
    brief: string
    bodyLocationInjury: string
    timeLoss: string
    notification: string
    medicalContact: string
    injuryDescription: string
}