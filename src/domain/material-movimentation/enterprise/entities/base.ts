import { Entity } from "../../../../core/entities/entity";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";

export interface BaseProps {
  baseName: string;
  contractID: UniqueEntityID;
}

export class Base extends Entity<BaseProps> {
  get baseName() {
    return this.props.baseName;
  }

  get contractID() {
    return this.props.contractID;
  }

  static create(props: BaseProps, id?: UniqueEntityID) {
    const base = new Base(props, id);

    return base;
  }
}
