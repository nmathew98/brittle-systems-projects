## About

Implementations of [realworld](https://github.com/gothinkster/realworld) built to the following [specs](https://github.com/gothinkster/realworld-api-action/blob/main/postman-collection.json).

A REST API for RealWorld. Each entity in the domain is broken down by CRUD operations and the queries for each entity grouped accordingly. The idea was to be able to compose queries together, so each query returns a filter and by composing multiple queries together we get the final result for an endpoint. The aim was to make things easy to test and to allow for flexibility if the API architecture needed to change à la [Polylith Architecture](https://polylith.gitbook.io/polylith/).

## Usage

Swagger: [https://api.realworld.io/api-docs/#/](https://api.realworld.io/api-docs/#/)

API: [https://realworld-backend-npostgres-ohlbky5imq-km.a.run.app/api](https://realworld-backend-npostgres-ohlbky5imq-km.a.run.app/api)

Postman collection with some samples: `backend-npostgres/postman-collection.json`

## Key Features

- Use of UUID v6 so that reads stay quick, especially for getting articles feed and tags
- The pipeable architecture enables quick migration to a serverless architecture or use of a different interface such as gRPC or GraphQL
- The focus is mainly on the queries so very little JS is executed keeping things quick like in [`makeArticle`](https://github.com/nmathew98/realworld/blob/backend-npostgres/backend-npostgres/src/entities/article/create/index.ts)
- Injecting a context allows for easy testing because all we have to do is snapshot test the SQL queries and test the branches: [`makePipe`](https://github.com/nmathew98/realworld/blob/backend-npostgres/backend-npostgres/src/utilities/pipe.ts) and [`makeArticle`](https://github.com/nmathew98/realworld/blob/backend-npostgres/backend-npostgres/src/entities/article/create/index.ts)
- Queries are mostly decoupled, filters are passed around as DTOs like in [`makeArticle`](https://github.com/nmathew98/realworld/blob/backend-npostgres/backend-npostgres/src/entities/article/create/index.ts#L14). The DTOs guarantee a unique identifier, any other information is not guaranteed to be present so if one query relies on an unguaranteed field there is coupling
- Use of `COALESCE` for efficient articles count estimation when the number of articles is large: [`getArticles`](https://github.com/nmathew98/realworld/blob/backend-npostgres/backend-npostgres/src/entities/article/read/get-articles.ts#L32)

## Tech Stack
- [h3](https://github.com/unjs/h3)
- [date-fns](https://date-fns.org)
- [passport](https://www.passportjs.org)
- [node-postgres](https://node-postgres.com)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [uuid-v6](https://www.npmjs.com/package/uuid-v6)
- [vitest](https://vitest.dev)
- [zod](https://github.com/colinhacks/zod)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [morgan](https://www.npmjs.com/package/morgan)
- [ddosify](https://github.com/ddosify/ddosify)
- Docker
- Docker Compose
- NGINX
- Postgres
- Google Cloud Build
- Google Cloud Run

## Benchmarks

Benchmarked with: [ddosify](https://github.com/ddosify/ddosify)

<details>
<summary>POST /api/users/login</summary>

`ddosify -m POST -t https://realworld-backend-npostgres-ohlbky5imq-km.a.run.app/api/users/login -d 10 -n 100 -b '{ "user": { "email": "test@abcdef.com", "password": "abcDEF123" } }'`

<img width="1136" alt="image" src="https://user-images.githubusercontent.com/55116576/230756651-442a2345-4c25-4cc2-88ba-e37d864aec1a.png">

</details>

<details>
<summary>POST /api/users</summary>

`ddosify -m POST -t https://realworld-backend-npostgres-ohlbky5imq-km.a.run.app/api/users -d 10 -n 100 -b '{ "user": { "email": "{{_randomEmail}}", "password": "{{_randomPassword}}", "username": "{{_randomUserName}}" } }'`

<img width="1136" alt="image" src="https://user-images.githubusercontent.com/55116576/230756669-390340d9-5d39-4f8c-a5d4-c0190b9da0f8.png">

</details>

<details>
<summary>POST /articles</summary>

`ddosify -m POST -h 'Cookie: refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZWRkNjdiYS0wNDEyLTY5ZTAtNzU1MS04MT
lkNGJjYjY3NDEiLCJpYXQiOjE2ODEwMTg5MDQsImV4cCI6MjI4NTgxODkwNH0.n_XHCD6fITnWt-LR0b2GgAXAkR8MRyblHqgpEFO_1nc' -t https://realworld-backend-npostgres-ohlbky5imq-km.a.run.app/api/articles -d 10 -n 100 -b '{ "article": { "title": "{{_randomLoremSentenc
e}}", "description": "{{_randomLoremSentence}}", "body": "{{_randomLoremParagraphs}}", "tagList": ["{{_randomLoremWord}}",
"{{_randomLoremWord}}", "{{_randomLoremWord}}", "{{_randomLoremWord}}", "{{_randomLoremWord}}", "{{_randomLoremWord}}"] } }
'`

Test user details:
- email: `test@abcdef.com`
- password: `abcDEF123`

<img width="1136" alt="image" src="https://user-images.githubusercontent.com/55116576/230757261-0fd0c6ec-7758-4b5e-8d5e-6509a398e2f5.png">

</details>

<details>
<summary>GET /api/articles/feed</summary>

`ddosify -t https://realworld-backend-npostgres-ohlbky5imq-km.a.run.app/api/articles/feed -d 10 -n 100`

<img width="1136" alt="image" src="https://user-images.githubusercontent.com/55116576/230757998-20c453ff-7ad8-41c9-90d8-8109fa8b5f02.png">

</details>
