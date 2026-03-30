Architecture:
- Characteristics:
-- Availability
-- Readability / Maintainability

- Architech style
-- Monolithic
-- Layered (UI - Business - Microservices)

- Decisions
-- Start with domain, what we try to do ... make UI, then connect with server
-- For technical problem (database, cache, validation, authentication) make separate/isolate module and let them act as microvervices

- Priciples
-- In most cases, use API to interact with data instead of call direct on server (unless for SEO)

Web info:
- Name: mohopam
- Title: Tìm hợp âm
- Language: Vietnamese

- Stack
-- Express.js
-- MongoDB Atlas

Front end:
- Tailwind, basic style (cdn)
- Make it look like real web, modern look
- The web design should blend in so people can focus on two thing: the search bar, the content.
- SEO friendly

Feature:
- Header: search
- Footer: basic copyright
- Home page: Search songs by title or artist
- Song detail page (show lyrics with chords)

Rules:
- Fully  automatic

```
const functions = require('@google-cloud/functions-framework');
const config = require('./config');
const services = require('@oangia/services');
services.init(config);

const app = require("@oangia/services/app");

functions.http('helloHttp',  app);

module.exports = {
    database: {
        uri: 'mongodb+srv://hqnhatdn:abc123$$@cluster0.wnkrqan.mongodb.net/?appName=Cluster0',
        dbname: 'mydb'
    },
    jwt: {
        secret: 'de5db2cb37a2b0d884d3a680e96b80baa99b7a267796db3f0ddeb183e63fc5aa5c8f52d25ba92bd1e10f1b090cecf10751e7a5891a5986112f2cb4d8d26665d5'
    }
};

{
  "dependencies": {
    "@google-cloud/functions-framework": "^3.0.0",
    "@oangia/services": "^1.0.1-0",
    "bcrypt": "^6.0.0",
    "express": "^5.2.1",
    "body-parser": "^2.2.2",
    "cors": "^2.8.6",
    "jsonwebtoken": "^9.0.3",
    "mongodb": "^7.1.0"
  }
}

```