/// <reference path="./models/drag-drop.ts"/>
/// <reference path="./models/project.ts"/>
/// <reference path="./state/project-state.ts"/>
/// <reference path="./util/validation.ts"/>
/// <reference path="./decorators/autobind.ts" />
/// <reference path="./decorators/max.ts" />
/// <reference path="./decorators/max-length.ts" />
/// <reference path="./decorators/min.ts" />
/// <reference path="./decorators/min-length.ts" />
/// <reference path="./decorators/positive-number.ts" />
/// <reference path="./decorators/required.ts" />
/// <reference path="./component/base-component.ts" />
/// <reference path="./component/project-item.ts" />
/// <reference path="./component/project-input.ts" />
/// <reference path="./component/project-list.ts" />

namespace App {
  new ProjectInput();
  new ProjectList("active");
  new ProjectList("finished");
}
