import { Entity } from "../../../../core/entities/entity";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";

export interface ContractProps {
  contractName: string;
}

export class Contract extends Entity<ContractProps> {
  get contractName() {
    return this.props.contractName;
  }

  static create(props: ContractProps, id?: UniqueEntityID) {
    const contract = new Contract(props, id);

    return contract;
  }
}
