import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import {
  AlphabeticalComparator,
  StringOperator,
  ObjectFilterByKey,
} from '../../utils/inventory-operator';
import { FormsModule, ReactiveFormsModule, FormGroup,FormControl }   from '@angular/forms';
import * as _ from 'lodash';

import { FileService } from '../services/file.service';
import { File, ModalTypes } from '../../models';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilesComponent implements OnInit {
  filesStore: File[] = [];
  allFiles: File[] = [];
  selectedFiles: File[] = [];
  selectedFile: File;

  files: FileList;

  action: string;
  isShowModal: boolean;
  rawData: string;

  modalTypes: ModalTypes;

  // data grid helper
  dgDataLoading = false;
  dgPlaceholder = 'No file found!'

  public versionComparator = new AlphabeticalComparator<File>('version');
  public filenameComparator = new AlphabeticalComparator<File>('filename');
  public basenameComparator = new AlphabeticalComparator<File>('basename');
  public versionFilter = new ObjectFilterByKey<File>('version');
  public filenameFilter = new ObjectFilterByKey<File>('filename');
  public basenameFilter = new ObjectFilterByKey<File>('basename');
  public idFilter = new ObjectFilterByKey<File>('id');

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.isShowModal = false;
    this.modalTypes = new ModalTypes();
    this.getAll();
  }

  getAll(): void {
    this.fileService.getAll()
      .subscribe(data => {
        this.filesStore = data;
        this.allFiles = data;
        this.dgDataLoading = false;
      });
  }

  getMetaData(identifier: string): void {
    this.fileService.getMetaByIdentifier(identifier)
    .subscribe(data => {
      this.rawData = data;
      this.isShowModal = true;
    })
  }

  getRawData(identifier: string): void {
    this.fileService.getByIdentifier(identifier, 'text')
    .subscribe(data => {
      this.rawData = data;
      this.isShowModal = true;
    })
  }

  searchFile(term: string){
    this.dgDataLoading = true;
    this.filesStore = StringOperator.search(term, this.allFiles);
    this.dgDataLoading = false;
  }

  getHttpMethod(){
  }

  create(){
    this.action = "Upload";
    this.isShowModal = true;
  }

  batchDelete() {
    if (!_.isEmpty(this.selectedFiles)){
      this.action = "Delete";
      this.isShowModal = true;
    }
  };

  refresh() {
    this.isShowModal = false;
    this.dgDataLoading = true;
    this.getAll();
  }

  deleteSel(){
    let idList = _.map(this.selectedFiles, file => {
      return file.uuid;
    });
    this.isShowModal = false;
    this.fileService.deleteByIdentifiers(idList)
    .subscribe(
      data => { this.refresh();}
    )
  }

  onConfirm(value) {
    switch(value) {
      case 'reject':
        this.isShowModal = false;
        break;
      case 'accept':
        this.deleteSel();
    }
  }

  onAction(action){
    switch(action) {
      case 'Refresh':
        this.refresh();
        break;
      case 'Create':
        this.create();
        break;
      case 'Delete':
        this.batchDelete();
        break;
    };
  }

  onFilter(filtered){
    this.filesStore = filtered;
  }

  onUpdate(file: File){
    this.selectedFile = file;
    this.action = "Update";
    this.isShowModal = true;
  }

  onDelete(file: File) {
    this.selectedFiles = [file];
    this.action = "Delete";
    this.isShowModal = true;
  };

  onGetDetails(file: File) {
    this.selectedFile = file;
    this.action = "Meta";
    this.getMetaData(file.filename);
  };

  onGetRawData(file: File) {
    this.selectedFile = file;
    this.action = "Raw"
    this.getRawData(file.filename);
  };

  onChange(event){
    this.files =  event.target.files;
  }

  onCreateSubmit(){
    //existingFilename is used to store filename when updating file
    let existingFilename = this.selectedFile && this.selectedFile.filename;
    let file = this.files[0];
    //TODO: Add more details on progress
    //TODO: And use sync mode instead of async mode
    //TODO: Add support on multiple files upload support
    this.isShowModal = false;
    this.fileService.upload(file, existingFilename || file.name)
    .subscribe(() => {
      this.selectedFile = null;
      this.refresh();
    });
  }
}
