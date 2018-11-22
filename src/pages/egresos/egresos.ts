import { EgresosAnualesPage } from './../egresos-anuales/egresos-anuales';
import { Component } from '@angular/core';
import { NavController, NavParams,Slides, ToastController } from 'ionic-angular';import { LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from './../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'page-egresos',
  templateUrl: 'egresos.html',
})
export class EgresosPage {

  private uid: string;
  today:string = new Date().toISOString();
  services  :object[];
  
  public expenseForm: FormGroup;

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
      this.expenseForm = this.formBuilder.group(
        {
          water:[],
          electricity:[],
          homePhone:[],
          cellPhone:[],
          tv:[],
          combos:[],
          dateWater:[],
          dateElectricity:[],
          dateHomePhone:[],
          dateCellPhone:[],
          dateTv:[],
          dateCombos:[],
        });
  }

  ionViewDidLoad() {
    this.services = [
      {title:"Agua",icon:'water', controlName:'water',controlName2:'dateWater'},
      {title:"Electricidad",icon:'bulb', controlName:'electricity',controlName2:'dateElectricity'},
      {title:"Telefonia",icon:'call', controlName:'homePhone',controlName2:'dateHomePhone'},
      {title:"Celular",icon:'phone-portrait', controlName:'cellPhone',controlName2:'dateCellPhone'},
      {title:"Televisión",icon:'desktop', controlName:'tv',controlName2:'dateTv'},
      {title:"Combos",icon:'logo-buffer', controlName:'combos',controlName2:'dateCombos'},
    ];
    console.log('ionViewDidLoad EgresosPage');
  }

  expensePost(){

    let dataExpense =  this.expenseForm.value;
    let expenseid = "expense"+this.uid;
    let dateExpeneseId = 'dateExpense'+this.uid;
    var dates = {

      dateWater:dataExpense.dateWater,      
      dateElectricity:dataExpense.dateElectricity,
      dateHomePhone:dataExpense.dateHomePhone,
      dateCellPhone:dataExpense.dateCellPhone,
      dateTv:dataExpense.dateTv,
      dateCombos:dataExpense.dateCombos,
    } 
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
      this.afst.collection('dateExpenese').doc(dateExpeneseId).set(dates).then(()=>{

        console.log(result);
        loading.dismiss();
        this.expenseForm.reset();
        this.navCtrl.setRoot(EgresosAnualesPage);
        this.presentToast("Egresos Guardados.");
      })    

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
