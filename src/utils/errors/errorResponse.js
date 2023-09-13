import customError from "./customError.js";
import EnumErrors from "./errorEnum.js";

export const errors = (res, result, pid, cid, code) => {
    switch (result) {
        case -1:
            customError.createError({
                name: "Too many arguments",
                cause: 'More than one object was given',
                message: 'Only one object is expected',
                code: EnumErrors.TOO_MANY_ARGUMENTS_ERROR,
            })
            // res.status(400).send({
            //     status: "Error",
            //     error: "Too many arguments",
            //     message: 'Only one object is expected'
            // })
            break;
        case -2:
            customError.createError({
                name: "Invalid structure",
                cause: 'You are giving a property that is not included in following list:\n-Title\n-Description\n-Code\n-Price\n-Stock\n-Category\n-Status\n-Thumbnails',
                message: 'Your data structure must not contain extra information',
                code: EnumErrors.INVALID_STRUCTURE_ERROR,
            })
            // res.status(400).send({
            //     status: "Error",
            //     error: "Invalid structure",
            //     message: 'You are giving a property that is not included in following list:\n-Title\n-Description\n-Code\n-Price\n-Stock\n-Category\n-Status\n-Thumbnails'
            // })
            break;
        case -3:
            customError.createError({
                name: "Invalid structure",
                cause: 'One or more of your data is either void or undefined',
                message: 'All parameters must include relevant information',
                code: EnumErrors.INVALID_STRUCTURE_ERROR,
            })
            // res.status(400).send({
            //     status: "Error",
            //     error: "Invalid structure",
            //     message: 'All parameters must include relevant information'
            // })
            break;
        case -4:
            customError.createError({
                name: "Not found",
                cause: `There is no product with ID "${pid}"`,
                message: 'Invalid ID',
                code: EnumErrors.NOT_FOUND_ERROR,
            })
            // res.status(404).send({
            //     status: "Error",
            //     error: "Not found",
            //     message: `There is no product with ID "${pid}"`
            // })
            break;
        case -5:
            customError.createError({
                name: "Invalid type",
                cause: 'Some of the folowing camps are not in string format: \n-Title\n-Description\n-Category',
                message: 'Your data type is not correct',
                code: EnumErrors.INVALID_TYPE_ERROR,
            })
            // res.status(400).send({
            //     status: "Error",
            //     error: "Invalid type",
            //     message: 'Some of the folowing camps are not in string format: \n-Title\n-Description\n-Category'
            // })
            break;
        case -6:
            customError.createError({
                name: "Invalid type",
                cause: 'The camp "Thumbnails" must be in array format',
                message: 'Your data type is not correct',
                code: EnumErrors.INVALID_TYPE_ERROR,
            })
            // res.status(400).send({
            //     status: "Error",
            //     error: "Invalid type",
            //     message: 'The camp "Thumbnails" must be in array format'
            // })
            break;
        case -7:
            customError.createError({
                name: "Repeted code",
                cause: `The code "${code}" has already been used`,
                message: `The code must be unique`,
                code: EnumErrors.REPETED_CODE_ERROR,
            })
            // res.status(400).send({
            //     status: "Error",
            //     error: "Repeted code",
            //     message: `The code "${code}" has already been used`
            // })
            break;
        case -8:
            customError.createError({
                name: "invalid query",
                cause: 'The "limit" query is not a number',
                message: `"limit" must be a number`,
                code: EnumErrors.INVALID_QUERY_ERROR,
            })
            // res.status(400).send({
            //     status: "Error",
            //     error: "invalid query",
            //     message: `The "limit" query is not a number`
            // })
            break;
        case -9:
            customError.createError({
                name: "Invalid structure",
                cause: 'No information to update',
                message: 'You must update at least one property',
                code: EnumErrors.INVALID_STRUCTURE_ERROR,
            })
            // res.status(400).send({
            //     status: "Error",
            //     error: "Invalid structure",
            //     message: 'You must update at least one property'
            // })
            break;
        case -10:
            customError.createError({
                name: "Not found",
                cause: `There is no cart with ID ${cid}`,
                message: 'Invalid ID',
                code: EnumErrors.NOT_FOUND_ERROR,
            })
            // res.status(404).send({
            //     status: "Error",
            //     error: "Not found",
            //     message: `There is no cart with ID ${cid}`
            // })
            break;
        case -11:
            customError.createError({
                name: "Invalid structure",
                cause: 'You are trying to update an invalid property or one with an invalid value',
                message: 'Your data structure is not correct',
                code: EnumErrors.INVALID_STRUCTURE_ERROR,
            })
            // res.status(400).send({
            //     status: "Error",
            //     error: "Invalid structure",
            //     message: `You are trying to update an invalid property or one with an invalid value`
            // })
            break;
        case -12:
            customError.createError({
                name: "Not found",
                cause: `There is no product with ID ${pid} in the cart ${cid}`,
                message: 'Invalid ID',
                code: EnumErrors.NOT_FOUND_ERROR,
            })
            // res.status(404).send({
            //     status: "Error",
            //     error: "Not found",
            //     message: `There is no product with ID ${pid} in the cart ${cid}`
            // })
            break;
        case -13:
            customError.createError({
                name: "Unnecessary action",
                cause: `The cart ${cid} was already empty`,
                message: 'Try to avoid doing unnecessary actions',
                code: EnumErrors.UNNECESSARY_ACTION_ERROR,
            })
            // res.status(400).send({
            //     status: "Error",
            //     error: "Unnecessary action",
            //     message: `The cart ${cid} was already empty`
            // })
            break;
        case -14:
            customError.createError({
                name: "Not found",
                cause: 'Cart ID or product ID is wrong',
                message: 'Invalid ID',
                code: EnumErrors.NOT_FOUND_ERROR,
            })
            // res.status(404).send({
            //     status: "Error",
            //     error: "Not found",
            //     message: `Cart ID or product ID is wrong`
            // })
            break;
        case -15:
            customError.createError({
                name: "Invalid structure",
                cause: undefined,
                message: 'Make sure you have all the necessary camps in your request',
                code: EnumErrors.INVALID_STRUCTURE_ERROR,
            })
            // res.status(400).send({
            //     status: "Error",
            //     error: "Invalid structure",
            //     message: `Make sure you have all the necessary camps in your request`
            // })
            break;
        // default:
        //     const { error, message } = result
        //     res.status(400).send({
        //         status: "Error",
        //         error: error,
        //         message: message
        //     })
        //     break;
    }
}