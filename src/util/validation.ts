namespace App {
  interface ValidatorConfig {
    [property: string]: {
      [prop: string]: string[];
    };
  }

  export const validatorConfig: ValidatorConfig = {};

  export function validate(obj: any) {
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
          isValid &&=
            Number(obj[prop].value) >= Number(validator.split("-")[1]);
        }
        if (/^max-\d+$/.test(validator)) {
          isValid &&=
            Number(obj[prop].value) <= Number(validator.split("-")[1]);
        }

        if (!isValid) return false;
      }
    }
    return isValid;
  }
}
