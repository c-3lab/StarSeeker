# Overview
This section describes how to run automated tests.<br>
[日本語版TEST_READMEはこちら](TEST_README.md)

## Test contents
See the following files whose file names are named in the format `*. *.spec.ts`.
- `backend/src/categories/categories.controller.spec.ts`
- `backend/src/categories/categories.service.spec.ts`
- `backend/src/points/points.controller.spec.ts`
- `backend/src/points/points.service.spec.ts`
- `backend/src/surfaces/surfaces.controller.spec.ts`
- `backend/src/surfaces/surfaces.service.spec.ts`
- `backend/src/utils/index.spec.ts`
- `backend/src/app.controller.spec.ts`
- `backend/src/main.spec.ts`
- `backend/src/server.spec.ts`

## Test execution method
Execute the following command to start the automated test.
```
npm run test:cov
```

Make sure that the coverage is displayed as 100% (*).<br>
*This is the case for c0 (Stmts) and c1 (Branches).
```
---------------------------|---------|----------|---------|---------|-------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------------|---------|----------|---------|---------|-------------------
All files                  |     100 |      100 |     100 |     100 |                   
 src                       |     100 |      100 |     100 |     100 |                   
  app.controller.ts        |     100 |      100 |     100 |     100 |                   
  app.module.ts            |     100 |      100 |     100 |     100 |                   
  app.service.ts           |     100 |      100 |     100 |     100 |                   
  main.ts                  |     100 |      100 |     100 |     100 |                   
  server.ts                |     100 |      100 |     100 |     100 |                   
 src/categories            |     100 |      100 |     100 |     100 |                   
  categories.controller.ts |     100 |      100 |     100 |     100 |                   
  categories.module.ts     |     100 |      100 |     100 |     100 |                   
  categories.service.ts    |     100 |      100 |     100 |     100 |                   
 src/points                |     100 |      100 |     100 |     100 |                   
  points.controller.ts     |     100 |      100 |     100 |     100 |                   
  points.module.ts         |     100 |      100 |     100 |     100 |                   
  points.service.ts        |     100 |      100 |     100 |     100 |                   
 src/surfaces              |     100 |      100 |     100 |     100 |                   
  surfaces.controller.ts   |     100 |      100 |     100 |     100 |                   
  surfaces.module.ts       |     100 |      100 |     100 |     100 |                   
  surfaces.service.ts      |     100 |      100 |     100 |     100 |                   
 src/utils                 |     100 |      100 |     100 |     100 |                   
  index.ts                 |     100 |      100 |     100 |     100 |                   
---------------------------|---------|----------|---------|---------|-------------------

Test Suites: 10 passed, 10 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        14.671 s
Ran all test suites.
```