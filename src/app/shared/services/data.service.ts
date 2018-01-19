import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../config';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Product } from '../interfaces/';

@Injectable()
export class DataService {
    private products = new Subject<any>();
    private suggestions = new Subject<any>();
    private lastSearch = new Subject<any>();
    constructor(private http: HttpClient) { }

    /**
     * Get recent better options from backend
     */
    public getSuggestions(): Observable<any> {
        this.http
            .get(API_URL + 'suggestions')
            .subscribe(data => {
                this.suggestions.next(data);
            });

        return this.suggestions.asObservable();
    }

    /**
     * Request products from backend
     * @param formData - main form fields
     */
    public requestProducts(formData: any): void {

        // save search product name
        this.lastSearch.next(formData);

        // send request to backend
        this.sendProductsRequest(formData);
    }

    /**
     * Helper function that can be called from outside
     * to repeat initial form sending and get another data
     */
    public sendProductsRequest(formData: any): void {
        this.http
            .post(API_URL + 'whatElseCanIGet', formData)
            .subscribe(data => {
                this.products.next(data);
            });
    }

    /**
     * Send request to vote for item removal
     * @param item item that being voted
     */
    public voteForRemoval(item: Product): void {
        this.http
            .post(API_URL + 'voteForRemoval', {
                id: item.id,
                title: item.title
            }).subscribe();
    }

    /**
     * Subscription to products
     */
    public getProducts(): Observable<any> {
        return this.products.asObservable();
    }

    /**
     * Subscription to last search data
     */
    public getLastSearch(): Observable<any> {
        return this.lastSearch.asObservable();
    }
}