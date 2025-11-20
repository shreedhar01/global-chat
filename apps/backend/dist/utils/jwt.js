import jwt from "jsonwebtoken";
export const jwtSigh = async (token) => {
    return await jwt.sign(token, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};
export const jwtVerify = async (token) => {
    return await jwt.verify(token, process.env.JWT_SECRET);
};
//# sourceMappingURL=jwt.js.map