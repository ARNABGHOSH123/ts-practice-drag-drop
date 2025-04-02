import { Project, ProjectStatus } from "../models/project.js";

type Listener<T> = (currentState: T) => void;

abstract class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project[]> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) return this.instance;
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (!project || project.status === newStatus) return;
    project.status = newStatus;
    this.updateListeners();
  }

  updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn?.([...this.projects]);
    }
  }
}

export const projectState = ProjectState.getInstance(); // creates singleton, since we want to only work with a single object
