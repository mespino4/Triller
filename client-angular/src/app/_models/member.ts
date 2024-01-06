import { Bookmark } from "./bookmark"
import { Trill } from "./trill"

export interface Member {
  id: number
  username: string
  photoUrl: string
  age: number
  displayname: string
  lastActive: string
  gender: string
  about: string
  location: string
  profilePic: string
  bannerPic: string
  //trills: Trill[]
  //bookmarks: Bookmark[]
  //roles: string[]
  trillCount: number
  followerCount: number
  followingCount: number
}