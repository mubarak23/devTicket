import * as FirebaseAdmin from 'firebase-admin'
import config from '../../config.json';
require('dotenv').config();

const project_id = process.env.PROJECT_ID ||  config.project_id
const private_key = process.env.PRIVATE_KEY || config.private_key
const client_email = process.env.CLIENT_EMAIL || config.client_email

const serviceAccount : FirebaseAdmin.ServiceAccount = {
    projectId: project_id,
    privateKey: private_key ? private_key.replace(/\\n/g, '\n') : '',
    clientEmail: client_email,
}

const app: FirebaseAdmin.app.App | undefined = private_key ? FirebaseAdmin.initializeApp({
    credential: FirebaseAdmin.credential.cert(serviceAccount)
  }) : undefined
  


const fireStoreDb: FirebaseFirestore.Firestore | undefined = private_key ?
    FirebaseAdmin.firestore() : undefined

    
export const firestoreDb = (): FirebaseFirestore.Firestore | undefined => {
        return fireStoreDb  }
         
