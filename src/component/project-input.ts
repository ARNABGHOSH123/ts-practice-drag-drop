/// <reference path="./base-component.ts" />
/// <reference path="../decorators/required.ts" />
/// <reference path="../decorators/min-length.ts" />
/// <reference path="../decorators/max-length.ts" />
/// <reference path="../decorators/max.ts" />
/// <reference path="../decorators/min.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
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
}
