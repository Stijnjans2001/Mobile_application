import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CardComponent } from './card/card.component';
import {RouterLink} from "@angular/router";

@NgModule({
  declarations: [CardComponent],
  exports: [CardComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterLink
  ]
})
export class SharedModule { }
