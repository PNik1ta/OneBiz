import { Injectable } from "@angular/core";

// register.service.ts
@Injectable({ providedIn: 'root' })
export class RegisterService {
  openRegisterFn: (() => void) | null = null;

  openRegister() {
    if (this.openRegisterFn) {
      this.openRegisterFn();
    }
  }
}
