
import { createServer, IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';
import { get_balance, get_token, payer, payerAta, store, storeAta } from './solana_test';

const port = 8080;
const web_data_path = 'src/client/web_data';

export function start_server() {
  const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    console.log("request.url = ", request.url);

    // index.html
    if (request.url == '/') {
      response.statusCode = 200;
      send_file_from_folder(web_data_path + '/templates/index.html', response);
    }
    // Route group: libraries
    else if (request.url?.indexOf('/libraries/') == 0) {
      response.statusCode = 200;
      send_file_from_folder(web_data_path + request.url, response);
    }
    // Route group: script
    else if (request.url?.indexOf('/script/') == 0) {
      response.statusCode = 200;
      send_file_from_folder(web_data_path + request.url, response);
    }
    // User
    else if (request.url == '/get_user_address') {
      response.statusCode = 200;
      response.end(JSON.stringify({value: payer.publicKey.toBase58()}));
    }
    else if (request.url == '/get_user_balance') {
      response.statusCode = 200;
      response.end(JSON.stringify({value: await get_balance(payer.publicKey)}));
    }
    else if (request.url == '/get_user_token') {
      response.statusCode = 200;
      response.end(JSON.stringify({value: await get_token(payerAta)}));
    }
    // Program
    else if (request.url == '/get_program_address') {
      response.statusCode = 200;
      response.end(JSON.stringify({value: store.toBase58()}));
    }
    else if (request.url == '/get_program_balance') {
      response.statusCode = 200;
      response.end(JSON.stringify({value: await get_balance(store)}));
    }
    else if (request.url == '/get_program_token') {
      response.statusCode = 200;
      response.end(JSON.stringify({value: await get_token(storeAta)}));
    }
    // Bad Request
    else {
      send_file_from_folder(web_data_path + '/templates/bad_request_404.html', response);
    }
  });

  server.listen(port, () => {
    console.log("Server is running at:", "http://localhost:" + port.toString());
  });
}

function send_file_from_folder(file_path: string, response: ServerResponse) {
  fs.readFile(file_path, (err: NodeJS.ErrnoException | null, data: Buffer) => {
    response.end(data);
  });
}
