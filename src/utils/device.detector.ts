import DeviceDetector from 'node-device-detector';
import ClientHints from 'node-device-detector/client-hints';

export const deviceDetector = (req: any) => {
    const deviceDetector = new DeviceDetector({
        clientIndexes: true,
        deviceIndexes: true,
        deviceAliasCode: false,
      });
      const clientHints = new ClientHints;
      const useragent = req.headers['user-agent']; 
    //@ts-ignore
  const clientHintsData = clientHints.parse(req.headers);
  req.useragent = useragent;
  req.device = deviceDetector.detect(useragent, clientHintsData);
  
   let detectResult = req.device;

   return detectResult.device.type //desktop
}