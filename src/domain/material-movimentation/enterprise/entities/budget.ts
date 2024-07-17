import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { Optional } from "../../../../core/types/optional";
import {
  MaterialPerProject,
  MaterialPerProjectProps,
} from "./material-per-project";

export interface BudgetProps extends MaterialPerProjectProps {
  estimatorId: UniqueEntityID;
  contract: UniqueEntityID;
}

export class Budget extends MaterialPerProject<BudgetProps> {
  get estimatorId() {
    return this.props.estimatorId;
  }

  static create(
    props: Optional<BudgetProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const transferRegister = new Budget(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return transferRegister;
  }
}
