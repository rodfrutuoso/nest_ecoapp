import { Project } from "../../enterprise/entities/project";

export abstract class ProjectRepository {
  abstract findByProjectNumber(project_number: string): Promise<Project | null>;
  abstract findByID(id: string): Promise<Project | null>;
  abstract create(project: Project): Promise<void>;
}
