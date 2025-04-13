import { ICity } from '../../shared/interfaces/city.interface';

export class CityEntity implements ICity {
  id?: number;
  name: string;

  constructor(city: ICity) {
    this.id = city.id;
    this.name = city.name;
  }
}
