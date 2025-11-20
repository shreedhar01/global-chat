import { Socket } from 'socket.io';
import type mongoose from 'mongoose';
export interface CustomSocket extends Socket {
    userId?: mongoose.Types.ObjectId;
}
//# sourceMappingURL=index.d.ts.map