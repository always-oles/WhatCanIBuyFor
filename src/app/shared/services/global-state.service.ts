import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GlobalStateService {
  private subject = new Subject<any>();

  public set(state) {
    console.warn('state is:', state);
    this.subject.next(state);
  }

  public get(): Observable<any> {
    return this.subject.asObservable();
  }
}
