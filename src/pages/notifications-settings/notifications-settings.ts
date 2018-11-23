import { NativeStorage } from '@ionic-native/native-storage';
import { ToastController } from 'ionic-angular';
import { AhorroPage } from './../ahorro/ahorro';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';

/**
 * Generated class for the NotificationsSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notifications-settings',
  templateUrl: 'notifications-settings.html',
})
export class NotificationsSettingsPage {

  private uid: string;

predial:boolean;
vehiculo:boolean;
soat:boolean;
riesgo:boolean;
salud:boolean;
entre:boolean;
ropa:boolean;
alimen:boolean;
trans:boolean;
educa:boolean;

  constructor( public toastCtrl: ToastController,  private nativeStorage: NativeStorage,public navCtrl: NavController, public navParams: NavParams ,private afst: AngularFirestore ) {
 
    this.nativeStorage.getItem('uid').then(res=>
      {
        this.uid = res;
        this.getAlertSettings();
      });
  }

  ionViewDidLoad() {
   
    console.log('ionViewDidLoad NotificationsSettingsPage');
  }
  next(){
    this.navCtrl.setRoot(AhorroPage);
  }

  getAlertSettings(){
    let docId = "alert"+this.uid;
    let alertsBD =  this.afst.collection('alerts').doc(docId);
    alertsBD.get().subscribe(res=>{
      let data = res.data();
      this.predial=data.predial;
      this.vehiculo=data.vehiculo;
      this.soat=data.soat;
      this.riesgo=data.riesgo;
      this.salud=data.salud;
      this.entre=data.entre;
      this.ropa=data.ropa;
      this.alimen=data.alimen;
      this.trans=data.trans;
      this.educa=data.educa;
    })


 
  }

  save(){
    let docId = "alert"+this.uid;
    let data ={
      predial:this.predial == undefined ? false: this.predial,
      vehiculo:this.vehiculo == undefined ? false: this.vehiculo,
      soat:this.soat == undefined ? false: this.soat,
      riesgo:this.riesgo == undefined ? false: this.riesgo,
      salud:this.salud == undefined ? false: this.salud,
      entre:this.entre == undefined ? false: this.entre,
      ropa:this.ropa == undefined ? false: this.ropa,
      alimen:this.alimen == undefined ? false: this.alimen,
      trans:this.trans == undefined ? false: this.trans,
      educa:this.educa == undefined ? false: this.educa,
      userId:this.uid

    }
    
    this.afst.collection('alerts').doc(docId).set(data).then(res=>{
      this.toastCtrl.create({
        message:'Alertas Guardadas',
        duration:3000,
        position:'bottom'
      }).present();
    })
   
  }
}
