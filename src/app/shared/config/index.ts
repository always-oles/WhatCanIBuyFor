import { isDevMode } from '@angular/core';

let API_URL: string;

if (isDevMode()) {
    API_URL = 'http://localhost:3000/api/';
} else {
    API_URL = 'http://whatcanibuyfor.in/api/';
}

export { API_URL };
