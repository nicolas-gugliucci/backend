export const roleAuth = (admited) => {
    return async (req, res, next) => {
        try {
            const role = req.session.user.role;
            if (admited.some((admitedRole) => admitedRole === role)) {
                next();
            } else {
                res.status(403).send('Unauthorized');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };
};