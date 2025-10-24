import { Component  } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MenuComponent } from './componentes/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./componentes/footer/footer.component";
import { SpinnerComponent } from './componentes/spinner/spinner.component';
import { LoadingService } from './servicio/loading.service';
import { Observable } from 'rxjs';
import { ToastComponent } from './componentes/toast/toast.component';
import { delay } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, MenuComponent, FooterComponent, SpinnerComponent,ToastComponent ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ // cuando aparece
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [ // cuando desaparece
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class AppComponent {

  
  title = 'Clinica';
  isLoading$: Observable<boolean>;

  constructor(private router: Router, private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$.pipe(delay(0));

    if (event instanceof NavigationStart) {
      console.log('NavigationStart');
      this.loadingService.show();
        } else if (event instanceof NavigationEnd) {
          console.log('✅ NavigationEnd');
          this.loadingService.hide();
        } else if (event instanceof NavigationCancel) {
          console.warn('⚠️ NavigationCancel');
          this.loadingService.hide();
        } else if (event instanceof NavigationError) {
          const navError = event as NavigationError;
        console.error('❌ NavigationError', navError.error);
        this.loadingService.hide();
    }
    this.router.events.subscribe(event => {
  console.log('➡️ Evento de navegación:', event);

  if (event instanceof NavigationStart) {
    console.log('🚦 NavigationStart');
    this.loadingService.show();
  } else if (event instanceof NavigationEnd) {
    console.log('✅ NavigationEnd');
    this.loadingService.hide();
  } else if (event instanceof NavigationCancel) {
    console.warn('⚠️ NavigationCancel',event);
    this.loadingService.hide();
  } else if (event instanceof NavigationError) {
    const navError = event as NavigationError;
    console.error('❌ NavigationError', navError.error);
    this.loadingService.hide();
  }
});
  }
}