import { Socket } from 'net';

export class Client {
  #socket: Socket; 

  constructor(
    private port: number,
    private host: string,) {
      this.#socket = new Socket();
    }

    connect(): Socket {
      console.log('Connecting...');
      return this.#socket.connect(this.port, this.host, () => {
        console.log('Connected!');
      });
    }

    send(message: string): void {
      this.#socket.write(`${message}\r\n`);
    }

    addListener(handler: (message: string) => void): void {
      this.#socket.addListener('data', (data: Buffer) => {
        if(data && handler) {
          const message = data.toString('utf8');
          handler(message);
        }
      });
    }
}