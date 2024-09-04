import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { BqUserProps } from "../schemas/user";
import { StorekeeperWithBase } from "src/domain/material-movimentation/enterprise/entities/value-objects/storekeeper-with-base";
import { BqBaseProps } from "../schemas/base";
import { Base } from "src/domain/material-movimentation/enterprise/entities/base";

type BqUserWithBaseContract = BqUserProps & {
  base?: BqBaseProps;
};

export class BqUserWithBaseContractMapper {
  static toDomin(raw: BqUserWithBaseContract): StorekeeperWithBase | Estimator {
    if (raw.contractId && !raw.baseId) {
      return Estimator.create(
        {
          contractId: new UniqueEntityID(raw.contractId),
          cpf: raw.cpf,
          email: raw.email,
          name: raw.name,
          password: raw.password,
          type: raw.type,
          status: raw.status,
        },
        new UniqueEntityID(raw.id)
      );
    } else {
      return StorekeeperWithBase.create({
        base: Base.create(
          {
            baseName: raw.base?.baseName ?? "",
            contractId: new UniqueEntityID(raw.base?.contractId),
          },
          new UniqueEntityID(raw.base?.id)
        ),
        cpf: raw.cpf,
        email: raw.email,
        name: raw.name,
        password: raw.password,
        type: raw.type,
        status: raw.status,
        storekeeperId: new UniqueEntityID(raw.id),
      });
    }
  }

  static toBigquery(
    storekeeperOrEstimator: StorekeeperWithBase | Estimator
  ): BqUserWithBaseContract {
    if (storekeeperOrEstimator instanceof StorekeeperWithBase)
      return {
        id: storekeeperOrEstimator.storekeeperId.toString(),
        cpf: storekeeperOrEstimator.cpf,
        email: storekeeperOrEstimator.email,
        name: storekeeperOrEstimator.name,
        password: storekeeperOrEstimator.password,
        status: storekeeperOrEstimator.status,
        type: storekeeperOrEstimator.type,
        base: {
          id: storekeeperOrEstimator.base.id.toString(),
          baseName: storekeeperOrEstimator.base.baseName,
          contractId: storekeeperOrEstimator.base.contractId.toString(),
        },
      };

    if (storekeeperOrEstimator instanceof Estimator) {
      return {
        id: storekeeperOrEstimator.id.toString(),
        cpf: storekeeperOrEstimator.cpf,
        email: storekeeperOrEstimator.email,
        name: storekeeperOrEstimator.name,
        password: storekeeperOrEstimator.password,
        status: storekeeperOrEstimator.status,
        type: storekeeperOrEstimator.type,
        contractId: storekeeperOrEstimator.contractId.toString(),
      };
    } else {
      throw new Error();
    }
  }
}
