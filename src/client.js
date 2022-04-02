import axios from 'axios';
import { Transform, Writable } from 'stream';

const url = 'http://localhost:3000';

async function consume() {
  console.time();
  const response = await axios({
    url,
    method: 'get',
    responseType: 'stream',
  });
  return response.data;
}

const stream = await consume();

stream
  .pipe(
    new Transform({
      transform(chunk, enc, cb) {
        const item = JSON.parse(chunk);
        const myN = /\d+/.exec(item.name)[0];
        let name = item.name;

        myN % 2 === 0
          ? (name = name.concat(' é par'))
          : name.concat(' é ímpar');

        cb(null, JSON.stringify(item));
      },
    }),
  )
  .pipe(
    new Transform({
      transform(chunk, enc, cb) {
        cb(null, chunk.toString().toUpperCase());
      },
    }),
  )
  .pipe(
    new Writable({
      write(chunk, enc, cb) {
        console.log('Aqui: ', chunk.toString());
        cb();
      },
    }),
    console.timeEnd()
  );
