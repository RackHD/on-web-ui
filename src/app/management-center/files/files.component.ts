import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AlphabeticalComparator, StringOperator, ObjectFilterByKey } from '../../utils/inventory-operator';
import * as _ from 'lodash';

import { FileService } from '../services/file.service';
import { File, PAGE_SIZE_OPTIONS } from '../../models';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FilesComponent implements OnInit {
  filesStore: File[] = [];
  allFiles: File[] = [];
  selectedFiles: File[] = [];
  isShowRawData: boolean;
  fileRawData: string;
  selectedFile: string;

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
    this.getAllFiles();
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

  getAllFiles(): void {
    this.fileService.getAll()
      .subscribe(data => {
        this.filesStore = data;
        this.allFiles = data;
        this.dgDataLoading = false;
      });
  }

  goToDetail(identifier: string) {
    this.selectedFile = identifier;
    this.fileService.getByIdentifier(identifier, 'text')
    .subscribe(data => {
      this.fileRawData = data;
      this.isShowRawData = true;
    })
  }

  searchFile(term: string){
    this.dgDataLoading = true;
    this.filesStore = StringOperator.search(term, this.allFiles, ["filename", "basename"]);
    this.dgDataLoading = false;
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  refresh() {
    this.dgDataLoading = true;
    this.getAllFiles();
  }

}
