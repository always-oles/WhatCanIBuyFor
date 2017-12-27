import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MainFormComponent } from './main-form/main-form.component';
import { RecentOptionsComponent } from './recent-options/recent-options.component';
import { ResultFormComponent } from './result-form/result-form.component';
import { GlobalAnimationStateService } from './services/global-animation-state.service';

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    RecentOptionsComponent,
    ResultFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [
    GlobalAnimationStateService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
