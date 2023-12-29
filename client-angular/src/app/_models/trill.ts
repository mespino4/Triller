import { Member } from "./member"
import { Reply } from "./reply"

export interface Trill{
    id: number
	authorId: number
	author: Member
	content: string
	photo: string
	replies: Reply[]
	timestamp: string
	retrills: number
	likes: number
}