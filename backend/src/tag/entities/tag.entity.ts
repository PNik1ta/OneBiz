import { ITag } from '../../shared/interfaces/tag.interface';

export class TagEntity implements ITag {
  id: number;
  name: string;

  constructor(tag: ITag) {
    this.id = tag.id;
    this.name = tag.name;
  }
}
