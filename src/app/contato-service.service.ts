import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Contato } from '../contato';

@Injectable({
  providedIn: 'root'
})
export class ContatoServiceService {
  private readonly baseUrl = 'http://addressbookbe.duckdns.org/contato';
  apiUrl = 'http://addressbookbe.duckdns.org/contato';
  constructor(private http: HttpClient) { }

getAll(): Observable<Contato[]> {
  return this.http.get<Contato[]>(this.apiUrl)
}

getById(id: number): Observable<Contato> {
  return this.http.get<Contato>(`${this.baseUrl}/${id}`);
}

save(contato: Contato): Observable<Contato> {
  return this.http.post<Contato>(this.apiUrl, contato).pipe(
    catchError((error: HttpErrorResponse) => {
    (error.status === 400 && error.error.includes("Já existe um contato com este número")) 
   return throwError(() => 'Já existe um contato com este número.');
})
);
}

delete (contato:Contato): Observable < void> {
  return this.http.delete<void>(`${this.apiUrl}/${contato.id}`);
}

update(contato: Contato): Observable < Contato > {
  return this.http.put<Contato>(`${this.apiUrl}/${contato.id}`, contato);
}

buscarPorTermo(termo: string): Observable < Contato[] > {
  return this.http.get<Contato[]>(`${this.apiUrl}/buscar?termo=${termo}`);
}

getAllOrdenado(sort: string): Observable < Contato[] > {
  const params = new HttpParams().set('sort', sort);
  return this.http.get<Contato[]>(`${this.apiUrl}/ordenado-fullname`, { params });
}

getAllFavoritosOrdenado(sort: string): Observable < Contato[] > {
  const params = new HttpParams().set('sort', sort);
  return this.http.get<Contato[]>(`${this.apiUrl}/favoritos`, { params });
}
}
