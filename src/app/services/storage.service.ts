import {Injectable} from "@angular/core";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})

export class storageService{
  storage = getStorage()
  constructor() {

  }
  sendPopPicToDatabase(data: Uint8Array, id: string){
    uploadBytes(ref(this.storage, 'FunkoPopsPics/'+id), data, {contentType:'image/jpeg'})
  }
  async getPopPicFromDatabase(id: string) {
    try {
      return await getDownloadURL(ref(this.storage, 'FunkoPopsPics/'+id))
        .then(url => {
          return url
        })
      }
      catch (e){
        return "https://i.pinimg.com/564x/b2/28/6b/b2286be975fff58ddd88d1e845735977.jpg"
      }
    }
  }

