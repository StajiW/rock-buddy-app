export class UnexpectedError extends Error {
    name = 'UNEXPECTED_ERROR'
}

export class NetworkError extends Error {
    name = 'NETWORK_ERROR'
}

export class BadResponseError extends Error {
    name = 'BAD_RESPONSE_ERROR'
}

export class InputError extends Error {
    name = 'INPUT_ERROR'
}

export class NotFoundError extends Error {
    name = 'NOT_FOUND_ERROR'
}