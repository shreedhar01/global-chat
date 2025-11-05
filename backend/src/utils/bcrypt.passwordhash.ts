import bcrypt from "bcrypt"

export const bcryptHashPassword = async function (password:string){
    return await bcrypt.hash(password,10)
}

export const bcryptComparePassword = async function (password:string,hash:string) {
    return await bcrypt.compare(password,hash)
}