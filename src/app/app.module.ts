import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MainFormComponent } from './main-form/main-form.component';
import { RecentOptionsComponent } from './recent-options/recent-options.component';

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    RecentOptionsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
