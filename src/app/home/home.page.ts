import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { WordpressRestapiService, Post } from '../services/wordpress-restapi.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  categoryId: number;
  private posts : Post[] = [];

  constructor(
    public loadingController: LoadingController, 
    private router: Router,
    private wordpressService: WordpressRestapiService) { }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.loadPosts().subscribe((posts: Post[]) => {
      console.log(posts);
      this.posts = posts;
      loading.dismiss();
    });
  }

  loadPosts() {
    return this.wordpressService.getRecentPosts(this.categoryId);
  }

  openPost(postId) {
    this.router.navigateByUrl('/post/' + postId);
  }
}
