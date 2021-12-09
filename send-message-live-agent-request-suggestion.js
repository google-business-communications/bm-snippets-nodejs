/**
 * This code is based on the https://github.com/google-business-communications/nodejs-businessmessages Node.js
 * Business Messages client library.
 */

/**
 * Edit the values below:
 */
const PATH_TO_SERVICE_ACCOUNT_KEY = './service_account_key.json';
const CONVERSATION_ID = 'EDIT_HERE';

const businessmessages = require('businessmessages');
const uuidv4 = require('uuid/v4');
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
 * Posts a message to the Business Messages API with a request for live agent action.
 *
 * @param {string} conversationId The unique id for this user and agent.
 */
 async function sendMessage(conversationId) {
  const authClient = await initCredentials();

  if (authClient) {
    // Create the payload for sending a message along with a request for live agent action
    const apiParams = {
      auth: authClient,
      parent: 'conversations/' + conversationId,
      resource: {
        messageId: uuidv4(),
        representative: {
          representativeType: 'BOT', // Must be sent from a BOT representative
        },
        fallback: 'Would you like to chat with a live agent?',
        text: 'Would you like to chat with a live agent?',
        suggestions: [
          {
            liveAgentRequest: {}
          },
        ],
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

sendMessage(CONVERSATION_ID);
