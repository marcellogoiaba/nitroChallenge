import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http'
import { Post } from 'src/app/models/publication.model';
import { PublicationsService } from 'src/app/services/publications.service';
import { HomepageComponent } from './homepage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const posts = [
{ "id": 1,
"location": "San Francisco", 
"time": new Date(1552657573), 
"author": "Happy User", 
"text": "Proper PDF conversion ensures that every element of your document remains just as you left it.",
"weekAndYear" : "Week 4, 1970"},
{ "id": 2, 
"location": "San Francisco", 
"time": new Date(1552571173), 
"author": "Happy User", 
"text": "The modern workplace is increasingly digital, and workflows are constantly evolving. ",
"weekAndYear" : "Week 4, 1970"},
{ "id": 3, 
"location": "San Francisco", 
"time": new Date(1552571174), 
"author": "Happy Developer", 
"text": "Digital transformation isn’t just a buzzword",
"weekAndYear" : "Week 4, 1970"},
{ "id": 4, 
"location": "Sydney", 
"time": new Date(1552563973), 
"author": "Happy Developer", 
"text": "An expectation of digital efficiency has become the norm in our daily lives",
"weekAndYear" : "Week 4, 1970"},
{ "id": 5, 
"location": "Dublin", 
"time": new Date(1553080742), 
"author": "Happy Manager", 
"text": "A modern PDF annotator that can accommodate all of the cooks in a very busy kitchen is what your employees really need.",
"weekAndYear" : "Week 4, 1970"},
{ "id": 6, 
"location": "Dublin", 
"time": new Date(1553099742), 
"author": "Happy Manager", 
"text": "An integrated productivity solution breaks information through barriers and allows workers to collaborate in real time.",
"weekAndYear" : "Week 4, 1970"}];

const post = { "id": 4, 
"location": "Sydney", 
"time": new Date(1552563973), 
"author": "Happy Developer", 
"text": "An expectation of digital efficiency has become the norm in our daily lives", 
"weekAndYear" : "Week 4, 1970"};

const expandedArr = [1, 2];



describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let de: DebugElement;
  let service: jasmine.SpyObj<PublicationsService>;

  beforeEach(async() => TestBed.configureTestingModule({
    declarations: [HomepageComponent],
    imports: [BrowserAnimationsModule],
    providers: [PublicationsService, HomepageComponent, HttpClient, HttpHandler]
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
	  de = fixture.debugElement;
    service = jasmine.createSpyObj<PublicationsService>('PublicationsService', [
      'getPosts', 'updatePost'
    ])
    fixture.detectChanges();
  });

  it('should be created', () => {

  expect(service).toBeTruthy();
  });

  it('should expand item', () => {
    component.expandedPosts = expandedArr;
    component.expandPost(post);
    fixture.detectChanges();
    expect(component.expandedPosts).toEqual([1, 2, 4]);
  });

  it('should collapse item', () => {
    component.expandedPosts = [1, 2, 4]
    component.expandPost(post);
    fixture.detectChanges();
    expect(component.expandedPosts).toEqual([1, 2]);
  });

  it('should create an array of headers', () => {
    component.publicationList = posts;
    component.headersList = [];
    component.selectedFilter = null;
    component.getHeaders('location');
    fixture.detectChanges();
    expect(component.selectedFilter).toEqual('location');
    expect(component.headersList).toEqual(['Dublin', 'San Francisco', 'Sydney']);
  });

  it('should return a filtered list', () => {
    component.publicationList = posts;
    component.selectedFilter = 'location';
    let result = component.filterPosts('Sydney');
    fixture.detectChanges();
    expect(result).toEqual([post]);
  });

  it('should return false if the form is invalid', () => {
    component.editingItem = 4;
    component.postForm.controls.location.setValue('l');
    component.postForm.controls.author.setValue('Marcelo');
    expect(component.postForm.controls.author.status).toEqual('VALID');
    expect(component.postForm.controls.location.status).toEqual('INVALID');
    let result = component.isValid();
    fixture.detectChanges();
    expect(result).toEqual(false);
  });

  it('should not call service if form is invalid', () => {
    component.editingItem = 4;
    component.postForm.controls.location.setValue('London');
    component.postForm.controls.author.setValue('');
    component.onSubmit();
    fixture.detectChanges();
    expect(service.updatePost).not.toHaveBeenCalled()
  });

})