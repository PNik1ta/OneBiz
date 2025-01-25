import { ILike } from '../../shared/interfaces/like.interface';

export class LikeEntity implements ILike {
  id?: number;
  post_id: number;
  user_id: number;

  constructor(like: ILike) {
    this.id = like.id;
    this.post_id = like.post_id;
    this.user_id = like.user_id;
  }
}
