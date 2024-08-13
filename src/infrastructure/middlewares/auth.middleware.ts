import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Service } from 'typedi';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import { authConfig } from '../../config';
import DeviceDetector from 'node-device-detector';
import ClientHints from 'node-device-detector/client-hints';
import db from '../../db/db';

declare global {
  namespace Express {
    interface Request {
      user: {
        [key: string]: any;
      };
      device: {
        [key: string]: any;
      };
    }
  }
}

interface DecodedToken {
  id: number;
  role: string;
}

@Service()
export class AuthCheck implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction) {
    const deviceDetector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: false
    });
  
    const clientHints = new ClientHints();
    const useragent = req.headers['user-agent'];
    //@ts-ignore
    const detectResult = deviceDetector.detect(useragent, clientHints.parse(req.headers));

    let token;

    const authorizationToken = req.headers.authorization;
    if (authorizationToken) {
      token = authorizationToken?.split('Bearer ')[1];
    }
    if (
      detectResult.client.type === 'desktop' ||
      detectResult.client.type === 'library'
    ) {
      token = req.cookies.token;
    }

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

export const isAuthKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let apiKey = req.header('x-api-key');
    let account = await db.user.findFirst({ where: { apiKey } });
    if (!account)
      return res.status(403).json({ error: 'unauthorized access!' });
    if (account.apiKey !== apiKey)
      return res.status(403).json({ error: 'unauthorized access!' });

    //console.log("Good API call", account.apiKey);

    return next();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong!' });
  }
};
