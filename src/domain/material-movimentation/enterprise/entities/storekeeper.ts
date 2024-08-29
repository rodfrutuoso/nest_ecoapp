import { Entity } from "../../../../core/entities/entity";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { Optional } from "../../../../core/types/optional";

export interface StorekeeperProps {
  name: string;
  email: string;
  cpf: string;
  type: string;
  baseId: UniqueEntityID;
  status: string;
  password: string;
}

export class Storekeeper extends Entity<StorekeeperProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get cpf() {
    return this.props.cpf;
  }

  get status() {
    return this.props.status;
  }

  get type() {
    return this.props.type;
  }

  get baseId() {
    return this.props.baseId;
  }

  get password() {
    return this.props.password;
  }

  set type(type: string) {
    this.props.type = type;
  }

  set status(status: string) {
    this.props.status = status;
  }

  set baseId(baseId: UniqueEntityID) {
    this.props.baseId = baseId;
  }

  set password(password: string) {
    this.props.password = password;
  }

  set name(name: string) {
    this.props.name = name;
  }

  static create(
    props: Optional<StorekeeperProps, "status">,
    id?: UniqueEntityID
  ) {
    const storekeeper = new Storekeeper(
      {
        ...props,
        status: props.status ?? "active",
      },
      id
    );

    return storekeeper;
  }
}
