import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { AppNavComponent } from './components/app-nav';

@Component({
  selector: 'ui-root',
  standalone: true,
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, MatSidenavModule, AppNavComponent],
})
export class AppComponent {
  title = 'moneytool-ui';

  constructor(public matIconRegistry: MatIconRegistry) {
    matIconRegistry.setDefaultFontSetClass('fas');
  }
}
