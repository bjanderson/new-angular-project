import { parseTemplate } from './config.mjs';
import { createDirectoryIfNotExists, writeFile } from './file-io.mjs';

// SQL
const sqlFolder = 'sql';
createDirectoryIfNotExists(sqlFolder);

const sqlTemplate = `-- this file is used as a reset/seed script

DROP TABLE IF EXISTS SNAKE_CASE;

CREATE TABLE IF NOT EXISTS SNAKE_CASE (
  id TEXT NOT NULL PRIMARY KEY
);

INSERT INTO SNAKE_CASE (
  id
)
VALUES (
  'c6c4ce04-39c1-4ac6-be96-7e4a0987775a'
);

SELECT * FROM SNAKE_CASE;
`;

const sqlFileName = parseTemplate(`${sqlFolder}/kabab-case.rest`);
const sqlTxt = parseTemplate(sqlTemplate);
writeFile(sqlFileName, sqlTxt);

// REST
const restFolder = 'rest';
createDirectoryIfNotExists(restFolder);

const restTemplate = `@hostname = localhost
@port = 3000
@host = {{hostname}}:{{port}}
@server = http://{{host}}
@api = {{server}}/api/kabab-case
@jsonContentType = Content-Type: application/json;charset=utf-8

###

POST {{api}}
{{jsonContentType}}

{
  "id": ""
}

###

POST {{api}}
{{jsonContentType}}

{
  "id": "test-1"
}

###

GET {{api}}
{{jsonContentType}}

###

GET {{api}}/test-1
{{jsonContentType}}

###

PATCH {{api}}/test-1
{{jsonContentType}}

{
  "id": "test-1"
}

###

DELETE {{api}}/test-1
{{jsonContentType}}
`;

const restFileName = parseTemplate(`${restFolder}/kabab-case.rest`);
const restTxt = parseTemplate(restTemplate);
writeFile(restFileName, restTxt);
