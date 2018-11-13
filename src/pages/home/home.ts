import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from './../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
               private afs : AngularFireAuth,
               private nativeStorage: NativeStorage) {



// this.nativeStorage.getItem('uid').then(res=>{
//   console.log(res);
// });

  }

  incomePost(){

  }
  logOut(){
    this.afs.auth.signOut().then(()=>{
      this.navCtrl.setRoot(LoginPage);
    })
  }

}
