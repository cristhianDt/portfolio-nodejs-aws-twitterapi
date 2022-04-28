# PORTFOLIO NodeJS WEB APP

## Description

Build a simple portfolio NodeJS based web app that displays the profile image, name, some text with the experience, and the last 10 tweet list of the user's Twitter timeline.

The project could work with mongodb / mongoose / dynamodb, by default works with dynamodb you can try in [heroku - Test](https://current-job-offer.herokuapp.com/) ¡¡¡_**AWS User Key deactived at April 27th** for heroku env_!!!, **IMPORTANT** _Unit and Integration tests works only with dynamoDb. The project uses `git flow` as Git workflow_. If you are using linux OS just run `sudo apt-get install git-flow`. [Read about git-flow](https://www.atlassian.com/es/git/tutorials/comparing-workflows/gitflow-workflow).

> **Note**
>
> The UI use fs to write the portfolio image **in local**, also works with S3 as storage service but you must to set AWS_S3_PUBLIC_BUCKET in your .env file.

## Relevant Information

You can edit just one element (id/portfolioId = 1), insert new item is not allowed.

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

## Technologies used

- Atlas
- Aws-Service
- Aws-DynamoDb
- Docker
- Docker-compose
- GitKraken
- Mongodb
- Jest
- Joi & Celebrate
- Postman
- Twitter-Api
- WebStorm

Others libraries:
```
├── @aws-sdk/client-dynamodb@3.58.0
├── @aws-sdk/lib-dynamodb@3.58.0
├── axios@0.26.1
├── body-parser@1.19.2
├── celebrate@15.0.1
├── cookie-parser@1.4.6
├── cors@2.8.5
├── dotenv@16.0.0
├── express@4.17.3
├── formidable@2.0.1
├── jest@27.5.1
├── lodash@4.17.21
├── mongodb@4.4.1
├── mongoose@6.2.8
├── nodemon@2.0.15
└── winston@3.6.0
```

## Dev Info

Libraries version

```
- npm: @7.24.2
- node: @14.19.1
```

### Testing

If you wish to run the unit and integration tests, you DynamoDb must be enabled, add `USE_DYNAMODB_FEATURE_FLAG=enabled` in your `.env` file
