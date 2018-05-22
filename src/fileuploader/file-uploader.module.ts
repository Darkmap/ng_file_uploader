import { NgModule } from '@angular/core';
import {FileUploaderComponent} from './file-uploader.component';

@NgModule({
  declarations: [
    FileUploaderComponent,
  ],
  exports: [FileUploaderComponent],
  imports: [],
  providers: [],
  bootstrap: [FileUploaderComponent],
})
export class FileUploaderModule {}
