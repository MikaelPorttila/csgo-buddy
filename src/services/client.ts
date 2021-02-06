import { Socket } from 'net';

export class Client {
  socket: Socket; 
  connectionOpen: boolean;
  
  constructor(
    private port: number,
    private host: string,) {
      this.connectionOpen = false;
      this.socket = new Socket();
      this.socket.addListener('error', () => {
        this.connectionOpen = false;
        console.error(
          'Failed to connect to CSGO.',
          `\nStart CSGO and make sure that you add launch option: -netconport ${this.port}`
        );
      });
    }

    connect(): Socket {
      console.log('Connecting...');
      return this.socket.connect(this.port, this.host, () => {
        this.connectionOpen = true;
        console.log('Connected!');
      });
    }

    send(...messages: string[]): void {
      for(const message of messages) {
        this.socket.write(`${message}\r\n`);
      }
    }

    addListener(handler: (message: string) => void): void {
      this.socket.addListener('data', (data: Buffer) => {
        if(data && handler) {
          const message = data.toString('utf8');
          handler(message);
        }
      });
    }
}