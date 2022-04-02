import { randomUUID } from 'crypto';
import http from 'http';
import { Readable } from 'stream';

function* run() {
  for (let index = 0; index <= 1000; index++) {
    const data = {
      id: randomUUID(),
      name: `Lucas-${index}`,
    };
    yield data;
  }
}

async function handler(request, response) {
  const readable = new Readable({
    read() {
      for(const data of run()) {
        console.log(`sending`, data);
        this.push(JSON.stringify(data) + '\n')
      }
      this.push(null);
    },
  });

  readable.pipe(response);
}

http
  .createServer(handler)
  .listen(3000)
  .on('listening', () => console.log('Server running at 3000'));
