import {Socket} from 'socket.io';
import {ws} from '../decorators/web-socket.decorators';
import {debug} from "util";

/**
 * A demo controller for websocket
 */
@ws('/u3ih')
export class WebSocketController {
    constructor(
        @ws.socket() // Equivalent to `@inject('ws.socket')`
        private socket: Socket,
    ) {}

    /**
     * The method is invoked when a client connects to the server
     * @param socket
     */
    @ws.connect()
    connect(socket: Socket) {
        console.log('Client connected: %s', this.socket.id);
        socket.join('room 1');
    }

    /**
     * Register a handler for 'chat message' events
     * @param msg
     */
    @ws.subscribe(/.+/)
    // @ws.emit('namespace' | 'requestor' | 'broadcast')
    handleEmitMessage(eventName: string, msg: unknown) {
        console.log('Message: %s', msg);
        this.socket.nsp.emit(eventName, `[${this.socket.id}] ${msg}`);
    }

    /**
     * The method is invoked when a client disconnects from the server
     * @param socket
     */
    @ws.disconnect()
    disconnect() {
        console.log('Client disconnected: %s', this.socket.id);
    }
}
