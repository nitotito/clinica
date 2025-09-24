import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MenuComponent } from './componentes/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./componentes/footer/footer.component";
import { SpinnerComponent } from './componentes/spinner/spinner.component';
import { LoadingService } from './servicio/loading.service';
import { Observable } from 'rxjs';
import { ToastComponent } from './componentes/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, MenuComponent, FooterComponent, SpinnerComponent,ToastComponent]
})
export class AppComponent {

  
  title = 'Clinica';
  isLoading$: Observable<boolean>;

  constructor(private router: Router, private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('NavigationStart');
        this.loadingService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
         console.log('NavigationEnd/Cancel/Error');
        this.loadingService.hide();
      }
    });
  }
}