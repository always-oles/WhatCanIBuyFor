import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MainFormComponent } from './main-form/main-form.component';
import { RecentOptionsComponent } from './recent-options/recent-options.component';
import { ResultFormComponent } from './result-form/result-form.component';
import { GlobalAnimationStateService } from './services/global-animation-state.service';
import { DataService } from './services/data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { HttpClientModule } from '@angular/common/http';
import { TooltipImageDirective } from './directives/tooltip-image.directive';

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    RecentOptionsComponent,
    ResultFormComponent,
    OnlyNumberDirective,
    TooltipImageDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    GlobalAnimationStateService,
    DataService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
