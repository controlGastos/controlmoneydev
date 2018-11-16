import { EgresosPage } from './../egresos/egresos';
import { LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from './../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-incomes',
  templateUrl: 'incomes.html'
})
export class IncomesPage {

  private uid: string;
  public next:boolean = false;

 
  totalIncomes: number;
  totalExpenses:number;

  //-----  Formularios ---//
public incomeForm: FormGroup;
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
  this.incomeForm = this.formBuilder.group(
  {
    salary:["",Validators.required],
    prima:["", Validators.required],
    firstOther:[],
    secondOther:[]

  });

  this.nativeStorage.getItem('uid').then(res=>
  {
    this.uid = res;
  });

};

  ionViewDidLoad()
  {

  };

  //---------- Income function (Slide1) -----------//


  incomePost()
  {
    let dataIncome =  this.incomeForm.value;
    let incomid = "income"+this.uid;
    var docData =
    {
      salary : parseFloat(dataIncome.salary ),
      prima :  parseFloat(dataIncome.prima),
      firstOther : parseInt((dataIncome.firstOther == null ? 0 : dataIncome.firstOther)),
      secondOther : parseInt(dataIncome.secondOther == null? 0 : dataIncome.secondOther),
      uid : this.uid.toString()
    }

    let loading = this.loadinCtrl.create(
      {
      content:"Guardando Ingresos"
      })
    loading.present();

    this.afst.collection('incomes').doc(incomid).set(docData).then(result=>
      {
      console.log(result);
      loading.dismiss();
      this.incomeForm.reset();
      this.navCtrl.setRoot(EgresosPage);
      this.presentToast("Ingresos Guardados.");
     
      })

  };


 


  // -------- Get Functions -----------//ç

  getIncomes(){

    let refId = "income"+this.uid;
    let incomesRef = this.afst.collection('incomes').doc(refId);
    incomesRef.get().subscribe(res =>{

      let data = res.data();
      this.totalIncomes = data.salary + data.prima + data.firstOther + data.secondOther;


    })
  }
   async getExpenses(){

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
          this.totalExpenses += data.carTax + data.insurance + data.propertyTax + data.soat},err=>alert(err))

    }
  // --------  -----------//



  // -------- Complement Functions -----------//
  logOut(){
    this.afs.auth.signOut().then(()=>{
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

