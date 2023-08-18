import { Component, OnInit } from '@angular/core';
import {from, Observable} from "rxjs";
import {Pop} from "../../datatypes/pop";
import {DatabaseService} from "../services/database.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit {
  popCollectedListObservable: Observable<Pop[]> = from([]);

  constructor(public databaseService: DatabaseService, public authService: AuthService) {
    const account = this.authService.getUserUID()
    this.popCollectedListObservable = databaseService.retrieveCollectedList(`${account}`);
  }
  ngOnInit() {
  }

}
