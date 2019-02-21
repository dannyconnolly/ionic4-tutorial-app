import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { WordpressRestapiService, Post } from '../services/wordpress-restapi.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  id: string;
  private post : Post = [];

  constructor(
    public loadingController: LoadingController, 
    private route: ActivatedRoute, 
    private wordpressService: WordpressRestapiService) {}

  async ngOnInit() {

    const loading = await this.loadingController.create();
    await loading.present();

    this.id = this.route.snapshot.paramMap.get('id');

    this.getPost(this.id).subscribe((post: Post) => {
      this.post = post;
      loading.dismiss();
    });
  }

  getPost(postId) {
    return this.wordpressService.getPost(postId);
  }
}
