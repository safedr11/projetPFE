import { Injectable } from '@angular/core';
import { HttpClient , HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../user.model';

@Injectable({
  providedIn: 'root' // Fournit le service au niveau global
})
export class UsersService {
  private apiUrl = 'http://localhost:8080/admin';
  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}/all`);
  }

  toggleUserStatus(id: number): Observable<UserModel> {
    return this.http.patch<UserModel>(`${this.apiUrl}/toggle-status/${id}`, {});
  }




  filterUsers(active?: boolean, role?: string): Observable<UserModel[]> {
    let params = new HttpParams();
    if (active !== undefined) params = params.set('active', active.toString());
    if (role) params = params.set('role', role);
    
    return this.http.get<UserModel[]>(`${this.apiUrl}/filter`, { params });
  }
  updateUser(id: number, data: Partial<UserModel>): Observable<UserModel> {
    return this.http.patch<UserModel>(`${this.apiUrl}/maj/${id}`, data);
  }
  createUser(data: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}/createUser`, data);
  }
}
