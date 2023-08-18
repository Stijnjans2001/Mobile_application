import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Pop} from "../../../datatypes/pop";
import {DatabaseService} from "../../services/database.service";
import {AuthService} from "../../services/auth.service";
import {first, from, Observable} from "rxjs";
import {storageService} from "../../services/storage.service";

@Component({
  selector: 'app-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss'],
})

export class CardComponent implements OnInit {
  image!: string
  @Input() liked : boolean = false
  @Input() collected : boolean = false

  @Input() pop: Pop = {
    id: "",
    image: "",
    title: "",
    series: []
  };

  popListObservable: Observable<Pop[]> = from([]);
  popLikedListObservable: Observable<Pop[]> = from([]);
  popCollectedListObservable: Observable<Pop[]> = from([]);

  constructor(public databaseService: DatabaseService, public authService: AuthService, public activatedRoute: ActivatedRoute, public router: Router, private storageService: storageService) {
    this.popListObservable = databaseService.retrievePopList("popList");
    const account = this.authService.getUserUID()
    this.popLikedListObservable = databaseService.retrieveLikedList(`${account}`);
    this.popCollectedListObservable = databaseService.retrieveCollectedList(`${account}`);
  }

  async ngOnInit() {
    if (this.pop.image === ""){
      this.image = await this.storageService.getPopPicFromDatabase(this.pop.id)
    }
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
    await this.databaseService.sendPopToLikedList(pop)
  }

  async collectedPop(pop: Pop) {
    await this.databaseService.sendPopToCollectionList(pop)
  }

  async dislikePop(pop:Pop) : Promise<void> {
    const account = this.authService.getUserUID();
    if (!pop?.id) {
      return;
    }
    await this.databaseService.deletePop("likedPops_", `${account}`, `${pop.id}`)
  }

  async discollectPop(pop: Pop) : Promise<void> {
    const account = this.authService.getUserUID();
    if (!pop?.id) {
      return;
    }
    await this.databaseService.deletePop("collectedPops_", `${account}`, `${pop.id}`)
  }
}
