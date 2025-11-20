import type mongoose from "mongoose";
export interface IPlayload {
    _id: mongoose.Types.ObjectId;
    username: string;
}
export interface IJwtPlayload extends IPlayload {
    exp: number;
    iat: number;
}
export declare const jwtSigh: (token: IPlayload) => Promise<string>;
export declare const jwtVerify: (token: string) => Promise<IJwtPlayload>;
//# sourceMappingURL=jwt.d.ts.map