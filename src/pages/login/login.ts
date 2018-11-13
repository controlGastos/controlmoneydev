import { user } from './../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import {Component} from "@angular/core";
import {NavController, AlertController, ToastController, MenuController, LoadingController} from "ionic-angular";
import {HomePage} from "../home/home";
import {RegisterPage} from "../register/register";
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage';

import * as firebase from 'firebase/app';

interface FsUsers{
  name: string;
  email: string;
  uid:string;  
  id?:string;
};

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user = {} as user;


  public  loginForm: FormGroup;

  loginError: string;

  constructor(private afAuth: AngularFireAuth,
              private formBuilder:FormBuilder, 
              public nav: NavController,
              public forgotCtrl: AlertController,
              public menu: MenuController,
              public toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private nativeStorage: NativeStorage) {

              

    let emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";


    this.loginForm = this.formBuilder.group({
      email:["",[Validators.required, Validators.pattern(emailPattern)]],
      password:["",Validators.required],
    });
    this.menu.swipeEnable(false);
  }

  // go to register page
  register() {
  this.nav.setRoot(RegisterPage);
  }

  // login and go to home page
   async login() {

    let loading = this.loadingCtrl.create({
      content: 'Espera...'
    });



    this.user = this.loginForm.value;

		if (!this.user.email) {
			return;
		}

		let credentials = {
			email: this.user.email,
			password: this.user.password
    };
    try {
       loading.present(); 

       this.afAuth.auth.signInWithEmailAndPassword(credentials.email,credentials.password).then((data)=>{

        this.nativeStorage.setItem('uid',data.user.uid).then(()=>{
          
          this.nav.setRoot(HomePage);

          loading.dismiss();
  
          console.log(data);
        })

        
       },
      err=>{
        loading.dismiss();
        console.log(typeof(err));

        switch (err.code){
          case "auth/wrong-password":
          this.presentToast("Contraseña Incorrecta");
          break;
          
          case "auth/user-not-found":
          this.presentToast("Usuario no encontrado");
          break;

          case "auth/user-disabled":
          this.presentToast("Usuario se encuentra inactivo");
          break;

        };
      });

    } catch (error) {
      loading.dismiss();
      console.log(error);
    }
    	
  }

  presentToast(msj : string){
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 3000,
      position: 'bottom'
    });
    toast.present(); 
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Forgot Password?',
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Send clicked');
            let toast = this.toastCtrl.create({
              message: 'Email was sended successfully',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }

}
