export type IInstrument = {
    id: string
    name: string // lista de todos
    bodyPart: 'general' | 'back' | 'neck' | 'knee' | 'hip' | 'shoulder' | 'foot' | 'hand' | 'elbow' | 'acl'
    answers: [string]
}