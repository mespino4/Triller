import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService)
  const routerService = inject(Router)

  return accountService.currentUser$.pipe(
    map(user =>{
      if(user) return true;
      else{
        toastr.error('you shall not pass');
        routerService.navigateByUrl('/')
        return false;
      }
    })
  )
};