import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { Optional } from "../../../../core/types/optional";
import { User, UserProps } from "./user";

export interface StorekeeperProps extends UserProps {
  baseId: UniqueEntityID;
  contractId: UniqueEntityID;
}

export class Storekeeper extends User<StorekeeperProps> {
  get baseId() {
    return this.props.baseId;
  }

  set baseId(baseId: UniqueEntityID) {
    this.props.baseId = baseId;
  }

  get contractId() {
    return this.props.contractId;
  }

  set contractId(contractId: UniqueEntityID) {
    this.props.contractId = contractId;
  }

  static create(
    props: Optional<StorekeeperProps, "status">,
    id?: UniqueEntityID
  ) {
    const storekeeper = new Storekeeper(
      {
        ...props,
        status: props.status ?? "ativo",
      },
      id
    );

    return storekeeper;
  }
}
