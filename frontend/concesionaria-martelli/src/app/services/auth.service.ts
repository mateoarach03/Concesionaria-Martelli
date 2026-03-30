import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AuthUser {
  id: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  private userSubject = new BehaviorSubject<AuthUser | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Obtener sesión existente
      const { data: { session } } = await this.supabase.auth.getSession();
      this.sessionSubject.next(session);
      
      if (session?.user) {
        this.userSubject.next({
          id: session.user.id,
          email: session.user.email || ''
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }

    // Escuchar cambios de autenticación
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.sessionSubject.next(session);
      if (session?.user) {
        this.userSubject.next({
          id: session.user.id,
          email: session.user.email || ''
        });
      } else {
        this.userSubject.next(null);
      }
    });
  }

  // Observable de sesión
  get session$(): Observable<Session | null> {
    return this.sessionSubject.asObservable();
  }

  // Observable del usuario autenticado
  get user$(): Observable<AuthUser | null> {
    return this.userSubject.asObservable();
  }

  // Obtener usuario actual de forma síncrona
  getCurrentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  // Obtener sesión actual de forma síncrona
  getCurrentSession(): Session | null {
    return this.sessionSubject.value;
  }

  // Login con email y password
  async login(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error?.message || 'Error al iniciar sesión'
      };
    }
  }

  // Logout
  async logout() {
    try {
      await this.supabase.auth.signOut();
      this.sessionSubject.next(null);
      this.userSubject.next(null);
      return { error: null };
    } catch (error: any) {
      return { error: error?.message || 'Error al cerrar sesión' };
    }
  }

  // Verificar si está logueado
  isLoggedIn(): boolean {
    return this.sessionSubject.value !== null;
  }

  // Verificar si es admin (en este caso, cualquier usuario autenticado es admin)
  isAdmin(): boolean {
    return this.isLoggedIn();
  }

  // Obtener token de acceso
  getAccessToken(): string | null {
    return this.sessionSubject.value?.access_token || null;
  }
}
