import { NativeStorage } from '@ionic-native/native-storage';
import { IncomesPage } from './../incomes/incomes';
import { HomePage } from './../home/home';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import {Component} from "@angular/core";
import {NavController, ToastController, LoadingController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { user } from "../../models/user";
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  public  SignUpForm: FormGroup;
  private fb;
   
  constructor(public nav: NavController,              
              private formBuilder:FormBuilder, 
              private afAuth: AngularFireAuth,              
              public afs : AngularFirestore,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private nativeStorage: NativeStorage ) {

                let emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
                this.SignUpForm = this.formBuilder.group({
                  name:["",Validators.required],
                  email:["",[Validators.required, Validators.pattern(emailPattern)]],
                  password:["",Validators.required],
                }); 
                this.fb = firebase;
              }

  // register and go to home page
  async register() {

    let user : user; 
    user = this.SignUpForm.value;
    let loading= this.loadingCtrl.create({
      content:"Registrando Usuario...",

    });
          
    


    if(!user.email){
      return;
    }
    try {
      loading.present(); 
      this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password).then(result =>{
        
        let email = user.email;
        let name = user.name;
        let uid = result.user.uid;
        let newUser = result.additionalUserInfo.isNewUser; 
        this.nativeStorage.setItem('uid',result.user.uid);
        
        
        this.afs.collection('users').add({email,name,uid}).then(fsRes=>{

           
            if(newUser){
              this.nav.setRoot(IncomesPage); 
              loading.dismiss();
            }else{
              this.nav.setRoot(HomePage);
              loading.dismiss();
            }        
          
        
        },err =>{
          console.log(err);
          loading.dismiss();
          alert(err);
        })
        
      },
      err=>{
        loading.dismiss();
        switch(err.code){
          case "auth/email-already-in-use":
          this.presentToast("Este usuario ya existe.");
          break;
          case "auth/weak-password":
          this.presentToast("Contraseña debe tener  mas de 6 caracteres.");
          break;

        }
        console.log(err);
      }
    )
    } catch (error) {
      loading.dismiss();
      console.log(error);
    }
    
  }

  // go to login page
  login() {
    this.nav.setRoot(LoginPage);
  }

  presentToast(msj : string){
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
