import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase,FirebaseListObservable } from "angularfire2/database";
import 'rxjs/add/operator/map';
import firebase from 'firebase/app'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  nick:string;
  message:string;
  messages:Array<any>;
  constructor(private navCtrl: NavController,private alertCtrl: AlertController,private storage: Storage,public loadingCtrl: LoadingController, private db: AngularFireDatabase) {

  }
  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();
    this.storage.get('nick').then(nick=>{
      if(!nick)this.showPrompt();
      else this.nick=nick;
      loading.dismiss();
    })
    this.getMessages()
  }
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'NICK',
      message: "Escribe tu nick para comenzar a chatear.",
      inputs: [
        {
          value: this.nick,
          name: 'nick',
          placeholder: 'Nick'
        },
      ],
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
            let inputNick:string=data.nick;
            if(inputNick.length>2 && inputNick.length<20){
              this.storage.set('nick',inputNick.toLocaleLowerCase()).then(res=>{
                this.nick=inputNick.toLocaleLowerCase();
              });
            }
            else return false;
          }
        }
      ],
      enableBackdropDismiss:false
    });
    prompt.present();
  }
  send(){

    let message={
      text: this.message,
      nick: this.nick,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }
    this.messages.push(message);
    this.message=null;
  }
  getMessages(){
    console.log('GET');
    
   this.db.list('/messages').subscribe(messages=>{
      this.messages=messages.sort((a,b)=>{
        if(a<b) return -1;
        else return 1;
      })
    });

  }
}
