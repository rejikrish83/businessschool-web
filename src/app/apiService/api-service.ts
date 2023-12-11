import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your-access-token',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    })
  };

  // Function to make a POST request
  postData(data: any): Observable<any> {
    console.log(data)
    return this.http.post(`${this.apiUrl}v1/search/`, data,this.httpOptions);
  }

  postMessageToTopic(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/publish`, data,this.httpOptions);
  }

  getUserData(userId:string): Observable<any> {
    // Implement your service logic here
    return this.http.get<any>(`${this.apiUrl}/courseModule/`+userId);
  }

  getKpiReportData(userId : string, date_str : string, role  : string, dataType  : string,moduleId  : string): Observable<any> {
    // Construct the parameters
    let params = new HttpParams()
      .set('userId', userId )
      .set('date_str', date_str )
      .set('role', role )
      .set('dataType', dataType )
      .set('moduleId', moduleId );

    // Make the HTTP request
    return this.http.get<any>(`${this.apiUrl}/getKpiData`, {params});
  }

  getKpiTypeData(moduleId:string): Observable<any> {
    let params = new HttpParams()
    .set('moduleId', moduleId );
    // Implement your service logic here
    return this.http.get<any>(`${this.apiUrl}/getUniqueKpi`,{params});
  }
}

