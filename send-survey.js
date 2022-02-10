//// Copyright 2022 Google LLC
////
//// Licensed under the Apache License, Version 2.0 (the "License");
//// you may not use this file except in compliance with the License.
//// You may obtain a copy of the License at
////
////     https://www.apache.org/licenses/LICENSE-2.0
////
//// Unless required by applicable law or agreed to in writing, software
//// distributed under the License is distributed on an "AS IS" BASIS,
//// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//// See the License for the specific language governing permissions and
//// limitations under the License.

/**
 * This code sends a survey to the user:
 * Read more: https://developers.google.com/business-communications/business-messages/guides/how-to/message/surveys?hl=en
 *
 * This code is based on the https://github.com/google-business-communications/nodejs-businessmessages Node.js
 * Business Messages client library.
 */

/**
 * Edit the values below:
 */
const PATH_TO_SERVICE_ACCOUNT_KEY = './service_account_key.json';
const CONVERSATION_ID = 'EDIT_HERE';

const businessmessages = require('businessmessages');
const uuidv4 = require('uuid').v4;
const {google} = require('googleapis');

// Initialize the Business Messages API
const bmApi = new businessmessages.businessmessages_v1.Businessmessages({});

// Set the scope that we need for the Business Messages API
const scopes = [
  'https://www.googleapis.com/auth/businessmessages',
];

// Set the private key to the service account file
const privatekey = require(PATH_TO_SERVICE_ACCOUNT_KEY);

/**
 * Posts a survey to the Business Messages API.
 *
 * @param {string} conversationId The unique id for this user and agent.
 */
async function sendSurvey(conversationId) {
  const authClient = await initCredentials();

  // Create the payload for creating a new survey
  const apiParams = {
    auth: authClient,
    parent: 'conversations/' + conversationId,
    surveyId: uuidv4(),
    resource: {}
  };

  // Call the message create function using the
  // Business Messages client library
  bmApi.conversations.surveys.create(apiParams,
    {auth: authClient}, (err, response) => {
    console.log(err);
    console.log(response);
  });
}

/**
 * Initializes the Google credentials for calling the
 * Business Messages API.
 */
 async function initCredentials() {
  // configure a JWT auth client
  const authClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    scopes,
  );

  return new Promise(function(resolve, reject) {
    // authenticate request
    authClient.authorize(function(err, tokens) {
      if (err) {
        reject(false);
      } else {
        resolve(authClient);
      }
    });
  });
}

sendSurvey(CONVERSATION_ID);
