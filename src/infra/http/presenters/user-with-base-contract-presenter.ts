import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";
import { StorekeeperWithBase } from "src/domain/material-movimentation/enterprise/entities/value-objects/storekeeper-with-base";

export class UserWithBaseContractPresenter {
  static toHTTP(user: StorekeeperWithBase | Estimator) {
    const id =
      user instanceof StorekeeperWithBase
        ? user.storekeeperId.toString()
        : user.id.toString();

    const contractId =
      user instanceof Estimator ? user.contractId.toString() : undefined;

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
      contractId,
      base,
    };
  }
}
