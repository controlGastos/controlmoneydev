
import * as functions from 'firebase-functions';
import * as admin from  'firebase-admin';

admin.initializeApp(functions.config().firebase);

let user = functions.auth.user();

exports.newDateNotification = functions.firestore
.document('alerts/{subscriptionId}' )
.onWrite(async event=>{
    const data = event.after.data();
    const userId = data.userId;
    const payload = {
        notification:{
            title: 'Configuracion',
            body:`Activaste las alertas de pagos.`
        }
    }

    const db = admin.firestore();
    const deviceRef = db.collection('devices').where('userId','==',userId)

    
    const devices = await deviceRef.get()
    const tokens = [];

    devices.forEach(result =>{
        const token = result.data().token;
        tokens.push(token)
    })
    return admin.messaging().sendToDevice(tokens,payload)
})
