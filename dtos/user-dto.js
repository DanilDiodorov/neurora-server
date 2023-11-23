module.exports = class UserDto {
    id
    email
    tokens
    role
    verified
    createdAt

    constructor(model) {
        this.id = model.id
        this.email = model.email
        this.tokens = model.tokens
        this.role = model.role
        this.verified = model.verified
        this.createdAt = model.createdat
    }
}
