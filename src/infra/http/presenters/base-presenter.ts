import { Base } from "src/domain/material-movimentation/enterprise/entities/base";

export class BasePresenter {
  static toHTTP(base: Base) {
    return {
      id: base.id.toString(),
      baseName: base.baseName,
      contractId: base.contractId.toString()
    };
  }
}
