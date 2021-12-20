// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * This code sends to the user a carousel with rich cards and a fallback text.
 * Read more: https://developers.google.com/business-communications/business-messages/guides/how-to/message/send?hl=en#rich-card-carousels
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
 * Posts a carousel card message to the Business Messages API.
 *
 * @param {string} conversationId The unique id for this user and agent.
 * @param {string} representativeType A value of BOT or HUMAN.
 */
async function sendMessage(conversationId, representativeType) {
  const authClient = await initCredentials();

  if (authClient) {
    // Create the payload for sending carousel message
    // with two cards and a suggested reply for each card
    const apiParams = {
      auth: authClient,
      parent: 'conversations/' + conversationId,
      resource: {
        messageId: uuidv4(),
        representative: {
          representativeType: representativeType,
        },
        fallback: 'Card #1\nThe description for card #1\n\nCard #2\nThe description for card #2\n\nReply with \"Card #1\" or \"Card #2\"',
        richCard: {
          carouselCard: {
            cardWidth: 'MEDIUM',
            cardContents: [
              {
                title: 'Card #1',
                description: 'The description for card #1',
                suggestions: [
                  {
                    reply: {
                      text: 'Card #1',
                      postbackData: 'card_1'
                    }
                  }
                ],
                media: {
                  height: 'MEDIUM',
                  contentInfo: {
                    fileUrl: 'https://storage.googleapis.com/kitchen-sink-sample-images/cute-dog.jpg',
                    forceRefresh: 'false',
                  }
                }
              },
              {
                title: 'Card #2',
                description: 'The description for card #2',
                suggestions: [
                  {
                    reply: {
                      text: 'Card #2',
                      postbackData: 'card_2'
                    }
                  }
                ],
                media: {
                  height: 'MEDIUM',
                  contentInfo: {
                    fileUrl: 'https://storage.googleapis.com/kitchen-sink-sample-images/elephant.jpg',
                    forceRefresh: 'false',
                  }
                }
              }
            ]
          }
        }
      },
    };

    // Call the message create function using the
    // Business Messages client library
    bmApi.conversations.messages.create(apiParams,
      {auth: authClient}, (err, response) => {
      console.log(err);
      console.log(response);
    });
  }
  else {
    console.log('Authentication failure.');
  }
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

sendMessage(CONVERSATION_ID, 'BOT');
