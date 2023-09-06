export class userDTO {
    constructor(payload){
        this.name = payload.name,
        this.email = payload.email,
        this.role = payload.role
    }
}