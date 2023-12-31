export interface Notification{
    id: number
    userId: number
    userUsername: string
    memberId: number
    memberUsername: string
    type: string
    trillId?: number
    timestamp: string
}