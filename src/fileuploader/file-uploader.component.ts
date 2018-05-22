import { Component, Input, Output, EventEmitter, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import { timer, Subscription } from 'rxjs';

import { UploadFile } from './model/upload-file';
import { FileSystemFileEntry, FileSystemEntry } from './dom.types';

function preventAndStop(event: any) {
  event.stopPropagation();
  event.preventDefault();
}

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnDestroy {

  @Input() placeholder = 'Drop file here.';

  @Output() fileDrop = new EventEmitter<UploadFile>();
  @Output() fileHover = new EventEmitter<any>();
  @Output() fileLeave = new EventEmitter<any>();

  file: UploadFile|null = null;
  subscription: Subscription;
  dragOverFlag = false;

  globalDisable = false;
  globalStart: Function;
  globalEnd: Function;

  constructor(
    private zone: NgZone,
    private renderer: Renderer2
  ) {
    this.globalStart = this.renderer.listen('document', 'dragstart', (evt) => {
      this.globalDisable = true;
    });
    this.globalEnd = this.renderer.listen('document', 'dragend', (evt) => {
      this.globalDisable = false;
    });
  }

  public onDragOver(event: Event): void {
    if (!this.globalDisable) {
      if (!this.dragOverFlag) {
        this.dragOverFlag = true;
        this.fileHover.emit(event);
      }
      preventAndStop(event);
    }
  }

  public onDragLeave(event: Event): void {
    if (!this.globalDisable) {
      if (this.dragOverFlag) {
        this.dragOverFlag = false;
        this.fileLeave.emit(event);
      }
      preventAndStop(event);
    }
  }

  dropFile(event: any) {
    if (!this.globalDisable) {
      this.dragOverFlag = false;
      event.dataTransfer.dropEffect = 'copy';
      let length;
      if (event.dataTransfer.items) {
        length = event.dataTransfer.items.length;
      } else {
        length = event.dataTransfer.files.length;
      }

      for (let i = 0; i < length; i++) {
        let entry: FileSystemEntry;
        if (event.dataTransfer.items) {
          if (event.dataTransfer.items[i].webkitGetAsEntry) {
            entry = event.dataTransfer.items[i].webkitGetAsEntry();
          }
        } else {
          if (event.dataTransfer.files[i].webkitGetAsEntry) {
            entry = event.dataTransfer.files[i].webkitGetAsEntry();
          }
        }
        if (entry == null) {
          const file: File = event.dataTransfer.files[i];
          if (file) {
            const fakeFileEntry: FileSystemFileEntry = {
              name: file.name,
              isDirectory: false,
              isFile: true,
              file: (callback: (file: File) => void): void => {
                callback(file);
              }
            };
            this.file = new UploadFile(fakeFileEntry.name, fakeFileEntry);
          }
        } else {
          if (entry.isFile) {
            this.file = new UploadFile(entry.name, entry);
          } else if (entry.isDirectory) {
            // TODO: better error notification.
            alert('Directory is unsupported');
          }
        }
      }

      preventAndStop(event);

      const timerObservable = timer(200, 200);
      this.subscription = timerObservable.subscribe(() => {
        if (this.file != null) {
          this.fileDrop.emit(this.file);
          this.file = null;
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.globalStart();
    this.globalEnd();
  }
}
