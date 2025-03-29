function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const newFn = originalMethod.bind(this);
      return newFn;
    },
  };
  return adjDescriptor;
}

interface ValidatorConfig {
  [property: string]: {
    [prop: string]: string[];
  };
}

const validatorConfig: ValidatorConfig = {};

function Required(target: any, propertyKey: string) {
  validatorConfig[target.constructor.name] = {
    ...validatorConfig[target.constructor.name],
    [propertyKey]: [
      ...(validatorConfig[target.constructor.name]?.[propertyKey] ?? []),
      "required",
    ],
  };
}

function PositiveNumber(target: any, propertyKey: string) {
  validatorConfig[target.constructor.name] = {
    ...validatorConfig[target.constructor.name],
    [propertyKey]: [
      ...(validatorConfig[target.constructor.name]?.[propertyKey] ?? []),
      "positiveNumber",
    ],
  };
}

function MinLength(value: number) {
  return function (target: any, propertyKey: string) {
    validatorConfig[target.constructor.name] = {
      ...validatorConfig[target.constructor.name],
      [propertyKey]: [
        ...(validatorConfig[target.constructor.name]?.[propertyKey] ?? []),
        `minLength-${value}`,
      ],
    };
  };
}

function Min(value: number) {
  return function (target: any, propertyKey: string) {
    validatorConfig[target.constructor.name] = {
      ...validatorConfig[target.constructor.name],
      [propertyKey]: [
        ...(validatorConfig[target.constructor.name]?.[propertyKey] ?? []),
        `min-${value}`,
      ],
    };
  };
}

function MaxLength(value: number) {
  return function (target: any, propertyKey: string) {
    validatorConfig[target.constructor.name] = {
      ...validatorConfig[target.constructor.name],
      [propertyKey]: [
        ...(validatorConfig[target.constructor.name]?.[propertyKey] ?? []),
        `maxLength-${value}`,
      ],
    };
  };
}

function Max(value: number) {
  return function (target: any, propertyKey: string) {
    validatorConfig[target.constructor.name] = {
      ...validatorConfig[target.constructor.name],
      [propertyKey]: [
        ...(validatorConfig[target.constructor.name]?.[propertyKey] ?? []),
        `max-${value}`,
      ],
    };
  };
}

function validate(obj: any) {
  const validatorObj = validatorConfig[obj.constructor.name];
  if (!validatorObj) return true;
  let isValid = true;
  for (const prop in validatorObj) {
    for (const validator of validatorObj[prop]) {
      switch (validator) {
        case "required":
          isValid &&= obj[prop].value.trim().length > 0;
          break;
        case "positiveNumber":
          isValid &&= Number(obj[prop].value) > 0;
          break;
      }
      if (/^minLength-\d+$/.test(validator)) {
        isValid &&=
          obj[prop].value.trim().length >= Number(validator.split("-")[1]);
      }
      if (/^maxLength-\d+$/.test(validator)) {
        isValid &&=
          obj[prop].value.trim().length <= Number(validator.split("-")[1]);
      }
      if (/^min-\d+$/.test(validator)) {
        isValid &&= Number(obj[prop].value) >= Number(validator.split("-")[1]);
      }
      if (/^max-\d+$/.test(validator)) {
        isValid &&= Number(obj[prop].value) <= Number(validator.split("-")[1]);
      }

      if (!isValid) return false;
    }
  }
  return isValid;
}

// All classes

enum ProjectStatus {
  Active,
  Finished,
}

interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener<T> = (currentState: T) => void;

abstract class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project[]> {
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

const projectState = ProjectState.getInstance(); // creates singleton, since we want to only work with a single object

// Component base class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  // we dont want to instantiate this
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateElId: string,
    hostEleId: string,
    insertAtStart: boolean,
    elementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateElId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostEleId)! as T;

    const insertNode = document.importNode(this.templateElement.content, true);
    this.element = insertNode.firstElementChild as U;
    if (elementId) this.element.id = elementId;
    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  protected abstract configure?(): void;
  protected abstract renderContent?(): void;
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

class ProjectItem
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

class ProjectList
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

const prjInputObj = new ProjectInput();
const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");
