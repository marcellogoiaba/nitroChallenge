import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { Post } from 'src/app/models/publication.model';

const httpOptionsParams = {
  withCredendials: true,
  params: {}
}

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {


  constructor(
    private http: HttpClient
  ) { }

  public getPosts(): Observable<Post[]> {
    const apiUrl = 'api/publications';
    return this.http.get<Post[]>(apiUrl, httpOptionsParams)
  }

  public updatePost(id: number, jsonBody: Post): Observable<Post> {
    const apiUrl = `api/publications/${id.toString()}`;
    this.http.delete(apiUrl, httpOptionsParams);
    return this.http.post<Post>(apiUrl, jsonBody, httpOptionsParams)
  }
}
