export function checkUserRole(role) {
    return (req, res, next) => {

        const userRole = req.user ? req.user.role : req.session.role;
        const userStatus = req.user ? req.user.isPremium : req.session.isPremium;

        if (userRole === role || userStatus === true) {
            next();
        } else {
            res.status(403).json({ message: 'Acceso denegado. Solo usuarios premium o administradores pueden acceder a esta función.' });
        }
    };
}