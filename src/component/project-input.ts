import { Autobind } from "../decorators/autobind.js";
import { MaxLength } from "../decorators/max-length.js";
import { Max } from "../decorators/max.js";
import { MinLength } from "../decorators/min-length.js";
import { Min } from "../decorators/min.js";
import { PositiveNumber } from "../decorators/positive-number.js";
import { Required } from "../decorators/required.js";
import { projectState } from "../state/project-state.js";
import { validate } from "../util/validation.js";
import Component from "./base-component.js";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  @Required
  @MinLength(5)
  @MaxLength(10)
  titleElement: HTMLInputElement;

  @Required
  @MinLength(25)
  @MaxLength(100)
  descriptionElement: HTMLInputElement;

  @PositiveNumber
  @Min(5)
  @Max(10)
  peopleElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;
    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.onSubmit);
  }

  renderContent() {}

  private gatherUserInputs(): [string, string, number] | void {
    const title = this.titleElement.value;
    const desc = this.descriptionElement.value;
    const people = this.peopleElement.value;

    if (!validate(this)) {
      alert("Invalid inputs.");
      return;
    }
    return [title, desc, Number(people)];
  }

  private clearAllInputs() {
    this.titleElement.value = "";
    this.peopleElement.value = "";
    this.descriptionElement.value = "";
  }

  @Autobind
  private onSubmit(evt: Event) {
    evt.preventDefault();
    const userInputs = this.gatherUserInputs();
    if (Array.isArray(userInputs)) {
      projectState.addProject(...userInputs);
      this.clearAllInputs();
    }
  }
}
