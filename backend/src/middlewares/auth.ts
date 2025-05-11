import { NextFunction, Request, Response } from "express";
import privy from "../config/privy";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let authToken = req.cookies['privy-token'];

        // Check Authorization header if cookie is not present
        if (!authToken && req.headers.authorization) {
            const [type, token] = req.headers.authorization.split(' ');
            if (type === 'Bearer') {
                authToken = token;
            }
        }

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

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
}