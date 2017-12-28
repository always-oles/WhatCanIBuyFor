import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../config';

@Injectable()
export class DataService {
    constructor(private http: HttpClient) {}

    public getProducts(formData) {
        this.http
            .post(API_URL + 'whatElseCanIGet', formData)
            .subscribe(data => console.warn(data));
    }
}
