![Geppetto Splash](docs/Geppetto-Splash.png)

# Project Geppetto

Project Geppetto is our hackathon innovation that transforms legacy IVR systems into dynamic AI Assistants. By converting traditional, often frustrating IVR flows into engaging, generative conversational experiences, we’re paving the way for businesses to deliver modern, personalized customer interactions without the need for complex coding or system overhauls.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Limitations & Future Work](#limitations--future-work)

---

## Overview

In 2025, high-speed Internet, powerful smartphones, and accessible AI have transformed the way we interact with technology. Yet, many businesses still rely on outdated IVR systems that frustrate customers and hinder engagement.

Traditional IVRs—often using clunky DTMF inputs or rigid phrase matching—are a relic in the age of generative AI. While some businesses have upgraded to more human-like call flows, these solutions remain suboptimal compared to what modern AI can offer.

**Project Geppetto** bridges the gap by converting these legacy IVR flows into smart AI Assistants. Built on top of Twilio Studio, our solution ingests an existing IVR JSON flow and automatically generates an AI Assistant complete with tool calls, a customizable personality prompt, and integrated personalization via Segment. The result is a system that not only mimics human conversation but also adapts to user data—bringing businesses one step closer to cutting-edge customer service.

---

## Project Structure

The project is written in TypeScript and consists of two main modules: a Node.js Express backend and a React frontend.

| Component                                | Description                                                                                                                                            |
|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `http/request.http`                      | Contains example HTTP requests for initiating conversions.                                                                                              |
| `script/add_convert_buttons.js`          | A script that adds 'Convert to AI Assistant' buttons on the Flows page. Requires Right Click > Inspect in Chrome before executing it in the Chrome Console. |
| `src/services/GptService.ts`             | A service for interacting with the GPT model. It includes all the prompts used in the project.                                                         |
| `src/services/TwilioClient.ts`           | A service for interacting with Twilio, handling tasks such as retrieving flow JSON and creating AI Assistants.                                         |
| `src/services/WidgetConverter.ts`        | Contains the core logic for converting Studio widgets into AI Assistant Tools.                                                                         |
| `server.ts`                              | The main entry point for the backend server, responsible for initializing the server, defining routes, and handling incoming requests.                 |
| `wizard-react`                           | This directory contains the React application, which runs in an iframe on the Flows page to initiate flow conversions.                                 |
| `wizard-react/src/ConvertStudioFlow.tsx` | The React component displayed in the iframe UI for the conversion process.                                                                             |

---

## Configuration

The following environment variables are used to configure the application. A sample configuration can be found in the `.env-sample` file.

| Variable          | Description                                                                                                                                                                                                                                                                                                                                                 |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ACCOUNT_SID`     | This is your Twilio Account SID, a unique identifier for your Twilio account. It is used to authenticate API requests and associate them with your account.
| `AUTH_TOKEN`      | This is your Twilio Auth Token, a secret key used in conjunction with your Account SID to authenticate API requests.
| `FLEX_WORKSPACE`  | This variable holds the SID of your Twilio Flex TaskRouter Workspace. It is needed to configure Flex Handover.

## Scripts

The `package.json` file includes several scripts to streamline development and deployment processes:

| Script   | Command                         | Description                                                                                                                |
|----------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| `start`  | `node dist/server.js`           | Executes the compiled server code from the `dist` directory. Used to start the application in a production environment.    |
| `dev`    | `nodemon src/server.ts`         | Utilizes `nodemon` to monitor changes in `src/server.ts` and automatically restarts the server during development.         |
| `build`  | `tsc`                           | Runs the TypeScript compiler to transpile TypeScript files into JavaScript, outputting them in the `dist` directory.       |
| `deploy` | `npm run build && fly deploy`   | First compiles the TypeScript files by running the `build` script, then deploys the application using the Fly.io platform. |


