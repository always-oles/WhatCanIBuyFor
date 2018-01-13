import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../config';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Product } from '../interfaces/';

@Injectable()
export class DataService {
    private products = new Subject<any>();
    private lastSearch = new Subject<any>();
    constructor(private http: HttpClient) {}

    public requestProducts(formData) {

        // save search product name
        this.lastSearch.next(formData.product);

        // get data from backend
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

    public getLastSearch(): Observable<any> {
        return this.lastSearch.asObservable();
    }

    public voteForRemoval(item: Product): void {
        this.http
            .post(API_URL + 'voteForRemoval', {
                id: item.id,
                title: item.title
            }).subscribe();
    }
}
