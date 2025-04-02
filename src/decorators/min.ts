/// <reference path="../util/validation.ts"/>

namespace App {
  export function Min(value: number) {
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
}
