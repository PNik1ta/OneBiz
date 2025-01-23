import { IPost } from '../../shared/interfaces/post.interface';

export class PostEntity implements IPost {
  id?: number;
  business_id: number;
  title: string;
  text: string;
  background_url: string;
  created_at: Date;
  likes: number;
  tagsId: number[];

  constructor(post: IPost) {
    this.id = post.id;
    this.business_id = post.business_id;
    this.title = post.title;
    this.text = post.text;
    this.background_url = post.background_url;
    this.created_at = post.created_at;
    this.likes = post.likes;
    this.tagsId = post.tagsId;
  }
}
