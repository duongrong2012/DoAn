import { User } from "./user";

export interface Rating {
    "_id": string,
    "user": User,
    "product": string,
    "comment": string,
    "rating": number,
    "likedUsers": User["_id"][],
    "createdAt": string,
    "updatedAt": string,
}