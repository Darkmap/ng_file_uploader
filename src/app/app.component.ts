import { Component } from '@angular/core';
import {UploadFile} from '../fileuploader/model/upload-file';
import {FileSystemFileEntry} from '../fileuploader/dom.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  file: UploadFile|null = null;

  dropped(file: UploadFile) {
    this.file = file;
    // Is it a file?
    if (this.file.fileEntry.isFile) {
      const fileEntry = (this.file.fileEntry as FileSystemFileEntry);
      fileEntry.file((f: File) => {

        // Here you can access the real file
        console.log(this.file.relativePath, file);

        const reader = new FileReader();
        reader.readAsText(f, 'UTF-8');
        reader.onload = function (evt: any) {
          console.log(evt.target.result);
        };
        reader.onerror = function (error) {
          console.error(error);
        };

        /**
         // You could upload it like this:
         const formData = new FormData()
         formData.append('logo', file, relativePath)

         // Headers
         const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

         this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
         .subscribe(data => {
            // Sanitized logo returned from backend
          })
         **/

      });
    } else {
      // TODO: better error notification
      alert('Directory is unsupported.');
    }
  }

  fileOver(event) {
    console.log(event);
  }

  fileLeave(event) {
    console.log(event);
  }
}
