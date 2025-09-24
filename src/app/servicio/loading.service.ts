import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  
  show() {
     console.log('Spinner ON');
    this._loading.next(true);
  }

  hide() {
    console.log('Spinner OFF');
    this._loading.next(false);
  }
}
