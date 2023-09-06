export const roleAuth = (admited) => {
    return async (req, res, next) => {
        try {
            const response = await fetch('http://localhost:8080/api/sessions/current', {
                method: 'GET',
                credentials: 'include',
                withCredentials: true
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch current session data');
            }

            const data = await response.json();
            console.log(data)
            const role = data.payload.role;

            if (role === admited) {
                console.log('Authorized');
                next();
            } else {
                console.log('Unauthorized');
                res.status(403).send('Unauthorized');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };
};