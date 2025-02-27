export interface IPost {
  id?: number;
  business_id: number;
  title: string;
  text: string;
  background_url: string;
  created_at: Date;
  likes: number;
  tagsId: number[];
}
