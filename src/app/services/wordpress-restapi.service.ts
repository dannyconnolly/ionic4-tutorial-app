import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError, empty, of } from 'rxjs';
import { catchError, map, mergeMap, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordpressRestapiService {

  // // baseRestApiUrl: string = 'http://tutza.com/wp-json/wp/v2/';
  // baseRestApiUrl: string = 'https://ghanamotion.com/wp-json/wp/v2/';
  // baseRestApiUrl: string = 'https://news.ghanamotion.com/wp-json/wp/v2/';
  baseRestApiUrl: string = "http://dannyconnolly.me/wp-json/wp/v2/";

  constructor(private httpClient: HttpClient) { }

  getRecentPosts(categoryId: number, page: number = 1): Observable<any> {
    // Get posts by a category if a category id is passed
    let category_url = categoryId ? ("&categories=" + categoryId) : "";

    return this.httpClient.get(this.baseRestApiUrl + "posts?page=" + page + category_url).pipe(
      map((res: any) => res),
      mergeMap((posts: Post[]) => {
        if (posts.length > 0) {
          return forkJoin(
            posts.map((post: Post) => {
              if (post.featured_media === 0) {
                post.media = new Media;
                return of(new Post(post));
              }
              else {
                return this.httpClient.get(this.baseRestApiUrl + "media/" + post.featured_media).pipe(
                  map((res: any) => {
                    post.media = new Media(res);
                    return new Post(post);
                  }),
                  catchError(val => of(val))
                );
              }
            })
          );
        }
        return empty();
      }),
      catchError(val => of(val))
    );
  }

  getPost(postId) {
    return this.httpClient.get(this.baseRestApiUrl + "posts/" + postId).pipe(
      map((res: any) => res),
      flatMap((post: any) => {
        return forkJoin(
          of(new Post(post)),
          this.getComments(post.id),
          this.getMedia(post.featured_media),
          this.getTags(post),
          this.getCategories(post)
        )
      })
    );
  }

  // getPost(postId: number): Observable<Post> {
  //   return this.httpClient.get(this.baseRestApiUrl + "posts/" + postId).pipe(
  //     map(post => {
  //       return new Post(post);
  //     }),
  //     catchError(val => of(val))
  //   );
  // }

  getTags(post) {
    let observableBatch = [];

    post.tags.forEach(tag => {
      observableBatch.push(this.getTag(tag));
    });

    return forkJoin(observableBatch);
  }

  getTag(tagId: number): Observable<Tag> {
    return this.httpClient.get(this.baseRestApiUrl + "tags/" + tagId).pipe(
      map(tag => {
        return new Tag(tag);
      }),
      catchError(val => of(val))
    );
  }

  getComments(postId: number, page: number = 1) {
    return this.httpClient.get(this.baseRestApiUrl + "comments?post=" + postId).pipe(
      map(comments => {
        let commentsArray = [];     

        Object.keys(comments).forEach(function (key) {
          commentsArray.push(new Comment(comments[key]));
        });

        return commentsArray;
      }),
      catchError(val => of(val))
    );
  }

  getCategories(post) {
    let observableBatch = [];

    post.categories.forEach(category => {
      observableBatch.push(this.getCategory(category));
    });

    return forkJoin(observableBatch);
  }

  getCategory(categoryid: number): Observable<Category> {
    return this.httpClient.get(this.baseRestApiUrl + "categories/" + categoryid).pipe(
      map(category => {
        return new Category(category);
      }),
      catchError(val => of(val))
    );
  }

  getMedia(mediaId: number): Observable<Media> {
    if (mediaId > 0) {
      return this.httpClient.get(this.baseRestApiUrl + "media/" + mediaId).pipe(
        map(media => {
          return new Media(media);
        }),
        catchError(val => of(val))
      );
    }
    return of(new Media);
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
  media: object;
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

  getTitle() {
    if (this.title.hasOwnProperty('rendered')) {
      return this.title['rendered'];
    }
    return this.title;
  }

  getDate() {
    return formatDate(this.date, 'mediumDate', 'en-GB');
  }
}

export class Media {
  date: string;
  date_gmt: string;
  guid: object;
  id: number;
  link: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  title: object;
  author: number;
  comment_status: string;
  ping_status: string;
  meta: object;
  template: string;
  alt_text: string;
  caption: object;
  description: object;
  media_type: string;
  mime_type: string;
  media_details: object;
  post: number;
  source_url: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

  hasThumbnail() {
    if (Object.keys(this).length > 0) {
      return true;
    }

    return false;
  }

  getThumbnail(size: string = 'thumbnail') {
    if (this.media_details.hasOwnProperty('sizes')) {
      if (size == 'full') {
        return this.media_details['sizes'].full.source_url;
      }

      if (size == 'medium') {
        return this.media_details['sizes'].medium.source_url;
      }
      
      return this.media_details['sizes'].thumbnail.source_url;
    }

    return;
  }
}

export class Tag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: object;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: object;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class Comment {
  id: number;
  author: number;
  author_email: string;
  author_ip: string;
  author_name: string;
  author_url: string;
  author_user_agent: string;
  content: object;
  date: string;
  date_gmt: string;
  link: string;
  parent: number;
  post: number;
  status: string;
  type: string;
  author_avatar_urls: object;
  meta: object;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}