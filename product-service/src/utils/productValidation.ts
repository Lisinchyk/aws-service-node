import schema from "@functions/createProduct/schema";

export const productValidation = (product) => {
  if (isValidDataType(product)) {
    return { message: "invalid product data type" };
  }

  if (checkEmptyFields(product)) {
    return { message: "required field is empty. Fill it and try again" };
  }

  const checkFieldTypeResult = checkFieldType(product);
  if (checkFieldTypeResult) {
    return checkFieldTypeResult;
  }
};

const isValidDataType = (product) => {
  return typeof product !== schema.type || Array.isArray(product);
}

const checkEmptyFields = (product) => {
  for (const field of schema.required) {
    const value = product[field];

    if (!value || !value.length) {
      return true;
    }
  }

  return false;
};

const checkFieldType = (product) => {
  const fields = Object.keys(schema.properties);
  for (const field of fields) {
    const { type } = schema.properties[field];
    const isTypeNumber = type === "number";
    const value = product[field];
    const fieldDataType = isTypeNumber
      ? typeof +value
      : typeof value;

    if (fieldDataType !== type) {
      return { message: `${field}: data type is incorrect. Should be "${type}" but got "${fieldDataType}"` }
    }

    if (isTypeNumber && Number.isNaN(+value)) {
      return { message: `${field}: data is incorrect. Should be not "NaN"` }
    }

    if (isTypeNumber && +value < 0) {
      return { message: `${field}: data is incorrect. Should have positive value` }
    }
  }
};