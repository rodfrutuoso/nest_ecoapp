import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";
import { EstimatorWithContract } from "src/domain/material-movimentation/enterprise/entities/value-objects/estimator-with-contract";
import { StorekeeperWithBase } from "src/domain/material-movimentation/enterprise/entities/value-objects/storekeeper-with-base";

export class UserWithBaseContractPresenter {
  static toHTTP(user: StorekeeperWithBase | EstimatorWithContract) {
    const id =
      user instanceof StorekeeperWithBase
        ? user.storekeeperId.toString()
        : user.estimatorId.toString();

    const contract =
      user instanceof EstimatorWithContract
        ? {
            id: user.contract.id.toString(),
            contractName: user.contract.contractName,
          }
        : undefined;

    const base =
      user instanceof StorekeeperWithBase
        ? { id: user.base.id.toString(), baseName: user.base.baseName }
        : undefined;

    return {
      id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      status: user.status,
      type: user.type,
      contract,
      base,
    };
  }
}
