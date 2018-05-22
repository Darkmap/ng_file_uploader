import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FileUploaderModule} from '../fileuploader/file-uploader.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FileUploaderModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
