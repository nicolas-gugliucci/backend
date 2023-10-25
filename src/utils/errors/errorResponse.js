import errorMeddleware from "../../middlewares/errors.js";
import customError from "./customError.js";
import EnumErrors from "./errorEnum.js";

export const errors = (req, res, result, pid, cid, code, email) => {
    switch (result) {
        case -1:
            try {
                customError.createError({
                    name: "Too many arguments",
                    cause: 'More than one object was given',
                    message: 'Only one object is expected',
                    code: EnumErrors.TOO_MANY_ARGUMENTS_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -2:
            try {
                customError.createError({
                    name: "Invalid structure",
                    cause: 'You are giving a property that is not included in following list:\n-Title\n-Description\n-Code\n-Price\n-Stock\n-Category\n-Status\n-Thumbnails',
                    message: 'Your data structure must not contain extra information',
                    code: EnumErrors.INVALID_STRUCTURE_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -3:
            try {
                customError.createError({
                    name: "Invalid structure",
                    cause: 'One or more of your data is either void or undefined',
                    message: 'All parameters must include relevant information',
                    code: EnumErrors.INVALID_STRUCTURE_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -4:
            try {
                customError.createError({
                    name: "Not found",
                    cause: `There is no product with ID "${pid}"`,
                    message: 'Invalid ID',
                    code: EnumErrors.NOT_FOUND_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -5:
            try {
                customError.createError({
                    name: "Invalid type",
                    cause: 'Some of the folowing camps are not in string format: \n-Title\n-Description\n-Category',
                    message: 'Your data type is not correct',
                    code: EnumErrors.INVALID_TYPE_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -6:
            try {
                customError.createError({
                    name: "Invalid type",
                    cause: 'The camp "Thumbnails" must be in array format',
                    message: 'Your data type is not correct',
                    code: EnumErrors.INVALID_TYPE_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -7:
            try {
                customError.createError({
                    name: "Repeted code",
                    cause: `The code "${code}" has already been used`,
                    message: `The code must be unique`,
                    code: EnumErrors.REPETED_CODE_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -8:
            try {
                customError.createError({
                    name: "invalid query",
                    cause: 'The "limit" query is not a number',
                    message: `"limit" must be a number`,
                    code: EnumErrors.INVALID_QUERY_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -9:
            try {
                customError.createError({
                    name: "Invalid structure",
                    cause: 'No information to update',
                    message: 'You must update at least one property',
                    code: EnumErrors.INVALID_STRUCTURE_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -10:
            try {
                customError.createError({
                    name: "Not found",
                    cause: `There is no cart with ID ${cid}`,
                    message: 'Invalid ID',
                    code: EnumErrors.NOT_FOUND_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -11:
            try {
                customError.createError({
                    name: "Invalid structure",
                    cause: 'You are trying to update an invalid property or one with an invalid value',
                    message: 'Your data structure is not correct',
                    code: EnumErrors.INVALID_STRUCTURE_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -12:
            try {
                customError.createError({
                    name: "Not found",
                    cause: `There is no product with ID ${pid} in the cart ${cid}`,
                    message: 'Invalid ID',
                    code: EnumErrors.NOT_FOUND_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -13:
            try {
                customError.createError({
                    name: "Unnecessary action",
                    cause: `The cart ${cid} was already empty`,
                    message: 'Try to avoid doing unnecessary actions',
                    code: EnumErrors.UNNECESSARY_ACTION_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -14:
            try {
                customError.createError({
                    name: "Not found",
                    cause: 'Cart ID or product ID is wrong',
                    message: 'Invalid ID',
                    code: EnumErrors.NOT_FOUND_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -15:
            try {
                customError.createError({
                    name: "Invalid structure",
                    cause: undefined,
                    message: 'Make sure you have all the necessary camps in your request',
                    code: EnumErrors.INVALID_STRUCTURE_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -16:
            try {
                customError.createError({
                    name: "Not found",
                    cause: `There is no user registered with tha email: ${email}`,
                    message: 'Invalid ID',
                    code: EnumErrors.NOT_FOUND_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -17:
            try {
                customError.createError({
                    name: "Unnecessary action",
                    cause: `The password is the same`,
                    message: 'You are trying to change your password with the same password you already have',
                    code: EnumErrors.UNNECESSARY_ACTION_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -18:
            try {
                customError.createError({
                    name: "Unauthorized",
                    cause: `You are trying to delete a product created by another one`,
                    message: 'You can only delete your own products',
                    code: EnumErrors.UNAUTHORIZED_ACTION_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        case -19:
            try {
                customError.createError({
                    name: "Unauthorized",
                    cause: `You are trying to buy a product created by you`,
                    message: 'You can only buy products created by someone else',
                    code: EnumErrors.UNAUTHORIZED_ACTION_ERROR,
                })
            } catch (error) {
                errorMeddleware(error, req, res)
            }
            break;
        default:
            const { error, message } = result
            customError.createError({
                name: error,
                cause: '',
                message: message,
                code: EnumErrors.INVALID_STRUCTURE_ERROR,
            })
            break;
    }
}