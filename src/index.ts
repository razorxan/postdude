import dotenv from 'dotenv';
dotenv.config();
import * as http from 'http';
import cors from 'cors';
import express, { NextFunction, Request, Response, Application } from 'express';
import multer from 'multer';
import axios from 'axios';


const upload = multer({ dest: 'uploads/' });
const app: Application = express();


app.use(cors());
app.use(express.json(), express.urlencoded({ extended: true }));
app.set("port", process.env.PORT);

const httpServer: http.Server = http.createServer(app);

app.get('/', (req: Request, res: Response) => {
    res.json('ciao');
});


app.post('/request', upload.any(), (req: Request, res: Response) => {
    // validate body
    const body = req.body;
    const files = req.files;
    const request = JSON.parse(body.request);
    res.json({ ...request, files });
});

app.all('/test', upload.any(), (req: Request, res: Response) => {
    console.log(req.headers, req.body, req.query, req.files);
    res.json(req);
});

httpServer.listen(app.get('port'));