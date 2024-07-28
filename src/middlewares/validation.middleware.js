const schemaOptions = ["body", "params", "query", "files", "file", "headers"];

export default function validation(schema) {
  return (req, res, next) => {
    let arrError = [];

    schemaOptions.forEach((option) => {
      if (schema[option]) {
        const err = schema[option].validate(req[option], { abortEarly: false });

        if (err)
          err.details.forEach((detail) => {
            arrError.push(detail.message);
          });
      }
    });

    if (arrError.length) {
      return res
        .status(400)
        .json({ message: "There is a validation error", error: arrError });
    }

    next();
  };
}
