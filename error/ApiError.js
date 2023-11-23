module.exports = class ApiError extends Error {
    status
    errors

    constructor(status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static badRequest(message, errors = []) {
        return new ApiError(404, message, errors)
    }

    static internal(message) {
        return new ApiError(400, message)
    }

    static forbidden(message) {
        return new ApiError(403, 'Нет доступа')
    }

    static authError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }
}
