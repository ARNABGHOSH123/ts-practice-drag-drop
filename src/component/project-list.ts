/// <reference path="./base-component.ts" />
/// <reference path="../models/drag-drop.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="./project-item.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
  export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    assignedProjects: Project[] = [];

    constructor(private type: "active" | "finished") {
      super("project-list", "app", false, `${type}-projects`);

      this.renderContent();
      this.configure();
    }

    renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector(
        "h2"
      )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
    }

    @Autobind
    dragOverHandler(evt: DragEvent) {
      if (evt.dataTransfer?.types?.[0] === "text/plain") {
        evt.preventDefault(); // this is here and not outside if because we dont want to drop if type is other than text/plain. JS default behavior is not allow drop so we need to prevent this default so that we can drop something.
        evt.dataTransfer!.dropEffect = "move";
        this.element.querySelector("ul")!.classList.add("droppable");
      }
    }

    @Autobind
    dropHandler(evt: DragEvent) {
      evt.preventDefault();
      const projectId = evt.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        projectId,
        this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }

    @Autobind
    dragLeaveHandler(evt: DragEvent) {
      evt.preventDefault();
      this.element.querySelector("ul")!.classList.remove("droppable");
    }

    attachDragDropEvents() {
      const listEl = this.element.querySelector("ul")!;
      listEl.addEventListener("dragover", this.dragOverHandler);
      listEl.addEventListener("drop", this.dropHandler);
      listEl.addEventListener("dragleave", this.dragLeaveHandler);
    }

    removeDragDropEvents() {
      const listEl = this.element.querySelector("ul")!;
      listEl.removeEventListener("dragover", this.dragOverHandler);
      listEl.removeEventListener("drop", this.dropHandler);
      listEl.removeEventListener("dragleave", this.dragLeaveHandler);
    }

    configure() {
      if (this.type === "finished") {
        this.attachDragDropEvents();
      }
      projectState.addListener((projects: Project[]) => {
        this.assignedProjects = projects.filter((project) =>
          this.type === "active"
            ? project.status === ProjectStatus.Active
            : project.status === ProjectStatus.Finished
        );
        this.renderProjects();

        const shouldAttachDragDropEvents =
          this.type === "active" && this.assignedProjects.length > 0;

        if (shouldAttachDragDropEvents) {
          this.attachDragDropEvents();
        } else {
          this.removeDragDropEvents();
        }
      });
    }

    private renderProjects() {
      const listId = `${this.type}-projects-list`;
      const listEl = document.getElementById(listId)! as HTMLUListElement;

      listEl.innerHTML = "";

      for (const project of this.assignedProjects) {
        new ProjectItem(listId, project);
      }
    }
  }
}
