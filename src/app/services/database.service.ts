import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {Pop} from "../../datatypes/pop";
import {
  collection,
  CollectionReference, doc,
  Firestore, DocumentReference, query, deleteDoc, collectionData, setDoc, getDoc, addDoc, updateDoc
} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {storageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private authService: AuthService, public fireStore: Firestore, private storageService: storageService) {
  }

  getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.fireStore, collectionName) as CollectionReference<T>;
  }

  getDocumentRef<T>(collectionName: string, id: string): DocumentReference<T> {
    return doc(this.fireStore, `${collectionName}/${id}`) as DocumentReference<T>;
  }

  retrieveLikedList(account: string): Observable<Pop[]> {
    const likes = collectionData<Pop>(
      query<Pop>(
        this.getCollectionRef(`likedPops_${account}`)
      ),
      {idField: 'id'}
    );
    return likes;
  }

  retrieveCollectedList(account: string): Observable<Pop[]> {
    const collection = collectionData<Pop>(
      query<Pop>(
        this.getCollectionRef(`collectedPops_${account}`)
      ),
      {idField: 'id'}
    );
    return collection;
  }

  retrievePopList(listName: string): Observable<Pop[]> {
    return collectionData<Pop>(
      query<Pop>(
        this.getCollectionRef(listName)
      ),
      {idField: 'id'}
    )
  }

  async sendPopToLikedList(pop: Pop): Promise<void> {
    const account = this.authService.getUserUID();
    if (account != undefined) {
      const popdocref = doc(
        this.getCollectionRef<Pop>(`likedPops_${account}`),
        pop.id
      )
      await setDoc(
        popdocref, pop
      )
    }
  }

  async deletePop(list: string, account: string, id: string): Promise<void> {
    await deleteDoc(this.getDocumentRef(`${list}${account}`, id))
  }

  async updatePop(list: string, account: string, id: string, pop:Pop, data: Uint8Array): Promise<void> {
    const updatePop = {
      title: pop.title,
      image: pop.image,
      series: pop.series
    };
    await this.storageService.sendPopPicToDatabase(data, id)
    await updateDoc(this.getDocumentRef(`${list}${account}`, id), updatePop)

  }

  async sendPopToCollectionList(pop: Pop): Promise<void> {
    const account = this.authService.getUserUID();
    if (account != undefined) {
      const popdocref = doc(
        this.getCollectionRef<Pop>(`collectedPops_${account}`),
        pop.id
      )
      await setDoc(
        popdocref, pop
      )
    }
  }

  async sendPopToPopList(list: string, title: string, series: string[], data: Uint8Array): Promise<void> {
    const account = this.authService.getUserUID();
    if (account != undefined) {
      let newPop = {
        title: title,
        image: "",
        series: series
      };
      if (data.length === 0){
        newPop.image = "https://i.pinimg.com/564x/b2/28/6b/b2286be975fff58ddd88d1e845735977.jpg"
      }
      let pop = await addDoc(
        this.getCollectionRef<Pop>(list),
        newPop
      );
      if (data.length !== 0){
        await this.storageService.sendPopPicToDatabase(data, pop.id)
      }
      await updateDoc(pop, "id", pop.id);
    }
  }
}
