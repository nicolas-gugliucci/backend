export const expiredLink = () => {
    return async (req, res, next) => {
        try {
            const token = req.query.token;
            if (
                req.session.resetPasswordToken &&
                req.session.resetPasswordToken === token &&
                new Date() < new Date(req.session.resetPasswordExpires)
            ) { next() } 
            else {
                // El token ha expirado o es inválido
                res.redirect('/startresetPassword')
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };
};