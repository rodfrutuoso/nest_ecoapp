import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { Optional } from "../../../../core/types/optional";
import { MaterialPerProject, MaterialPerProjectProps } from "./material-per-project";

export interface MovimentationProps extends MaterialPerProjectProps {
  storekeeperId: UniqueEntityID;
  observation: string;
  baseID: UniqueEntityID;
}

export class Movimentation extends MaterialPerProject<MovimentationProps> {
  get storekeeperId() {
    return this.props.storekeeperId;
  }

  get observation() {
    return this.props.observation;
  }

  get baseID(){
    return this.props.baseID
  }

  static create(
    props: Optional<MovimentationProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const movimentation = new Movimentation(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return movimentation;
  }
}
