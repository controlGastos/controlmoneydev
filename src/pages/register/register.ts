
import { AngularFireAuth } from 'angularfire2/auth';
import {Component} from "@angular/core";
import {NavController, ToastController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {HomePage} from "../home/home";
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
              private toastCtrl: ToastController ) {

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

    if(!user.email){
      return;
    }
    try {
      this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password).then(result =>{
        console.log(result);   
        this.nav.setRoot(HomePage); 
        
      },
      err=>{
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
