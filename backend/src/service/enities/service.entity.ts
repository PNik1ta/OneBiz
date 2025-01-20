import { IService } from '../../shared/interfaces/service.interface';

export class ServiceEntity implements IService {
  id?: number;
  title: string;
  description?: string;
  background_url?: string;
  amount: number;
  business_id: number;
  discount?: number;

  constructor(service: IService) {
    this.id = service.id;
    this.title = service.title;
    this.description = service.description;
    this.background_url = service.background_url;
    this.amount = service.amount;
    this.business_id = service.business_id;
    this.discount = service.discount;
  }
}
