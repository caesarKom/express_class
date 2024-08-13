import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Service } from 'typedi';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import { authConfig } from '../../config';
import { deviceDetector } from '../../utils/device.detector';
import db from '../../db/db';

interface DecodedToken {
  id: number;
  role: string;
}

@Service()
export class AuthCheck implements ExpressMiddlewareInterface {
  use(req: any, res: Response, next: NextFunction) {
  
   let detectResult = deviceDetector(req)
   let token;
   
   if (detectResult === "desktop") {
      token = req.cookies.token;
   }
   const authorizationToken = req.headers.authorization;
   token = authorizationToken?.split("Bearer ")[1];
   

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decodedToken = jwt.verify(token, authConfig.secret) as DecodedToken;

      req.user = { id: decodedToken.id, role: decodedToken.role };
      next();
    } catch (error) {
      return res.status(400).json({ message: 'Invalid token.' });
    }
  }
}

export const isAuthKey = async (req:Request, res:Response, next:NextFunction) => {
  try {
    let apiKey = req.header("x-api-key")
    let account = await db.user.findFirst({ where: {apiKey}})
    if (!account) return res.status(403).json({ error: "unauthorized access!" });
    if (account.apiKey !== apiKey) return res.status(403).json({ error: "unauthorized access!" });
    
    //console.log("Good API call", account.apiKey);
    
    return next()
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
}
