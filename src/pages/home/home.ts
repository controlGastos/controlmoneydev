import { ToastController } from 'ionic-angular';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private afAuth: AngularFireAuth,public navCtrl: NavController, private toastCtrl : ToastController) {

  }

 ionViewDidLoad(){
   this.afAuth.user.subscribe(user =>{
     console.log(user);
     this.presentToast("Hola " +user.email)
     
   })
 }

 logOut(){
   this.afAuth.auth.signOut().then(()=>{
     this.navCtrl.setRoot(LoginPage);
   })
 };

 presentToast(msj : string){
  let toast = this.toastCtrl.create({
    message: msj,
    duration: 3000,
    position: 'bottom'
  });
  toast.present();
}
}
