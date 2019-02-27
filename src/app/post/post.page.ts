import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { WordpressRestapiService, Post, Media, Tag, Category, Comment } from '../services/wordpress-restapi.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  id: string;
  private post: Post = new Post;
  private media: Media = new Media;
  private tags: Tag[] = [];
  private categories: Category[] = [];
  private comments: Comment[] = [];

  constructor(
    public loadingController: LoadingController,
    private route: ActivatedRoute,
    private wordpressService: WordpressRestapiService) { }

  async ngOnInit() {

    const loading = await this.loadingController.create();
    await loading.present();

    this.id = this.route.snapshot.paramMap.get('id');

    this.getPost(this.id).subscribe((data: any) => {
      this.post = data[0];
      this.comments = data[1];
      this.media = data[2];
      this.tags = data[3];
      this.categories = data[4];
      loading.dismiss();
    });
  }

  getPost(postId) {
    return this.wordpressService.getPost(postId);
  }
}
