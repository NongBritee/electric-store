import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SettingComponent } from './setting/setting.component'
import { SettingItemComponent } from './setting/setting-item/setting-item.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { firebaseConfig } from './../../firebase.config';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NewOrderComponent } from './new-order/new-order.component';

const appRoutes: Routes = [
  {
    path: 'new-order',
    component: NewOrderComponent
  },
  {
    path: 'setting',
    component: SettingComponent,
    data: { title: 'Heroes List' },
  },
  {
    path: 'setting-item',
    component: SettingItemComponent
  },
  {
    path: '',
    redirectTo: '/setting',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SettingComponent,
    SettingItemComponent,
    NewOrderComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: true
      }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
