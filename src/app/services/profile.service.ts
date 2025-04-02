import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080';  

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/user/me`, { withCredentials: true });
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/user/me`, profileData);
  }
}
