import request from 'request';
import path from 'path';
import { SwaggerParser, CONTAINER } from './SwaggerParser';
import { TSWriter } from './TSWriter';

const SWAGGER = 'https://www.bitmex.com/api/explorer/swagger.json';

const outputClass = path.resolve(__dirname, '../../src/BitmexAPI.ts');
const outputInterfaces = path.resolve(__dirname, '../../src/BitmexInterfaces.ts');

const HEADER = `
    /** THIS FILE IS AUTOMATICALLY GENERATED FROM : ${ SWAGGER } **/

    // tslint:disable:max-line-length`;

request.get(SWAGGER, async (err, res, body) => {
    // tslint:disable-next-line:no-console
    if (err) { return console.log(err); }
    const data = JSON.parse(body);
    const swagger = new SwaggerParser(data);

    await TSWriter(outputInterfaces, `
    ${HEADER}
    ${ swagger.createInterfaces() }
    `);

    await TSWriter(outputClass, `
    ${HEADER}
    import { BitmexAbstractAPI } from './BitmexAbstractAPI';
    import * as ${CONTAINER} from './BitmexInterfaces';
    export class BitmexAPI extends BitmexAbstractAPI {
    ${ swagger.createClass() }
    }`);
});
