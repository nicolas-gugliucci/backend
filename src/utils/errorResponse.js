export const errors = (res, result, pid, cid, code) => {
    switch (result) {
        case -1:
            res.status(400).send({
                status: "Error",
                error: "Too many arguments",
                message: 'Only one object is expected'
            })
            break;
        case -2:
            res.status(400).send({
                status: "Error",
                error: "Invalid structure",
                message: 'You are giving a property that is not included in following list:\n-Title\n-Description\n-Code\n-Price\n-Stock\n-Category\n-Status\n-Thumbnails'
            })
            break;
        case -3:
            res.status(400).send({
                status: "Error",
                error: "Invalid structure",
                message: 'All parameters must include relevant information'
            })
            break;
        case -4:
            res.status(404).send({
                status: "Error",
                error: "Not found",
                message: `There is no product with ID "${pid}"`
            })
            break;
        case -5:
            res.status(400).send({
                status: "Error",
                error: "Invalid type",
                message: 'Some of the folowing camps are not in string format: \n-Title\n-Description\n-Category'
            })
            break;
        case -6:
            res.status(400).send({
                status: "Error",
                error: "Invalid type",
                message: 'The camp "Thumbnails" must be in array format'
            })
            break;
        case -7:
            res.status(400).send({
                status: "Error",
                error: "Repeted code",
                message: `The code "${code}" has already been used`
            })
            break;
        case -8:
            res.status(400).send({
                status: "Error",
                error: "invalid query",
                message: `The "limit" query is not a number`
            })
            break;
        case -9:
            res.status(400).send({
                status: "Error",
                error: "Invalid structure",
                message: 'You must update at least one property'
            })
            break;
        case -10:
            res.status(404).send({
                status: "Error",
                error: "Not found",
                message: `There is no cart with ID ${cid}`
            })
            break;
        case -11:
            res.status(400).send({
                status: "Error",
                error: "Invalid structure",
                message: `You are trying to update an invalid property or one with an invalid value`
            })
            break;
        case -12:
            res.status(404).send({
                status: "Error",
                error: "Not found",
                message: `There is no product with ID ${pid} in the cart ${cid}`
            })
            break;
        case -13:
            res.status(400).send({
                status: "Error",
                error: "Unnecessary action",
                message: `The cart ${cid} was already empty`
            })
            break;
        case -14:
            res.status(404).send({
                status: "Error",
                error: "Not found",
                message: `Cart ID or product ID is wrong`
            })
            break;
        case -15:
            res.status(400).send({
                status: "Error",
                error: "Invalid structure",
                message: `Make sure you have all the necessary camps in your request`
            })
            break;
        default:
            const { error, message } = result
            res.status(400).send({
                status: "Error",
                error: error,
                message: message
            })
            break;
    }
}