# PORTFOLIO NodeJS WEB APP

Readme file with Detailed steps to get the application up and running: software prerequisites, steps to build the app, technologies used,
etc, as well as the total time (in hours) it took you to complete the test

This project use git flow. If you are using linux OS just run `sudo apt-get install git-flow`. [Read about git-flow](https://www.atlassian.com/es/git/tutorials/comparing-workflows/gitflow-workflow).

## Description

Build a simple portfolio NodeJS based web app that displays the profile image, name, some text with the experience, and the last 10 tweet list of the user's Twitter timeline.

The project works with mongodb / mongoose / dynamodb (process...)

## Relevant Information

(process...)

## First Steps

1. (optional) You could run a dynamodb locally [following this instructions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)
2. If you already have a credentials to connect an existing DynamoDb, you must add those in your new `.env` file (see .env.dist explained)
3. Create `Portfolio` table, you can use one of the next options
   1. Creating manually by [aws-cli](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.CLI.html)
      ```
      aws dynamodb create-table \ --table-name Portfolio 
      --attribute-definitions AttributeName=portfolioId,AttributeType=N 
      --key-schema AttributeName=portfolioId,KeyType=HASH 
      --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 
      --table-class STANDARD --endpoint-url http://localhost:8000
      ```
   2. By [NoSql Workbench](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.settingup.html)
   3. By `console.aws.amazon.com`
   4. Running `npm run tasks:dumpPortfolio` (only works with dynamodb)

## Dev Info

Libraries version

```
- npm: @7.24.2
- node: @14.19.1
```
