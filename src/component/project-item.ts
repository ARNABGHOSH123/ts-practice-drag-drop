import { Autobind } from "../decorators/autobind.js";
import { Draggable } from "../models/drag-drop.js";
import { Project } from "../models/project.js";
import Component from "./base-component.js";

export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  constructor(hostId: string, private project: Project) {
    super("single-project", hostId, false, project.id);

    this.configure();
    this.renderContent();
  }

  get persons() {
    return `${this.project.people} person${
      this.project.people > 1 ? "s" : ""
    } assigned`;
  }

  @Autobind
  dragStartHandler(evt: DragEvent) {
    evt.dataTransfer!.setData("text/plain", this.project.id); // not all DragEvent have available dataTransfer object
    evt.dataTransfer!.effectAllowed = "move";
  }

  @Autobind
  dragEndHandler(_: DragEvent) {
    // console.log("Drag leave");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
