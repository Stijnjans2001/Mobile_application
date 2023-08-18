import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Pop} from "../../../datatypes/pop";
import {DatabaseService} from "../../services/database.service";
import {ActionSheetController, AlertController, IonModal} from "@ionic/angular";
import {from, Observable} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {storageService} from "../../services/storage.service";
import {Camera, CameraResultType} from "@capacitor/camera";

@Component({
  selector: 'app-pop',
  templateUrl: './pop.page.html',
  styleUrls: ['./pop.page.scss'],
})
export class PopPage implements OnInit {
  @ViewChild(IonModal) modal!:IonModal;
  newPop: Pop = {} as Pop
  id: string
  params: any
  retrievedPop: Pop = new Pop("", [""], "", "")
  currentYear:number = new Date().getFullYear();
  title: string;
  image: string;
  newImage: Uint8Array = new Uint8Array(0);
  popLikedListObservable: Observable<Pop[]> = from([]);
  @Input() liked : boolean = false
  @Input() collected : boolean = false

  constructor(private router: Router, private actionSheetCtrl: ActionSheetController, private alertController: AlertController, private route: ActivatedRoute, private dbService: DatabaseService, public authService: AuthService, public storageService: storageService, public activatedRoute: ActivatedRoute) {
    this.params = this.route.params.subscribe(async params => {
      this.id = params["id"]
      await this.retrievePop(this.id)
    })
    const account = this.authService.getUserUID()
    this.popLikedListObservable = this.dbService.retrieveLikedList(`${account}`);
  }

  async ngOnInit() {
    if (this.retrievedPop.image === ""){
      this.image = await this.storageService.getPopPicFromDatabase(this.id)
    }
  }

  async retrievePop(popId: string) {
    this.dbService.retrievePopList("popList").subscribe(x => {
      this.retrievedPop = x.find(y => y.id == popId)
    })
  }

  handleImageError() {
    this.retrievedPop.image = 'https://i.pinimg.com/564x/b2/28/6b/b2286be975fff58ddd88d1e845735977.jpg';
  }

  async presentActionSheet(): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => this.deletePop()
        },
      ],
    });

    await actionSheet.present();
  }

  // async presentUpdateSheet(): Promise<void> {
  //   const alert = await this.alertController.create({
  //     header: 'Update this Pop',
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
  //           if (isValidURL && inputs.title !== "" && enteredURL !== "" && inputs.series !== "") {
  //               return this.updatePop(inputs.title, enteredURL, inputs.series);
  //           } else if (inputs.title !== "" && enteredURL !== "" && inputs.series !== "") {
  //             enteredURL = "https://i.pinimg.com/564x/b2/28/6b/b2286be975fff58ddd88d1e845735977.jpg"
  //             return this.updatePop(inputs.title, enteredURL, inputs.series);
  //           }
  //         }
  //       }
  //     ],
  //     inputs: [
  //       {
  //         name: 'title',
  //         type: 'text',
  //         value: this.retrievedPop.title,
  //         placeholder: 'Pop title'
  //       },
  //       {
  //         name: 'image',
  //         type: 'text',
  //         value: this.retrievedPop.image,
  //         placeholder: 'Pop image'
  //       },
  //       {
  //         name: 'series',
  //         type: 'text',
  //         value: this.retrievedPop.series,
  //         placeholder: 'Pop series'
  //       }
  //     ]
  //   });
  //
  //   await alert.present();
  // }

  async updatePop(title:string, image: string, series: string[]): Promise<void> {
    let pop = new Pop(this.retrievedPop.id, series, title, image)
    await this.dbService.updatePop("popList", "", pop.id, pop, this.newImage).then(() => {
      this.router.navigateByUrl(`/pop/`+ pop.id);
    })

  }

  async deletePop(): Promise<void> {
    if (!this.retrievedPop?.id) {
      return;
    }
    await this.router.navigateByUrl('/tabs/home');
    await this.dbService.deletePop("popList", "", this.retrievedPop.id);
  }

  isURL(input: string): boolean {
    const urlPattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,})(\/\S*)?$/i;
    return urlPattern.test(input);
  }

  async toggleLike(pop: Pop){
    if (this.liked == true){
      await this.dislikePop(pop)
    }
    else {
      await this.likePop(pop)
    }
    this.liked = !this.liked
  }

  async toggleCollected(pop: Pop){
    if (this.collected == true){
      await this.discollectPop(pop)
    }
    else {
      await this.collectedPop(pop)
    }
    this.collected = !this.collected
  }

  async likePop(pop: Pop) {
    await this.dbService.sendPopToLikedList(pop)
  }

  async collectedPop(pop: Pop) {
    await this.dbService.sendPopToCollectionList(pop)
  }

  async dislikePop(pop:Pop) : Promise<void> {
    const account = this.authService.getUserUID();
    if (!pop?.id) {
      return;
    }
    await this.dbService.deletePop("likedPops_", `${account}`, `${pop.id}`)
  }

  async discollectPop(pop: Pop) : Promise<void> {
    const account = this.authService.getUserUID();
    if (!pop?.id) {
      return;
    }
    await this.dbService.deletePop("collectedPops_", `${account}`, `${pop.id}`)
  }

  async TakePicture(){
    let image = await Camera.getPhoto({
      allowEditing: false,
      resultType: CameraResultType.Base64
    })
    if (image.base64String !== null){
      let bin = atob(image.base64String)
      let b = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++){
        b[i] = bin.charCodeAt(i)
      }
      this.newImage = b;
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
    this.newImage = new Uint8Array(0);
  }
  async OnWillDismiss(ev: Event){
    let event = (ev as CustomEvent).detail
    if (event.role == 'confirm'){
      let data = event.data
      if (this.newImage.length == 0){
        await this.updatePop(this.newPop.title, this.retrievedPop.image, this.newPop.series)
      } else {
        await this.updatePop(this.newPop.title, "", this.newPop.series)
        await this.storageService.sendPopPicToDatabase(data, this.retrievedPop.id)
      }
      this.router.navigate(['tabs/home'])
      this.newPop = {} as Pop;
      this.newImage = new Uint8Array(0);
    }
  }
}
