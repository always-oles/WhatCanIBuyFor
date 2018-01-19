import { environment } from '../../../environments/environment';

let API_URL: string;

if (environment.production) {
    API_URL = 'https://whatcanibuyfor.in/api/';
} else {
    API_URL = 'http://localhost:3000/api/';
}

export { API_URL };
