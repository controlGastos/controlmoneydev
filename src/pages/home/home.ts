
import { LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from './../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController,NavParams } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private uid: string;
  totalIncomes: number;
  totalExpenses:number;
  estimatedSaving:number;
    constructor(public navCtrl: NavController,
               private afs : AngularFireAuth,
               public navParams: NavParams,
               public formBuilder: FormBuilder,
               private afst: AngularFirestore,
               private nativeStorage: NativeStorage,
               private toastCtrl: ToastController,
               private loadinCtrl : LoadingController) {

                this.nativeStorage.getItem('uid').then(res=>
                  {
                    this.uid = res;
                    this.getExpenses()
                  });

// this.nativeStorage.getItem('uid').then(res=>{
//   console.log(res);
// });


  }

  ionViewDidLoad(){
   
  }

  incomePost(){

  }
  logOut(){
    this.afs.auth.signOut().then(()=>{
      this.navCtrl.setRoot(LoginPage);
    })
  }

  async getExpenses(){
    let loading = this.loadinCtrl.create({content:"Cargando Informacion"});
    loading.present();
    let refId = "income"+this.uid;
    let incomesRef = this.afst.collection('incomes').doc(refId);
    incomesRef.get().subscribe(res =>{

      let data = res.data();
      if(data == undefined){
        this.totalIncomes=0;
      }else{
        this.totalIncomes = data.salary + data.prima + data.firstOther + data.secondOther;
      }
      


    })

    let expenses = this.afst.collection('expenses').doc( "expense"+this.uid);
    let OtherExpenses = this.afst.collection('otherExpenses').doc( "otherExpense"+this.uid);
    let anualExpenses = this.afst.collection('anualExpenses').doc( "anualExpense"+this.uid);

    expenses.get().subscribe(res =>{
      let data = res.data();
      if(data  == undefined){
        this.totalExpenses = 0;
      }else{
        this.totalExpenses = data.cellPhone + data.combos + data.electricity + data.homePhone+ data.tv+ data.water;
      }
      },err=>alert(err))
      OtherExpenses.get().subscribe(res =>{
        let data = res.data();
        if(data == undefined){
          this.totalIncomes = 0;
        }else{
          this.totalExpenses += data.clothing + data.education + data.entertainment + data.prepaidHealth+ data.transport
        }
        },err=>alert(err))
        anualExpenses.get().subscribe(res =>{
          let data = res.data();
          if(data == undefined){
            this.totalExpenses = 0;
          }else{
            this.totalExpenses += data.carTax + data.insurance + data.propertyTax + data.soat
            let saldo1 = this.totalIncomes -this.totalExpenses
            let saldo2 = (30 * saldo1)/100;
  
            this.estimatedSaving = saldo2
          }
          
          loading.dismiss();

        },err=>alert(err))


    }

}
