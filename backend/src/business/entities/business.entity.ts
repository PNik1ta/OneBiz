import { IBusiness } from '../../shared/interfaces/business.interface';

export class BusinessEntity implements IBusiness {
  id?: number;
  company_name: string;
  company_description: string;
  preview_images_url: string[];
  user_id: number;

  constructor(business: IBusiness) {
    this.id = business.id;
    this.company_name = business.company_name;
    this.company_description = business.company_description;
    this.preview_images_url = business.preview_images_url;
    this.user_id = business.user_id;
  }
}
