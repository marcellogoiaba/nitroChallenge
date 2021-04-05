import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/publication.model';
import { PublicationsService } from 'src/app/services/publications.service';
import * as moment from 'moment';
import { rotate90, smoothCollapse } from 'src/app/shared/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  animations: [smoothCollapse, rotate90]
})
export class HomepageComponent implements OnInit {

  public postForm: FormGroup;
  public publicationList: Post[];
  public headersList: string[] = [];
  public expandedPosts: number[] = [];
  public selectedFilter: string;
  public editingItem: number;
  public sortItems = [
    {value: 'weekAndYear', description: 'Week'},
    {value: 'author', description: 'Author'},
    {value: 'location', description: 'Location'}
  ]


  constructor(
    private publicationsService: PublicationsService
  ) {
    // initialise form
    this.postForm = new FormGroup({
      author: new FormControl('', [Validators.required, Validators.minLength(2)]),
      location: new FormControl('', [Validators.required, Validators.minLength(2)])
    });
  }

  ngOnInit(): void {
    this.getPosts();
  }

  public getPosts() {
    this.publicationsService.getPosts().subscribe((data: Post[]) => {
      this.publicationList = data;
      // for each post we store temporarily a property to group posts by week
      this.publicationList.forEach(obj => {
        obj.weekAndYear = `Week ${moment(obj.time).isoWeek()}, ${moment(obj.time).year()}`;
      });
      // if no filtes selected -> select group by week.
      this.getHeaders(this.selectedFilter ? this.selectedFilter : 'weekAndYear');
    }, (error) => console.log(error))
  }

  public getHeaders(header: string) {
    //creates an arry of strings, were we will store the group names, this is an array of unique values sorted alphabetically.
    console.log(header);
    this.selectedFilter = this.selectedFilter ? this.selectedFilter : header;
    this.headersList = this.publicationList
    .map(obj => obj[header])
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();
  }

  public filterPosts(item: string ) {
    // returns an array of filtered objects that belongs in the group (author, week, location)
    
    let filteredList = this.publicationList.filter(x => x[this.selectedFilter] === item)
    .sort((a,b) => a.time > b.time ? 1 : a.time < b.time ? -1 : 0);
    return filteredList;
  }

  public expandPost(post: Post) {
    // checks is the item is in array of expanded items, removes it if it is, and add it if it isn't
    const index = this.expandedPosts.indexOf(post.id);
    index === -1 ? this.expandedPosts.push(post.id) : this.expandedPosts.splice(index, 1);
    
  }

  public isItemExpanded(id: number) {
    // checks if the item is in the expanded items array
    return this.expandedPosts.indexOf(id) !== -1;
  }

  public editItem(item: Post) {
    // edit the selected item. Add the object values to the form;
    this.editingItem = item.id;
    this.postForm.controls.author.setValue(item.author);
    this.postForm.controls.location.setValue(item.location);
  }

  public isValid() {
    //chhecks if the form is valid;
    return this.postForm.valid;
  }

  public onSubmit() {
    // if the form is valid, call the service to update the post.
    // If success, call onCancel function to reset form and call getPosts() to refresh values on the screen.
    // As the service does not store the values in a database there is no response from the service. 
    if (this.isValid()) {
      let post = this.publicationList[this.publicationList.findIndex(index => index.id === this.editingItem)];
      post.location = this.postForm.controls.location.value;
      post.author = this.postForm.controls.author.value;
      this.publicationsService.updatePost(this.editingItem, post).subscribe(() => {
        console.log('edited successfully');
        this.onCancel();
        this.getPosts();
      })
    }
  }

  public onCancel() {
    // called if the user clicks on cancel, reset the form and reset the item being edited.
    this.editingItem = null;
    this.postForm.reset;
  }

}
