class SystemError extends Error {
    constructor(message) {
        super(message)
        this.name = 'SystemError'
        this.status = 500
    }
}

class AuthenticationError extends SystemError {
    constructor(message) {
        super(message)
        this.name = 'AuthenticationError'
        this.status = 401
    }
}

class AuthorizationError extends SystemError {
    constructor(message = 'You do not have the necessary permissions to access this feature') {
        super(message)
        this.name = 'AuthorizationError'
        this.status = 403
    }
}

class ValidationError extends SystemError {
    constructor(message) {
        super(message)
        this.name = 'ValidationError'
        this.status = 400
    }
}

class InvalidRequestError extends Error {
    constructor(message) {
        super(message)
        this.name = 'InvalidRequestError'
        this.status = 400
    }
}

class InvalidStateError extends SystemError {
    constructor(message) {
        super(message)
        this.name = 'InvalidStateError'
        this.status = 422
    }
}

class NotFoundError extends SystemError {
    constructor(message) {
        super(message)
        this.name = 'NotFoundError'
        this.status = 404
    }
}

module.exports = {
    AuthenticationError,
    AuthorizationError,
    InvalidRequestError,
    InvalidStateError,
    NotFoundError,
    SystemError,
    ValidationError,
}
