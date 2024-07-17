import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { Project } from "../../../enterprise/entities/project";
import { ProjectRepository } from "../../repositories/project-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";

interface RegisterProjectUseCaseRequest {
  project_number: string;
  description: string;
  type: string;
  baseId: string;
  city: string;
}

type RegisterProjectResponse = Eihter<
  ResourceAlreadyRegisteredError,
  {
    project: Project;
  }
>;

export class RegisterProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    project_number,
    description,
    type,
    baseId,
    city,
  }: RegisterProjectUseCaseRequest): Promise<RegisterProjectResponse> {
    const projectSearch = await this.projectRepository.findByProjectNumber(
      project_number
    );

    if (projectSearch) return left(new ResourceAlreadyRegisteredError());

    const project = Project.create({
      project_number,
      description,
      type,
      baseId: new UniqueEntityID(baseId),
      city,
      activeAlmoxID: false,
    });

    await this.projectRepository.create(project);

    return right({ project });
  }
}
