import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordpressRestapiService {

  baseRestApiUrl: string = 'http://dannyconnolly.me/wp-json/wp/v2/';

  constructor(private httpClient: HttpClient) { }

  getRecentPosts(categoryId: number, page: number = 1): Observable<Post[]> {
    // Get posts by a category if a category id is passed
    let category_url = categoryId ? ("&categories=" + categoryId) : "";

    return this.httpClient.get(this.baseRestApiUrl + "posts?page=" + page + category_url).pipe(
      map((posts: Post[]) => {
        return posts.map((post) => new Post(post));
      }),
      catchError(error => {
        return Observable.throw('Something went wrong ;)');
      })
    );
  }

  getPost(postId: number): Observable<Post> {
    return this.httpClient.get(this.baseRestApiUrl + "posts/" + postId).pipe(
      map(post => {
        return new Post(post);
      }),
      catchError(error => {
        return Observable.throw('Something went wrong ;)');
      })
    );
  }
}

export class Post {
  author: number;
  categories: number[];
  comment_status: string;
  content: object;
  date: string;
  date_gmt: string;
  excerpt: object;
  featured_media: number;
  format: string;
  guid: object;
  id: number;
  link: string;
  meta: object;
  modified: string;
  modified_gmt: string;
  ping_status: string;
  slug: string;
  status: string;
  sticky: boolean;
  tags: number[];
  template: string;
  title: object;
  type: string;
  _links: object;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}