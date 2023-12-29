export interface Reply {
    id: number;
    authorId: number;
    content: string;
    photo: any;
    timestamp: string;
    parentTrillId: number;
    likes: number;
    dislikes: number;
}