import { IAthlet } from './athlet'
import { IPhoto } from "./photo"
import {IPhysiotherapist} from './physiotherapist'

export type IAvaliation = {
    date: string
    athlet: IAthlet
    physiotherapist: IPhysiotherapist
    anamnesis: string
    inspection: string
    physicEvaluation: string
    photos?: [IPhoto]
    location: 'COTP' | 'CETE'
    imageExamsObservations: string
    expectations: string
    terapeuticPlan: ITerapeuticPlan
    observations: string
    //...
}

export type ITerapeuticPlan = {
    alterations: string
    objectives: string
    prescription: string
}

///  OMBRO

// Discinese escapular
// Arco doloroso
// Avaliação físico
// Função muscular dinamometria
// Função muscular resistencia manual
// Amplitude de movimento imagem
// Amplitude de movimento gonimetria
// Testes específicos SIS
// Testes específicos Instabilidade
// Outros testes
// SPADI
// WOSI


/// COLUNA

// Roland Morris
// Oswestry
// START

/// Joelho

// LCA
// ACL-RSI
// IKDC
// Amplitude de movimento
// Função muscular isométrica
// Hop test
// KUJALA
// VISA P

/// Tornozelo

// FAOS
// SAFAS

/// Quadril
// HAGOS

/// Geral

// Inspeção
// Avaliação física
// Cinesiofobia (TAMPA)
// NPRS
