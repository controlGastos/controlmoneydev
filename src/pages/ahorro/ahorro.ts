import { LoadingController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NavController,  ToastController } from 'ionic-angular';
import { Observable } from 'rxjs';

interface project{
  name:string,
  ammount:number,
  uid:string
}

@Component({
  selector: 'page-ahorro',
  templateUrl: 'ahorro.html'
})
export class AhorroPage {

  private uid: string;
  projectCollection: AngularFirestoreCollection<project>;
  pjs: Observable<project[]>;
  totalIncomes: number;
  totalExpenses:number;
  estimatedSaving:number;

  //-----  Formularios ---//
public projectForm: FormGroup;
//----------------------//

  constructor(public navCtrl: NavController,
               public formBuilder: FormBuilder,
               private afs : AngularFireAuth,
               private afst: AngularFirestore,
               private nativeStorage: NativeStorage,
               private toastCtrl: ToastController,
               private loadinCtrl : LoadingController)
{



//------- validaciones campos de formularios --------//
  this.projectForm = this.formBuilder.group(
  {
    name:["",Validators.required],
    ammount:["", Validators.required]

  });

  this.nativeStorage.getItem('uid').then(res=>
  {
    this.uid = res;
    this.getExpenses();

  });

};

  ionViewDidLoad()
  {
    let loading = this.loadinCtrl.create({content:"Cargando Informacion"});
    loading.present();
    setTimeout(()=>loading.dismiss(),2000);
    this.projectCollection = this.afst.collection('projects');
    this.pjs = this.projectCollection.valueChanges();

  };

  //---------- Income function (Slide1) -----------//


  projectPost()
  {
    let dataIncome =  this.projectForm.value;
    let incomid = "project"+this.uid;
    var docData =
    {
      name: dataIncome.name ,
      ammount :  parseFloat(dataIncome.ammount),
      uid : this.uid.toString()
    }
    this.estimatedSaving -=  dataIncome.ammount;
    let loading = this.loadinCtrl.create(
      {
      content:"Guardando Proyecto"
      })
    loading.present();

    this.afst.collection('projects').add(docData).then(result=>
      {
      console.log(result);
      loading.dismiss();

      this.presentToast("Proyecto Guardado.");
      })
  };


  // -------- Get Functions -----------//ç

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
          let saldo1 = this.totalIncomes -this.totalExpenses
          let saldo2 = (30 * saldo1)/100;

          this.estimatedSaving = saldo2

        },err=>alert(err))


    }
  // --------  -----------//

  saving(){
     let val1 = (this.totalIncomes - this.totalExpenses)
    alert("1: "+ this.totalIncomes + " 2: "+this.totalExpenses)
    this.estimatedSaving = val1;
  }


  // -------- Complement Functions -----------//


  presentToast(msj : string){
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

}

