export interface IBusiness {
  id?: number;
  company_name: string;
  company_description: string;
  preview_images_url: string[];
  user_id: number;
  city_id: number;
  place: string;
  review_count: number;
  avg_rating: number;
  city_name: string;
}
