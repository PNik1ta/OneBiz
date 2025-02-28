export interface ICreatePostDto {
  business_id: number;
  title: string;
  text: string;
  background_url: string;
  tagsId: number[];
}
