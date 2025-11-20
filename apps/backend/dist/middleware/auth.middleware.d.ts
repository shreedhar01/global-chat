import type { NextFunction, Request, Response } from "express";
import type mongoose from "mongoose";
declare global {
    namespace Express {
        interface Request {
            user?: {
                _id?: mongoose.Types.ObjectId;
                username?: string;
                email?: string;
            };
        }
    }
}
export declare const authorization: () => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.middleware.d.ts.map