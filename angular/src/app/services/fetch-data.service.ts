import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FetchDataService {
  constructor(private http: HttpClient) {}

  getData(apiUrl: string) {
    return this.http.get(apiUrl);
  }
  createData(apiUrl: string, endPoint: string, data: any) {
   return  this.http.post(apiUrl + endPoint, data)
  
  }
  deleteData(apiUrl: string, endPoint: string, id: number) {
    return this.http
      .delete(apiUrl + endPoint + id, {
        observe: 'body',
        responseType: 'json',
      })

  }
  editData(apiUrl: string, endPoint: string, id: number): Observable<any> {
    return this.http.get(apiUrl + endPoint + id);
  }
  updateData(apiUrl: string, endPoint: string, id: string, data: any) {
    return this.http.put(apiUrl + endPoint + id, data, {
      observe: 'body',
      responseType: 'json',
    });
  }
}
