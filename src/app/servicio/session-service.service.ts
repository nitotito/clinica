import { Injectable } from '@angular/core';
import { Usuario } from '../entidades/Usuario';

@Injectable({
  providedIn: 'root'
})
export class SessionServiceService {
  private _user: Usuario | null = null;

  setUser(user: Usuario) {
    this._user = user;
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): Usuario | null {
    if (this._user) return this._user;
    const stored = sessionStorage.getItem('user');
    if (stored) {
      this._user = JSON.parse(stored);
      return this._user;
    }
    return null;
  }
}
