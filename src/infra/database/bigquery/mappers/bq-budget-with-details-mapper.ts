import { BqBudgetProps } from "../schemas/budget";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { BudgetWithDetails } from "src/domain/material-movimentation/enterprise/entities/value-objects/budget-with-details";
import { Material } from "src/domain/material-movimentation/enterprise/entities/material";
import { Project } from "src/domain/material-movimentation/enterprise/entities/project";
import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";
import { Contract } from "src/domain/material-movimentation/enterprise/entities/contract";
 
export class BqBudgetWithDetailsMapper {
  static toDomin(raw: BqBudgetProps): BudgetWithDetails {
    return BudgetWithDetails.create({
      budgetId: new UniqueEntityID(raw.id),
      value: raw.value,
      createdAt: raw.createdAt,
      material: Material.create(
        {
          code: raw.material?.code ?? 0,
          contractId: new UniqueEntityID(raw.material?.contractId),
          description: raw.material?.description ?? "",
          type: raw.material?.type ?? "",
          unit: raw.material?.unit ?? "",
        },
        new UniqueEntityID(raw.material?.id)
      ),
      estimator: Estimator.create(
        {
          contractId: new UniqueEntityID(
            raw.user?.contractId == null ? undefined : raw.user?.contractId
          ),
          cpf: raw.user?.cpf ?? "",
          email: raw.user?.email ?? "",
          name: raw.user?.name ?? "",
          password: raw.user?.password ?? "",
          type: raw.user?.type ?? "",
          status: raw.user?.status ?? "",
        },
        new UniqueEntityID(raw.user?.id)
      ),
      project: Project.create(
        {
          baseId: new UniqueEntityID(raw.project?.baseId),
          city: raw.project?.city ?? "",
          description: raw.project?.description ?? "",
          project_number: raw.project?.project_number ?? "",
          type: raw.project?.type ?? "",
        },
        new UniqueEntityID(raw.project?.id)
      ),
      contract: Contract.create(
        {
          contractName: raw.contract?.contractName ?? "",
        },
        new UniqueEntityID(raw.contract?.id)
      ),
    });
  }
}
