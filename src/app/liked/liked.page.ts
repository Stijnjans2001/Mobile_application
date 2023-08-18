import { Component, OnInit } from '@angular/core';
import {from, Observable} from "rxjs";
import {Pop} from "../../datatypes/pop";
import {DatabaseService} from "../services/database.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-collection',
  templateUrl: 'liked.page.html',
  styleUrls: ['liked.page.scss'],
})
export class LikedPage implements OnInit {
  popLikedListObservable: Observable<Pop[]> = from([]);

  constructor(public databaseService: DatabaseService, public authService: AuthService) {
    const account = this.authService.getUserUID()
    this.popLikedListObservable = databaseService.retrieveLikedList(`${account}`);
  }

  ngOnInit(): void {
  }
}
