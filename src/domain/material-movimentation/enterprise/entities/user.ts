import { UserType } from "src/core/types/user-type";
import { Entity } from "../../../../core/entities/entity";

export interface UserProps {
  name: string;
  email: string;
  cpf: string;
  status: string;
  type: UserType;
  password: string;
}

export class User<Props extends UserProps> extends Entity<Props> {
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

  get password() {
    return this.props.password;
  }

  set status(status: string) {
    this.props.status = status;
  }

  set password(password: string) {
    this.props.password = password;
  }

  set type(type: UserType) {
    this.props.type = type;
  }
}
