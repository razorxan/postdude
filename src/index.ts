import dotenv from 'dotenv';
dotenv.config();
import * as http from 'http';
import cors from 'cors';
import express, { NextFunction, Request, Response, Application } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

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
    const body: any = req.body;
    const files: Array<Express.Multer.File> = <Array<Express.Multer.File>>req.files;
    const request = JSON.parse(body.request);
    const token = axios.CancelToken;
    const source = token.source();
    const fd = new FormData();
    files.forEach(file => {
        fd.append(file.fieldname, fs.createReadStream(file.path), file.originalname);
    });
    axios({
        method: request.method.toLowerCase(),
        url: request.uri,
        //headers: { ...request.headers, "User-Agent": 'postdude 0.1', "Content-Type": "multipart/form-data" },
        //headers: { "Content-Type": "multipart/form-data" },
        params: request.params,
        //data: request.body,
        data: fd,
    }).then(response => {
        console.log(response.data);
    });
    res.json({ ...request, files });
});

app.all('/test', upload.any(), (req: Request, res: Response) => {
    console.log(req.method, req.headers, req.query, req.body, req.files);
    res.json('');
});

httpServer.listen(app.get('port'), () => {
    console.log(`listening on port ${app.get('port')}`);
});