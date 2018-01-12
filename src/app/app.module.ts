import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MainFormComponent } from './main-form/main-form.component';
import { RecentOptionsComponent } from './recent-options/recent-options.component';
import { ResultsComponent } from './results/results.component';
import { GlobalAnimationStateService } from './services/global-animation-state.service';
import { DataService } from './services/data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { HttpClientModule } from '@angular/common/http';
import { TooltipImageDirective } from './directives/tooltip-image.directive';
import { HidePreviewOnClickDirective } from './directives/hide-preview-on-click.directive';
import { TournamentComponent } from './tournament/tournament.component';
import { ScrollOnLoadDirective } from './directives/scroll-on-load.directive';

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    RecentOptionsComponent,
    ResultsComponent,
    OnlyNumberDirective,
    TooltipImageDirective,
    HidePreviewOnClickDirective,
    TournamentComponent,
    ScrollOnLoadDirective
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
