import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AlphabeticalComparator, StringOperator, ObjectFilterByKey } from '../../utils/inventory-operator';
import { FormsModule, ReactiveFormsModule, FormGroup,FormControl }   from '@angular/forms';
import * as _ from 'lodash';

import { FileService } from '../services/file.service';
import { File, PAGE_SIZE_OPTIONS } from '../../models';

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

  // data grid helper
  searchTerms = new Subject<string>();
  dgDataLoading = false;
  dgPlaceholder = 'No file found!'
  selectedPageSize = "15";
  pageSizes = PAGE_SIZE_OPTIONS;

  public versionComparator = new AlphabeticalComparator<File>('version');
  public filenameComparator = new AlphabeticalComparator<File>('filename');
  public basenameComparator = new AlphabeticalComparator<File>('basename');
  public versionFilter = new ObjectFilterByKey<File>('version');
  public filenameFilter = new ObjectFilterByKey<File>('filename');
  public basenameFilter = new ObjectFilterByKey<File>('basename');
  public idFilter = new ObjectFilterByKey<File>('id');

  get dgPageSize() {
    return parseInt(this.selectedPageSize);
  }

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.isShowModal = false;
    this.getAll();
    let searchTrigger = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.searchFile(term);
        return 'whatever';
      })
    );
    searchTrigger.subscribe();
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
    this.filesStore = StringOperator.search(term, this.allFiles, ["filename", "basename"]);
    this.dgDataLoading = false;
  }

  getHttpMethod(){
  }
  
  onRefresh() {
    this.isShowModal = false;
    this.dgDataLoading = true;
    this.getAll();
  }

  onBatchDelete() {
    if (!_.isEmpty(this.selectedFiles)){
      this.action = "Delete";
      this.isShowModal = true;
    }
  };

  onCreate(){
    this.action = "Upload";
    this.isShowModal = true;
  }

  onSearch(term: string): void {
    this.searchTerms.next(term);
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

  onDeleteSubmit(){
    _.map(this.selectedFiles, file => {
      this.fileService.remove(file.uuid).subscribe(
        data =>{
          this.onRefresh();
        },
        error => {
          alert(error);
        }
      )
    })
  }

  onCreateSubmit(){
    //existingFilename is used to store filename when updating file
    let existingFilename = this.selectedFile && this.selectedFile.filename;
    let file = this.files[0];
    //TODO: Add more details on progress
    //TODO: And use sync mode instead of async mode
    //TODO: Add support on multiple files upload support
    this.fileService.upload(existingFilename || file.name, file)
    this.selectedFile = null;
    this.onRefresh();
  }

  onSubmit(){}
}
