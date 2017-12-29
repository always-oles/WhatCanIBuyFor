import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../config';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class DataService {
    private products = new Subject<any>();

    constructor(private http: HttpClient) {}

    public requestProducts(formData) {
        this.http
            .post(API_URL + 'whatElseCanIGet', formData)
            .subscribe(data => {
                console.warn(data);
                this.products.next(data);
            });
    }

    public getProducts(): Observable<any> {
        return this.products.asObservable();
    }
}
