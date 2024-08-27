import { BqMovimentationProps } from "../schemas/movimentation";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { MovimentationWithDetails } from "src/domain/material-movimentation/enterprise/entities/value-objects/movimentation-with-details";
import { Material } from "src/domain/material-movimentation/enterprise/entities/material";
import { Project } from "src/domain/material-movimentation/enterprise/entities/project";
import { Storekeeper } from "src/domain/material-movimentation/enterprise/entities/storekeeper";
import { Base } from "src/domain/material-movimentation/enterprise/entities/base";

export class BqMovimentationWithDetailsMapper {
  static toDomin(raw: BqMovimentationProps): MovimentationWithDetails {
    return MovimentationWithDetails.create({
      movimentationId: new UniqueEntityID(raw.id),
      value: raw.value,
      observation: raw.observation,
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
      storekeeper: Storekeeper.create(
        {
          baseId: new UniqueEntityID(
            raw.user?.baseId == null ? undefined : raw.user?.baseId
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
      base: Base.create(
        {
          baseName: raw.base?.baseName ?? "",
          contractId: new UniqueEntityID(raw.base?.contractId),
        },
        new UniqueEntityID(raw.base?.id)
      ),
    });
  }
}