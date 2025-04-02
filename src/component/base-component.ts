namespace App {
  // Component base class
  export abstract class Component<
    T extends HTMLElement,
    U extends HTMLElement
  > {
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

      const insertNode = document.importNode(
        this.templateElement.content,
        true
      );
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
}
