import express, { Express } from 'express';
import cors from 'cors';
import { inject, singleton } from 'tsyringe';
import { Server as HttpServer } from 'http';
import { DI_EXPRESS_PORT } from '../di';
import RoomService from '../services/roomService';

@singleton()
class Server {
    public readonly app: Express;
    public readonly httpServer: HttpServer;

    constructor(
        @inject(DI_EXPRESS_PORT)
        public readonly port: number,
        private readonly roomService: RoomService
    ) {
        this.app = express();
        this.app.use(cors());
        this.registerRoutes();
        this.httpServer = this.app.listen(
            {
                port: this.port,
            },
            () => console.log(`> 🚀 Listening on port ${this.port}`)
        );
    }
    private registerRoutes() {
        this.app.get('/', (req, res) => res.send('GAAAAME!'));
        this.app.get('/create-room', (req, res) => {
            const room = this.roomService.createRoom();

            res.send({ roomId: room.id });
            console.info(`${room.id} | Room created`);
        });
    }
}

export default Server;
