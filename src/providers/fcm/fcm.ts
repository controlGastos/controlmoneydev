
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import {Firebase} from '@ionic-native/firebase';
import { NativeStorage } from '@ionic-native/native-storage';



/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  private uid:string;

  constructor(
              public firebaseNative: Firebase,
              public afs: AngularFirestore,
              private Platform : Platform,
              private nativeStorage: NativeStorage) {

                this.nativeStorage.getItem('uid').then((res)=>{
                   this.uid = res;
                 
                })
  }
  async getToken(){
    
    let token;

    if(this.Platform.is('android')){
      token = await this.firebaseNative.getToken()
    }

    return this.saveTokenToFirestore(token)
  }

  private saveTokenToFirestore(token){
    if(!token) return;
    const devicesRef = this.afs.collection('devices')    

    const docData = {
      token,
      userId:this.uid
    }

    return devicesRef.doc(token).set(docData);
  }

  listenToNotificactions(){
    return this.firebaseNative.onNotificationOpen();
  }



}
