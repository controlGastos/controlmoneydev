import { AhorroPage } from './../ahorro/ahorro';

import { LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from './../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController,NavParams } from 'ionic-angular';
import { NotificationsSettingsPage } from '../notifications-settings/notifications-settings';

/**
 * Generated class for the OtrosEgresosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-otros-egresos',
  templateUrl: 'otros-egresos.html',
})
export class OtrosEgresosPage {

  private uid: string;
  otherServices:object[];  
  today:string = new Date().toISOString();
  public otherExpenseForm: FormGroup;
  totalIncomes: number;
  totalExpenses:number;
  estimatedSaving:number;

  constructor(public navCtrl: NavController,
               public navParams: NavParams,
               public formBuilder: FormBuilder,
               private afs : AngularFireAuth,
               private afst: AngularFirestore,
               private nativeStorage: NativeStorage,
               private toastCtrl: ToastController,
               private loadinCtrl : LoadingController) {

                this.nativeStorage.getItem('uid').then(res=>
                  {
                    this.uid = res;
                  });

                this.otherExpenseForm = this.formBuilder.group(
                  {
            
                    prepaidHealth:[],
                    entertainment:[],
                    clothing:[],
                    feeding:[],
                    transport:[],
                    education:[],
                      datePrepaidHealth:[],
                      dateEntertainment:[],
                      dateClothing:[],
                      dateFeeding:[],
                      dateTransport:[],
                      dateEducation:[],
                  });
  }

  ionViewDidLoad() {
    
  this.otherServices = [

    {title:"Salud Prepagada",icon:'medkit', controlName:'prepaidHealth',controlName2:'datePrepaidHealth'},
    {title:"Entretenimiento",icon:'logo-playstation', controlName:'entertainment',controlName2:'dateEntertainment'},
    {title:"Ropa",icon:'shirt', controlName:'clothing',controlName2:'dateClothing'},
    {title:"Alimentacion",icon:'pizza', controlName:'feeding',controlName2:'dateFeeding'},
    {title:"Transporte",icon:'bus', controlName:'transport',controlName2:'dateTransport'},
    {title:"Educacion",icon:'school', controlName:'education',controlName2:'dateEducation'}
  ];
    console.log('ionViewDidLoad OtrosEgresosPage');
  }
  otherExpensePost(){

    let dataExpense =  this.otherExpenseForm.value;
    let expenseid = "otherExpense"+this.uid;    
    let dateExpeneseId = 'dateOtherExpense'+this.uid;
    var dates = {

      datePrepaidHealth:dataExpense.datePrepaidHealth,      
      dateEntertainment:dataExpense.dateEntertainment,
      dateClothing:dataExpense.dateClothing,
      dateFeeding:dataExpense.dateFeeding,
      dateTransport:dataExpense.dateTransport,
      dateEducation:dataExpense.dateEducation,
    } 
    var docData =
    {
        prepaidHealth:parseInt(dataExpense.prepaidHealth== null? 0 :dataExpense.prepaidHealth),
        entertainment:parseInt(dataExpense.entertainment== null? 0 :dataExpense.entertainment),
        clothing:parseInt(dataExpense.clothing== null? 0 :dataExpense.clothing),
        feeding:parseInt(dataExpense.feeding== null? 0 :dataExpense.feeding),
        transport:parseInt(dataExpense.transport== null? 0 :dataExpense.transport),
        education:parseInt(dataExpense.education== null? 0 :dataExpense.education),
      uid : this.uid.toString()
    }

    let loading = this.loadinCtrl.create(
      {
      content:"Guardando otros Egresos "
      })
    loading.present();

    this.afst.collection('otherExpenses').doc(expenseid).set(docData).then(result=>
      {
        this.afst.collection('dateOtherExpenese').doc(dateExpeneseId).set(dates).then(()=>{
          console.log(result);
          loading.dismiss();
          this.otherExpenseForm.reset();
          this.presentToast(" otros Egresos  Guardados.");
          })
          this.getExpenses();
        })

     
  };

  async getExpenses(){

    let refId = "income"+this.uid;
    let incomesRef = this.afst.collection('incomes').doc(refId);
    incomesRef.get().subscribe(res =>{

      let data = res.data();
      this.totalIncomes = data.salary + data.prima + data.firstOther + data.secondOther;


    })

    let expenses = this.afst.collection('expenses').doc( "expense"+this.uid);
    let OtherExpenses = this.afst.collection('otherExpenses').doc( "otherExpense"+this.uid);
    let anualExpenses = this.afst.collection('anualExpenses').doc( "anualExpense"+this.uid);

    expenses.get().subscribe(res =>{
      let data = res.data();
      this.totalExpenses = data.cellPhone + data.combos + data.electricity + data.homePhone+ data.tv+ data.water; },err=>alert(err))
      OtherExpenses.get().subscribe(res =>{
        let data = res.data();
        this.totalExpenses += data.clothing + data.education + data.entertainment + data.prepaidHealth+ data.transport},err=>alert(err))
        anualExpenses.get().subscribe(res =>{
          let data = res.data();
          this.totalExpenses += data.carTax + data.insurance + data.propertyTax + data.soat
          

        },err=>alert(err))


    }

  presentToast(msj : string){
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  next(){
    this.navCtrl.setRoot(NotificationsSettingsPage);
  }
}
