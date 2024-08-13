import app from "./app";
import { appConfig } from "./config";

const host = appConfig.host;
const port = appConfig.port;

app.listen(port, () => {
    console.log(`Server started at http://${host}:${port}\n Environment: ${appConfig.node}`)
})