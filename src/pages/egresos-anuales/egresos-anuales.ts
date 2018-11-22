import { OtrosEgresosPage } from './../otros-egresos/otros-egresos';


import { LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from './../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController,NavParams } from 'ionic-angular';

/**
 * Generated class for the EgresosAnualesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-egresos-anuales',
  templateUrl: 'egresos-anuales.html',
})
export class EgresosAnualesPage {

  today:string = new Date().toISOString();
  private uid: string;
  anualServices:object[];
  public anualExpenseForm: FormGroup;

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

                this.anualExpenseForm = this.formBuilder.group(
                  {
                    propertyTax:[],
                    carTax:[],
                    soat:[],
                    insurance:[],
                    datePropertyTax:[],
                    dateCarTax:[],
                    dateSoat:[],
                    dateInsurance:[]
                  });
  }

  ionViewDidLoad() {
    this.anualServices = [
      {title:"Imp. Predial",icon:'home', controlName:'propertyTax',controlName2:'datePropertyTax'},
      {title:"Imp. Vehicular",icon:'car', controlName:'carTax',controlName2:'dateCarTax'},
      {title:"SOAT",icon:'card', controlName:'soat',controlName2:'dateSoat'},
      {title:"Seg. todo riesgo",icon:'help-buoy', controlName:'insurance',controlName2:'dateInsurance'}
    ];
    console.log('ionViewDidLoad EgresosAnualesPage');
  }
  anualExpensePost(){

    let dataExpense =  this.anualExpenseForm.value;
    let expenseid = "anualExpense"+this.uid;    
    let dateExpeneseId = 'AnualDateExpense'+this.uid;
    var dates = {

      datePropertyTax:dataExpense.datePropertyTax,      
      dateCarTax:dataExpense.dateCarTax,
      dateSoat:dataExpense.dateSoat,
      dateInsurance:dataExpense.dateInsurance
    }
    var docData =
    {

      propertyTax:parseInt(dataExpense.propertyTax== null? 0 :dataExpense.propertyTax),
      carTax:parseInt(dataExpense.carTax== null? 0 :dataExpense.carTax),
      soat:parseInt(dataExpense.soat== null? 0 :dataExpense.soat),
      insurance:parseInt(dataExpense.insurance== null? 0 :dataExpense.insurance),
      uid : this.uid.toString()
    }

    let loading = this.loadinCtrl.create(
      {
      content:"Guardando Egresos anuales"
      })
    loading.present();

    this.afst.collection('anualExpenses').doc(expenseid).set(docData).then(result=>
      {

        this.afst.collection('dateAnualExpenese').doc(dateExpeneseId).set(dates).then(()=>{{
          console.log(result);
          loading.dismiss();
          this.anualExpenseForm.reset();      
          this.navCtrl.setRoot(OtrosEgresosPage);
          this.presentToast("Egresos anuales Guardados.");
        }})
     
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
