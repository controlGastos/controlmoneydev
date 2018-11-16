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
          combos:[]
        });
  }

  ionViewDidLoad() {
    this.services = [
      {title:"Agua",icon:'water', controlName:'water'},
      {title:"Electricidad",icon:'bulb', controlName:'electricity'},
      {title:"Telefonia",icon:'call', controlName:'homePhone'},
      {title:"Celular",icon:'phone-portrait', controlName:'cellPhone'},
      {title:"Televisión",icon:'desktop', controlName:'tv'},
      {title:"Combos",icon:'logo-buffer', controlName:'combos'},
    ];
    console.log('ionViewDidLoad EgresosPage');
  }

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
      this.navCtrl.setRoot(EgresosAnualesPage);
      this.presentToast("Egresos Guardados.");
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
