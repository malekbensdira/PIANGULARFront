import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:8084';
  private apiUrl = `${this.baseUrl}/transactions`;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les transactions
  getAllTransactions(): Observable<Transaction[]> {
    console.log('Fetching all transactions from:', this.apiUrl);
    return this.http.get<Transaction[]>(this.apiUrl).pipe(
      catchError(this.handleError)  // Gestion des erreurs
    );
  }

  // Récupérer une transaction par ID
  getTransactionById(id: number): Observable<Transaction> {
    const url = `${this.apiUrl}/${id}`; // Utilisation de /transactions/{id}
    console.log('Fetching transaction from:', url);
    return this.http.get<Transaction>(url).pipe(
      catchError(this.handleError)  // Gestion des erreurs
    );
  }

  createTransaction(transaction: any): Observable<any> {
    const url = `${this.apiUrl}/create`;
    console.log('Creating transaction at:', url);
    console.log('Transaction data:', transaction);
    return this.http.post<any>(url, transaction).pipe(
      tap(response => {
        console.log('Create response:', response);
      }),
      catchError(this.handleError)
    );
  }
  
  // Mettre à jour une transaction
  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    const url = `${this.apiUrl}/update/${id}`; 
    console.log('Updating transaction at:', url);
    console.log('Update data:', transaction);
    return this.http.patch<Transaction>(url, transaction, {
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('Update response:', response);
      }),
      map(response => response.body as Transaction),
      catchError(this.handleError)  // Gestion des erreurs
    );
  }

  // Supprimer une transaction
  deleteTransaction(id: number): Observable<void> {
    const url = `${this.apiUrl}/delete/${id}`;
    console.log('Deleting transaction at:', url);
    return this.http.delete(url, { observe: 'response' })
      .pipe(
        tap(response => {
          console.log('Delete response:', response);
        }),
        map(() => undefined),
        catchError(this.handleError)  // Gestion des erreurs
      );
  }

  // Gestion des erreurs HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);  // Propagation de l'erreur
  }
}
