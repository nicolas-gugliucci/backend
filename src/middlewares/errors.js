import EnumErrors from '../utils/errors/errorEnum.js'

const errorMeddleware = (error, req, res, next) => {
    console.log(error.cause)
    switch (error.code) {
        case EnumErrors.INVALID_QUERY_ERROR:
            res.send({
                status: "Error",
                error: error.name
            })
            break;
        case EnumErrors.INVALID_STRUCTURE_ERROR:
            res.send({
                status: "Error",
                error: error.name
            })
            break;
        case EnumErrors.INVALID_TYPE_ERROR:
            res.send({
                status: "Error",
                error: error.name
            })
            break;
        case EnumErrors.NOT_FOUND_ERROR:
            res.status(404).send({
                status: "Error",
                error: error.name
            })
            break;
        case EnumErrors.REPETED_CODE_ERROR:
            res.send({
                status: "Error",
                error: error.name
            })
            break;
        case EnumErrors.TOO_MANY_ARGUMENTS_ERROR:
            res.send({
                status: "Error",
                error: error.name
            })
            break;
        case EnumErrors.UNNECESSARY_ACTION_ERROR:
            res.send({
                status: "Error",
                error: error.name
            })
            break;
        default:
            res.send({
                status: "Error",
                error: 'Unhandled error',
            })
            break;
    }
}

export default errorMeddleware