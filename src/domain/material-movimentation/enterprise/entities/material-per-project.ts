import { Entity } from "../../../../core/entities/entity";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";

export interface MaterialPerProjectProps {
  projectId: UniqueEntityID;
  materialId: UniqueEntityID;
  value: number;
  createdAt: Date;
}

export abstract class MaterialPerProject<
  Props extends MaterialPerProjectProps
> extends Entity<Props> {
  get projectId() {
    return this.props.projectId;
  }

  set projecId(projecId: UniqueEntityID) {
    this.props.projecId = projecId;
  }

  get materialId() {
    return this.props.materialId;
  }

  get value() {
    return this.props.value;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
