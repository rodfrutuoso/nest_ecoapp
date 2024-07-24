import { Storekeeper } from "src/domain/material-movimentation/enterprise/entities/storekeeper";
import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { BqUserProps } from "../schemas/user";

export class BqUserMapper {
  static toDomin(raw: BqUserProps): Storekeeper | Estimator {
    if (raw.contractId && !raw.baseId) {
      return Estimator.create(
        {
          contractId: new UniqueEntityID(raw.contractId),
          cpf: raw.cpf,
          email: raw.email,
          name: raw.name,
          password: raw.password,
        },
        new UniqueEntityID(raw.id)
      );
    } else {
      return Storekeeper.create(
        {
          baseId: new UniqueEntityID(
            raw.baseId == null ? undefined : raw.baseId
          ),
          cpf: raw.cpf,
          email: raw.email,
          name: raw.name,
          password: raw.password,
          type: raw.type,
          status: raw.status,
        },
        new UniqueEntityID(raw.id)
      );
    }
    
  }

  static toBigquery(
    storekeeperOrEstimator: Storekeeper | Estimator
  ): BqUserProps {
    return {
      id: storekeeperOrEstimator.id.toString(),
      cpf: storekeeperOrEstimator.cpf,
      email: storekeeperOrEstimator.email,
      name: storekeeperOrEstimator.name,
      password: storekeeperOrEstimator.password,
      status: storekeeperOrEstimator.status,
      type: storekeeperOrEstimator.type,
      ...(storekeeperOrEstimator.hasOwnProperty("contractId") && {
        contractId: (storekeeperOrEstimator as Estimator).contractId.toString(),
      }),
      ...(storekeeperOrEstimator.hasOwnProperty("baseId") && {
        baseId: (storekeeperOrEstimator as Storekeeper).baseId.toString(),
      }),
    };
  }
}
