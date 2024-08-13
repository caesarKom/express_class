import { Request } from 'express';
import DeviceDetector from 'node-device-detector';
import ClientHints from 'node-device-detector/client-hints';

const deviceDetector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});
const clientHints = new ClientHints;

export const hasBotResult = (result: any) => {
  return result && result.name;
}

export const middlewareDetect = (req: any, res: any, next: any) => {
  const useragent = req.headers['user-agent']; 
  // @ts-ignore
  const clientHintsData = clientHints.parse(req.headers);

  req.useragent = useragent;
  req.device = deviceDetector.detect(useragent, clientHintsData);
  req.bot = deviceDetector.parseBot(useragent);
  next();
};


// declare global {
//   namespace Express {
//     interface Request {
//       device: {
//         [key: string]: any;
//       };
//     }
//   }
// }

// export const deviceDetector = (req: Request) => {
//     const deviceDetector = new DeviceDetector({
//         clientIndexes: true,
//         deviceIndexes: true,
//         deviceAliasCode: false,
//       });
//       const clientHints = new ClientHints;
//       const useragent = req.headers['user-agent']!; 
//     //@ts-ignore
//   const clientHintsData = clientHints.parse(req.headers);

//   req.device = deviceDetector.detect(useragent, clientHintsData);
  
//    let detectResult = req.device;

//    return detectResult.device.type //desktop
// }