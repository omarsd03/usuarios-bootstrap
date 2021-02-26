import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private base_url = environment.base_url;

  constructor(private http: HttpClient) { }

  obtenerUsuarios() {
    return this.http.get(`${this.base_url}`);
  }

  postearUsuario(jsonData: any) {
    return (jsonData.id === "" || jsonData.id === null || jsonData.id === undefined) ? this.http.post(`${this.base_url}`, jsonData) : this.http.put(`${this.base_url}/${jsonData.id}`, jsonData);
  }

}
