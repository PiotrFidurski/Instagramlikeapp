
# Instagramlikeapp

## Table of Contents

<details>
<summary>Click to expand</summary>
  
- [Introduction](#introduction)  
  
- [Environment Variables](#environment-variables)

- [Deploy this yourself](#deploy-this-yourself)

  - [Setting up the local environment](#settting-up-the-local-environment)

  - [Setting up the production environment](#setting-up-the-production-environment)

</details>

## Introduction

Welcome to [Instagramlikeapp](https://scuffedinsta.vercel.app/), as the name suggests, this is a stripped down version of instagram app.

## Environment variables

You do not need to setup all the providers (Google, Twitter, Discord, Github), you can pick one and only setup that providers variables.

## Required

| Name                | Description                                                                    | Example                                                     |
| ------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| MONGODB_URI | your mongodb connection string | `mongodb://Chimson:picturefeed@localhost:27017/picturefeed`|
| API_URL       | api url of your application                                                           | `https://scuffedinsta.vercel.app/api`                           |
| NEXTAUTH_SECRET     | some secret key for your next-auth setup | `192334184120` |
| NEXTAUTH_URL        | The URI of the app                                                             | `https://scuffedinsta.vercel.app`                           |
| CLOUDINARY_CLOUD_NAME | your cloudinary name | `chimson`|
| CLOUDINARY_API_KEY | your cloudinary key | `1239812948192`|
| CLOUDINARY_API_SECRET | your cloudinary secret | `asdkoamaasdk8asd9Y`|

## Pick any of those or setup all of them

| Name                | Description                                                                    | Example                                                     |
| ------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| GITHUB_ID           | Github Application Client id in [console](https://github.com/settings/applications) | `e234092349dasd`                                       |
| GITHUB_SECRET       | Github secret in [console](https://github.com/settings/applications)              | `asd98as9f89P-asd09asd09asdP`                                            |
| DISCORD_ID          | Discord Application Client id in [console](https://discord.com/developers/applications) | `34598394580123` |
| DISCORD_SECRET       | Discord secret in [console](https://discord.com/developers/applications)              | `asdkoasokdasdc8as8dPASD`                                            |
| TWITTER_ID           | Twitter Application Client id in [console](https://developer.twitter.com/en/portal) | `82349nasdkasdOASDo9`                                       |
| TWITTER_SECRET       | Twitter secret in [console](https://developer.twitter.com/en/portal)             | `JAdkasdnasjdKFAFIe8ashhsd`                                            |
| GOOGLE_ID           | Google Application Client id in [console](https://console.cloud.google.com/apis/dashboard) | `039403248203-1aslkdalksdvJsda`                                       |
| GOOGLE_SECRET       | Google secret in [console](https://console.cloud.google.com/apis/dashboard)             | `ASdkasfasfjotr-Zasd98fjhas`                            |


## Deploy this yourself
