import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GlobalAnimationStateService {
  private subject = new Subject<any>();

  public set(state) {
    console.warn('global animation set to: ', state);
    this.subject.next(state);
  }

  public get(): Observable<any> {
    return this.subject.asObservable();
  }
}
