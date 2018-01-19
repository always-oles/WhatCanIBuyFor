import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MainFormComponent } from './main-form/main-form.component';
import { ResultsComponent } from './results/results.component';
import { GlobalStateService } from './shared/services/global-state.service';
import { DataService } from './shared/services/data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { OnlyNumberDirective } from './shared/directives/only-number.directive';
import { HttpClientModule } from '@angular/common/http';
import { TooltipImageDirective } from './shared/directives/tooltip-image.directive';
import { HidePreviewOnClickDirective } from './shared/directives/hide-preview-on-click.directive';
import { TournamentComponent } from './tournament/tournament.component';
import { ScrollOnLoadDirective } from './shared/directives/scroll-on-load.directive';
import { OnImageErrorDirective } from './shared/directives/on-image-error.directive';

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    ResultsComponent,
    OnlyNumberDirective,
    TooltipImageDirective,
    HidePreviewOnClickDirective,
    TournamentComponent,
    ScrollOnLoadDirective,
    OnImageErrorDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    GlobalStateService,
    DataService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
