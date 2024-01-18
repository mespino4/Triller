export interface User{
    userId: number,
    username: string;
    token: string;
    profilePic?: string;
    bannerPic?: string;
    displayname: string;
    language: string;
    roles: string[];
}