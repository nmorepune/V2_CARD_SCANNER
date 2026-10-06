import { ContactData } from "../types";

const getClientId = () => {
  const env = (import.meta as any).env;
  if (env && env.VITE_GOOGLE_CLIENT_ID) return env.VITE_GOOGLE_CLIENT_ID;
  if (typeof process !== 'undefined' && process.env.GOOGLE_CLIENT_ID) return process.env.GOOGLE_CLIENT_ID;
  return '';
};

const CLIENT_ID = getClientId();
const DISCOVERY_DOC = 'https://people.googleapis.com/$discovery/rest?version=v1';
const SCOPES = 'https://www.googleapis.com/auth/contacts';

let tokenClient: any;
let gapiInited = false;
let gisInited = false;

export const initContactsGapiClient = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if(!window.gapi) {
      reject("Google API script not loaded");
      return;
    }
    
    window.gapi.load('client', async () => {
      try {
        await window.gapi.client.init({
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
};

export const initContactsGisClient = (): void => {
  if(!window.google || !window.google.accounts) {
    console.warn("Google Identity Services script not loaded.");
    return;
  }
  
  if (!CLIENT_ID) {
    throw new Error("MISSING_CLIENT_ID");
  }

  try {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (resp: any) => {}, // Will be overridden
    });
    gisInited = true;
  } catch (err) {
    console.error("Failed to initialize Token Client", err);
  }
};

export const authenticateAndSaveToGoogleContacts = (data: ContactData, onSuccess: () => void, onError: (err: any) => void) => {
  if (!tokenClient) {
    onError(new Error("Google Sign-In not initialized."));
    return;
  }
  
  tokenClient.callback = async (resp: any) => {
    if (resp.error) {
       console.error("OAuth Error:", resp);
       onError(resp.error);
       return;
    }
    try {
      await saveToGoogleContacts(data);
      onSuccess();
    } catch (e) {
      onError(e);
    }
  };
  
  tokenClient.requestAccessToken({ prompt: '' });
};

export const requestContactsAccessToken = () => {
  if(!tokenClient) {
     throw new Error("Google Sign-In not initialized.");
  }
  tokenClient.requestAccessToken({ prompt: 'consent' });
};

export const saveToGoogleContacts = async (data: ContactData): Promise<void> => {
  try {
    const contact = {
      names: [{ givenName: data.name }],
      organizations: [{ name: data.company_name, title: data.designation }],
      emailAddresses: [
        ...(data.email_1 ? [{ value: data.email_1 }] : []),
        ...(data.email_2 ? [{ value: data.email_2 }] : [])
      ],
      phoneNumbers: [
        ...(data.phone_1 ? [{ value: data.phone_1 }] : []),
        ...(data.phone_2 ? [{ value: data.phone_2 }] : [])
      ],
      addresses: [
        ...(data.address ? [{ streetAddress: data.address }] : [])
      ]
    };

    await window.gapi.client.people.people.createContact({
      resource: contact
    });
  } catch (error) {
    console.error("Error saving to Google Contacts:", error);
    throw error;
  }
};
