import { LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from './../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-incomes',
  templateUrl: 'incomes.html'
})
export class IncomesPage {
  @ViewChild(Slides) slides: Slides;

  private uid: string;
  public next:boolean = false;
  services  :object[];
  anualServices:object[];
  otherServices:object[];
  totalIncomes: number;
  totalExpenses:number;

  //-----  Formularios ---//
public incomeForm: FormGroup;
public expenseForm: FormGroup;
public anualExpenseForm: FormGroup;
public otherExpenseForm: FormGroup;
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

  this.expenseForm = this.formBuilder.group(
  {
    water:[],
    electricity:[],
    homePhone:[],
    cellPhone:[],
    tv:[],
    combos:[]
  });

  this.anualExpenseForm = this.formBuilder.group(
    {
      propertyTax:[],
      carTax:[],
      soat:[],
      insurance:[]
    });

    this.otherExpenseForm = this.formBuilder.group(
      {

        prepaidHealth:[],
        entertainment:[],
        clothing:[],
        feeding:[],
        transport:[],
        education:[]
      });



  this.nativeStorage.getItem('uid').then(res=>
  {
    this.uid = res;
  });

};

  ionViewDidLoad()
  {

  this.services = [
    {title:"Agua",icon:'water', controlName:'water'},
    {title:"Electricidad",icon:'bulb', controlName:'electricity'},
    {title:"Telefonia",icon:'call', controlName:'homePhone'},
    {title:"Celular",icon:'phone-portrait', controlName:'cellPhone'},
    {title:"Televisión",icon:'desktop', controlName:'tv'},
    {title:"Combos",icon:'logo-buffer', controlName:'combos'},
  ];
  this.anualServices = [
    {title:"Imp. Predial",icon:'home', controlName:'propertyTax'},
    {title:"Imp. Vehicular",icon:'car', controlName:'carTax'},
    {title:"SOAT",icon:'card', controlName:'soat'},
    {title:"Seg. todo riesgo",icon:'help-buoy', controlName:'insurance'}
  ];
  this.otherServices = [

    {title:"Salud Prepagada",icon:'medkit', controlName:'prepaidHealth'},
    {title:"Entretenimiento",icon:'logo-playstation', controlName:'entertainment'},
    {title:"Ropa",icon:'shirt', controlName:'clothing'},
    {title:"Alimentacion",icon:'pizza', controlName:'feeding'},
    {title:"Transporte",icon:'bus', controlName:'transport'},
    {title:"Educacion",icon:'school', controlName:'education'}
  ];
    this.slides.lockSwipeToNext(true);
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
      this.next = false;
      this.presentToast("Ingresos Guardados.");
      })

  };


  //-------expenses functions ----------//

  expensePost(){

    let dataExpense =  this.expenseForm.value;
    let expenseid = "expense"+this.uid;
    var docData =
    {
      water:parseInt(dataExpense.water  == null? 0 : dataExpense.water),
      electricity:parseInt(dataExpense.electricity == null? 0 :dataExpense.electricity),
      homePhone:parseInt(dataExpense.homePhone== null? 0 :dataExpense.homePhone),
      cellPhone:parseInt(dataExpense.cellPhone== null? 0 :dataExpense.cellPhone),
      tv:parseInt(dataExpense.tv== null? 0 :dataExpense.tv),
      combos:parseInt(dataExpense.combos== null? 0 :dataExpense.combos),
      uid : this.uid.toString()
    }

    let loading = this.loadinCtrl.create(
      {
      content:"Guardando Egresos"
      })
    loading.present();

    this.afst.collection('expenses').doc(expenseid).set(docData).then(result=>
      {
      console.log(result);
      loading.dismiss();
      this.expenseForm.reset();
      this.next = false;
      this.presentToast("Egresos Guardados.");
      })
  };

   //-------AnualExpenses functions ----------//

   anualExpensePost(){

    let dataExpense =  this.anualExpenseForm.value;
    let expenseid = "anualExpense"+this.uid;
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
      console.log(result);
      loading.dismiss();
      this.anualExpenseForm.reset();
      this.next = false;
      this.presentToast("Egresos anuales Guardados.");
      })
  };
  //-------otherExpenses functions ----------//

  otherExpensePost(){

    let dataExpense =  this.otherExpenseForm.value;
    let expenseid = "otherExpense"+this.uid;
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
      console.log(result);
      loading.dismiss();
      this.otherExpenseForm.reset();
      this.next = false;
      this.presentToast(" otros Egresos  Guardados.");
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

  swipeNext(resume?:boolean){
    if (resume) {
      this.getExpenses();
      this.getIncomes();

   }
    this.slides.lockSwipeToNext(false);
    this.slides.slideNext(1000);
    this.slides.lockSwipeToNext(true);

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

