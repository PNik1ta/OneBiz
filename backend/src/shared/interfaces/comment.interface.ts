export interface IComment {
  id?: number;
  user_id: number;
  post_id: number;
  title: string;
  text: string;
  created_at: Date;
  is_edited: boolean;
}
