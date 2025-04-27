export interface IBusiness {
  id?: number;
  company_name: string;
  company_description: string;
  preview_images_url: string[];
  user_id: number;
  city_id: number;
  place: string;
  city_name?: string;
  user_email?: string;
  avg_rating?: number;
  review_count?: number;
}
