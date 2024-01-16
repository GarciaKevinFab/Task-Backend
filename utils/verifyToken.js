import jwt from "jsonwebtoken";

const verifytoken = (req, res, next) => {
    console.log("Token received: ", req.cookies.accessToken); // Agregar esto

    const token = req.cookies.accessToken

    if (!token) {
        return res.status(401).json({ success: false, message: "You're not authotize" })
    }

    //if token is exist then verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {

        if (err) {
            return res.status(401).json({ success: false, message: "toiken is invalid" });
        }

        req.user = user;
        next();
    });
};

export const verifyUser = (req, res, next) => {
    verifytoken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({ success: false, message: "You're not authenticated" });
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifytoken(req, res, next, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({ success: false, message: "You're not authorize" });
        }
    });
};