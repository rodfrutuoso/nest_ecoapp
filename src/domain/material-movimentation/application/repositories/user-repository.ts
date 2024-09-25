import { Estimator } from "../../enterprise/entities/estimator";
import { Storekeeper } from "../../enterprise/entities/storekeeper";
import { UserWithBaseContract } from "../../enterprise/entities/value-objects/user-with-base-contract";

export abstract class UserRepository {
  abstract create(user: Storekeeper | Estimator): Promise<void>;
  abstract findByIdWithBaseContract(
    userId: string
  ): Promise<UserWithBaseContract | null>;
}
