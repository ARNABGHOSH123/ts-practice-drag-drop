import { validatorConfig } from "../util/validation.js";

export function MinLength(value: number) {
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
