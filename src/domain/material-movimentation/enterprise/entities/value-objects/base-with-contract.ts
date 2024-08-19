import { ValueObject } from "src/core/entities/value-object";

export interface BaseWithContractProps {
  baseId: string;
  baseName: string;
  contractName: string;
}

export class BaseWithContract extends ValueObject<BaseWithContractProps> {
  get baseId() {
    return this.props.baseId;
  }
  get baseName() {
    return this.props.baseName;
  }
  get contractName() {
    return this.props.contractName;
  }

  static create(props: BaseWithContractProps) {
    return new BaseWithContract(props);
  }
}
