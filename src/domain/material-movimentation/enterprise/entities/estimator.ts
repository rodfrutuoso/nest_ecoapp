import { Optional } from "src/core/types/optional";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { User, UserProps } from "./user";

export interface EstimatorProps extends UserProps {
  contractId: UniqueEntityID;
}

export class Estimator extends User<EstimatorProps> {
  get contractId() {
    return this.props.contractId;
  }

  set contractId(contractId: UniqueEntityID) {
    this.props.contractId = contractId;
  }

  static create(
    props: Optional<EstimatorProps, "status">,
    id?: UniqueEntityID
  ) {
    const estimator = new Estimator(
      {
        ...props,
        status: props.status ?? "ativo",
      },
      id
    );

    return estimator;
  }
}
