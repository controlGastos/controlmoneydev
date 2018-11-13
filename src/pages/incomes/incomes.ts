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
      salary : parseInt(dataIncome.salary),
      prima :  parseInt(dataIncome.prima),
      firstOther : parseInt(dataIncome.firstOther),
      secondOther : parseInt(dataIncome.secondOther),
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
      water:parseInt(dataExpense.water),
      electricity:parseInt(dataExpense.electricity),
      homePhone:parseInt(dataExpense.homePhone),
      cellPhone:parseInt(dataExpense.cellPhone),
      tv:parseInt(dataExpense.tv),
      combos:parseInt(dataExpense.combos),
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

      propertyTax:parseInt(dataExpense.propertyTax),
      carTax:parseInt(dataExpense.carTax),
      soat:parseInt(dataExpense.soat),
      insurance:parseInt(dataExpense.insurance),      
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
        prepaidHealth:parseInt(dataExpense.prepaidHealth),
        entertainment:parseInt(dataExpense.entertainment),
        clothing:parseInt(dataExpense.clothing),
        feeding:parseInt(dataExpense.feeding),    
        transport:parseInt(dataExpense.transport),
        education:parseInt(dataExpense.education),   
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





  // -------- Complement Functions -----------//
  logOut(){
    this.afs.auth.signOut().then(()=>{
      this.navCtrl.setRoot(LoginPage);
    })
  };

  swipeNext(){
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

