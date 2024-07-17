import { Entity } from "../../../../core/entities/entity";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";

export interface ProjectProps {
  project_number: string;
  description: string;
  type: string;
  baseId: UniqueEntityID;
  city: string;
  activeAlmoxID: boolean;
}

export class Project extends Entity<ProjectProps> {
  get project_number() {
    return this.props.project_number;
  }

  get description() {
    return this.props.description;
  }

  get type() {
    return this.props.type;
  }

  get baseId() {
    return this.props.baseId;
  }

  set baseId(baseId: string) {
    this.props.baseId = baseId;
  }

  get city() {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
  }

  get activeAlmoxID() {
    return this.props.activeAlmoxID;
  }

  set activeAlmoxID(activeAlmoxID: boolean) {
    this.props.activeAlmoxID = activeAlmoxID;
  }

  static create(props: ProjectProps, id?: UniqueEntityID) {
    const project = new Project(props, id);

    return project;
  }
}
