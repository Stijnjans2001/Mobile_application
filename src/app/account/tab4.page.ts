import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})

export class Tab4Page implements OnInit {

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
  }
}
