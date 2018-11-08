import { AngularFireAuth } from 'angularfire2/auth';
import {Component} from "@angular/core";
import {NavController, AlertController, ToastController, MenuController} from "ionic-angular";
import {HomePage} from "../home/home";
import {RegisterPage} from "../register/register";
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public  loginForm: FormGroup;
  loginError: string;

  constructor(private afAuth: AngularFireAuth,private formBuilder:FormBuilder, public nav: NavController, public forgotCtrl: AlertController, public menu: MenuController, public toastCtrl: ToastController) {

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
    let data = this.loginForm.value;

		if (!data.email) {
			return;
		}

		let credentials = {
			email: data.email,
			password: data.password
    };
    try {
       this.afAuth.auth.signInWithEmailAndPassword(credentials.email,credentials.password).then(()=>{
         this.nav.setRoot(HomePage)
       });

    } catch (error) {
      console.log(error);
    }
    	// this.auth.signInWithEmail(credentials)
		// 	.then(
		// 		() => this.nav.setRoot(HomePage),
		// 		error => this.loginError = error.message
		// 	);
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
