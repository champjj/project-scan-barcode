import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceDataDialogService {
  private showCase = new BehaviorSubject<number>(0);
  showCase$ = this.showCase.asObservable();

  constructor() {}

  setShowCase(caseNumber: number) {
    this.showCase.next(caseNumber);
  }
}
