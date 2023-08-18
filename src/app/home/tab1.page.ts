import {Component, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from "../services/database.service";
import {Pop} from "../../datatypes/pop";
import {first, from, last, lastValueFrom, Observable} from "rxjs";
import {AuthService} from "../services/auth.service";
import {AlertController, IonModal} from "@ionic/angular";
import {Camera, CameraResultType} from "@capacitor/camera";
import {storageService} from "../services/storage.service";

@Component({
  selector: 'app-home',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  @ViewChild(IonModal) modal!:IonModal;
  newPop: Pop = {} as Pop;
  image: Uint8Array = new Uint8Array(0);
  pops: Pop[];
  popListObservable: Observable<Pop[]> = from([]);
  popLikedListObservable: Observable<Pop[]> = from([]);
  popCollectedListObservable: Observable<Pop[]> = from([]);
  verticalFabPosition: ('bottom' | 'top') = 'bottom';
  fabIsVisible = true;

  constructor(public databaseService: DatabaseService, public authService: AuthService, private alertController: AlertController) {

  }

  async ngOnInit(){
    const account = this.authService.getUserUID()
    this.popLikedListObservable = await this.databaseService.retrieveLikedList(`${account}`);
    this.popCollectedListObservable = await this.databaseService.retrieveCollectedList(`${account}`);
    this.popListObservable = await this.databaseService.retrievePopList("popList");
  }

  // logScrollStart(): void {
  //   this.fabIsVisible = false;
  // }
  //
  // logScrollEnd(): void {
  //   setTimeout(() => this.fabIsVisible = true, 1500);
  // }

  // async presentAlert(): Promise<void> {
  //   const alert = await this.alertController.create({
  //     header: 'Add a new Pop',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary'
  //       }, {
  //         text: 'OK',
  //         handler: (inputs) => {
  //           let enteredURL = inputs.image;
  //           const isValidURL = this.isURL(enteredURL);
  //           if (isValidURL && inputs.title !== "" && enteredURL !== "" && inputs.series !== ""){
  //               return this.createPop(inputs.title, enteredURL, inputs.series, inputs.image);
  //           } else if (inputs.title !== "" && enteredURL !== "" && inputs.series !== ""){
  //             enteredURL = "https://i.pinimg.com/564x/b2/28/6b/b2286be975fff58ddd88d1e845735977.jpg"
  //             return this.createPop(inputs.title, enteredURL, inputs.series, inputs.image);
  //           }
  //         }
  //       },
  //       {
  //         text: 'Take picture',
  //         handler: async (inputs) => {
  //           inputs.image = await Camera.getPhoto({
  //             allowEditing: false,
  //             resultType: CameraResultType.Base64
  //           })
  //         }
  //       }
  //     ],
  //     inputs: [
  //       {
  //         name: 'title',
  //         type: 'text',
  //         placeholder: 'Pop title'
  //       },
  //       {
  //         name: 'image',
  //         type: 'text',
  //         placeholder: 'Pop image'
  //       },
  //       {
  //         name: 'series',
  //         type: 'text',
  //         placeholder: 'Pop series'
  //       }
  //     ]
  //   });
  //
  //   await alert.present();
  // }

  isURL(input: string): boolean {
    const urlPattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,})(\/\S*)?$/i;
    return urlPattern.test(input);
  }

  async createPop(title:string, data: Uint8Array, series: string[]) {
    await this.databaseService.sendPopToPopList("popList", title, series, data);
  }
  async TakePicture(){
    let image = await Camera.getPhoto({
      allowEditing: false,
      height: 600,
      width: 600,
      resultType: CameraResultType.Base64
    })
    if (image.base64String !== null){
      let bin = atob(image.base64String)
      let b = new Uint8Array(bin.length)
      console.log(b);
      for (let i = 0; i < bin.length; i++){
        b[i] = bin.charCodeAt(i)
      }
      this.image = b;
    }
  }
  ConfirmPop(){
    if (this.newPop.title !== undefined && this.newPop.series !== undefined){
      this.modal.dismiss(this.newPop, 'confirm')
    }
  }
  CancelPop(){
    this.modal.dismiss(null, 'cancel')
    this.newPop = {} as Pop;
  }
  async OnWillDismiss(ev: Event){
    let event = (ev as CustomEvent).detail
    if(event.role == 'confirm'){
      let data = event.data
      if (this.image.length !== 0){
        await this.createPop(this.newPop.title, this.image, this.newPop.series)
      } else {
        await this.createPop(this.newPop.title, new Uint8Array(0), this.newPop.series)
      }
      this.newPop = {} as Pop;
    }
  }
}
