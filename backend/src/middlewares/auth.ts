import { NextFunction, Request, Response } from "express";
import privy from "../config/privy";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authToken = req.cookies['privy-token'];

        // console.log("authToken", authToken);
        if (!authToken) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const result = await privy.verifyAuthToken(authToken);
        
        const user = await privy.getUserById(result.userId);

        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // console.log("user", user);

        req.user = user;

        next();
    } catch (error) {
        // console.log("error in auth middleware", error);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
}