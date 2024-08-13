import 'reflect-metadata';
import express, { Application, Request, Response } from "express";
import helmet from 'helmet';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { useExpressServer, useContainer as routingControllersUseContainer } from 'routing-controllers';
import { appConfig } from './config';
import Container from 'typedi';

const app: Application = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(
    path.join(__dirname, '..', 'public'),
));

routingControllersUseContainer(Container);

useExpressServer(app, {
    cors: true,
    defaultErrorHandler: true,
    validation: {
        stopAtFirstError: true,
        whitelist: true,
        forbidNonWhitelisted: true
    },
    classTransformer: true,
    routePrefix: appConfig.routePrefix,
    controllers: [path.join(__dirname + appConfig.controllersDir)],
    middlewares: [path.join(__dirname + appConfig.middlewaresDir)],
})

app.get('/', (req: Request, res: Response) => {
    return res.status(200).send('Welcome to itreact.eu');
  });

export default app;