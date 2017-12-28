import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GlobalAnimationStateService {
  private subject = new Subject<any>();

  public setAnimationState(state) {
    this.subject.next({ state: state });
  }

  public getAnimationState(): Observable<any> {
    return this.subject.asObservable();
  }

  constructor() { }

}
