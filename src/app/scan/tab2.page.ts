import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-scan',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor() {
    if (Capacitor.isNativePlatform()){
      this.askUser();
    }
  }
  checkPermission = async () => {
    // check or request permission
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (status.granted) {
      // the user granted permission
      return true;
    }

    return false;
  };

  startScan = async () => {
    let permission = await this.checkPermission();
    if (permission === true){
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();
      console.log(result);
      if (result.hasContent) {
        console.log(result.content);
      }
    }
  };

  askUser = () => {
    const c = confirm('Do you want to scan a barcode?');

    if (c) {
      document.querySelector('body').classList.add('scanner-active');
      this.startScan();
      document.querySelector('body').classList.remove('scanner-active');
    }
  };
}
