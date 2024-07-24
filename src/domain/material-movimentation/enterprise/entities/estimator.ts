import { Entity } from "../../../../core/entities/entity";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";

export interface EstimatorProps {
  name: string;
  email: string;
  cpf: string;
  contractId: UniqueEntityID;
  password: string;
}

export class Estimator extends Entity<EstimatorProps> {
  get name() {
    return this.props.name;
  }

  get password() {
    return this.props.password;
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

  get contractId() {
    return this.props.contractId;
  }

  set type(type: string) {
    this.props.type = type;
  }

  set status(status: string) {
    this.props.status = status;
  }

  set base(base: string) {
    this.props.base = base;
  }

  set password(password: string) {
    this.props.password = password;
  }

  set contractId(contractId: string) {
    this.props.contractId = contractId;
  }

  static create(props: EstimatorProps, id?: UniqueEntityID) {
    const estimator = new Estimator(props, id);

    return estimator;
  }
}
