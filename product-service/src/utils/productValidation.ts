export const productValidation = (product, schema) => {
  if (isValidDataType(product, schema)) {
    return { message: "invalid product data type" };
  }

  if (checkEmptyFields(product, schema)) {
    return { message: "required field is empty. Fill it and try again" };
  }

  const checkFieldTypeResult = checkFieldType(product, schema);
  if (checkFieldTypeResult) {
    return checkFieldTypeResult;
  }
};

const isValidDataType = (product, schema) => {
  return typeof product !== schema.type || Array.isArray(product);
}

const checkEmptyFields = (product, schema) => {
  for (const field of schema.required) {
    if (!product[field]) {
      return true;
    }
  }

  return false;
};

const checkFieldType = (product, schema) => {
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