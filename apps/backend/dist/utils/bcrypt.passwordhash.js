import bcrypt from "bcrypt";
export const bcryptHashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};
export const bcryptComparePassword = async function (password, hash) {
    return await bcrypt.compare(password, hash);
};
//# sourceMappingURL=bcrypt.passwordhash.js.map