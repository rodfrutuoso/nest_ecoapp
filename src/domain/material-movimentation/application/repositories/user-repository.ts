import { Estimator } from "../../enterprise/entities/estimator";
import { Storekeeper } from "../../enterprise/entities/storekeeper";

export abstract class UserRepository {
  abstract create(user: Storekeeper | Estimator): Promise<void>;
}
