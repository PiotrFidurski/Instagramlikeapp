
# Instagramlikeapp

## Table of Contents

<details>
<summary>Click to expand</summary>
  
- [Introduction](#introduction)  
  
- [Environment Variables](#environment-variables)

- [Deploy this yourself](#deploy-this-yourself)
 
- [Known Issues](#known-issues)

</details>

## Introduction

Welcome to [Instagramlikeapp](https://scuffedinsta.vercel.app/), as the name suggests, this is a stripped down version of instagram app.
The app is live and you're free to check it out and report any bugs u may find, here are some credentials if you dont wan't to sign in yourself: email: `test@example.com`, password: `Secret55%`

<table>
  <tr>
    <td align="left">
<img src="https://i.imgur.com/fvp3Z9W.png" align="left" /></td>
    <td align="right"><img src="https://i.imgur.com/rXcoWAc.png"  align="right" /></td>
  </tr>
  <tr>
    <td align="left" >
<img src="https://i.imgur.com/RTfCtIN.png" align="left" /></td>
 
  <td align="left"><img src="https://i.imgur.com/DXPRfHm.png" align="right" /></td>
     </tr>
</table>

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

- Clone to your computer

  - `git clone https://github.com/[YOUR GITHUB USERNAME]/Instagramlikeapp`
  
  - `cd Instagramlikeapp`
  
  - `npm install`

- Create .env.local in the root directory of your project, add env variables required.

- Start a dev server

  - `npm run dev`
  
- Deploy to Vercel
  
  - Go to [vercel](https://vercel.com) and create an account if you don't have it yet.
  - Click on `New Project` button.
  - Select the repo you want to import and deploy.
  - Configure your project remember to setup your Environment Variables.

## Known Issues

  - There's an issue with Vercel deploy where `api/me` serverless function takes over 10s and times out after u sign in, after refreshing the page this issue seems to be gone.
  - Provider sign in callback doesn't redirect users correctly sometimes.
