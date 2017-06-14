function marshal(model, fields) {
  let output = {}
  for (const key in fields) {
    let value = null;
    if (Object.getPrototypeOf(fields[key].constructor).name === 'RawField') {
      originalKey = fields[key].attribute ? fields[key].attribute : key;
      value = fields[key].output(model[originalKey])
    } else {
      value = model[key]
    }
    output[key] = value;
  }

  return output
}


function marshal_with(model, fields) {
  if (Array.isArray(model)) {
    let results = []
    model.forEach((m) => {
      results.push(marshal(m, fields))
  })
    return results
  }
  return marshal(model, fields)
}

class RawField {
  constructor(config = {}) {
    this.attribute = config.attribute ? config.attribute : null;
    this.defaultValue = config.defaultValue ? config.defaultValue : null;
  }

  output(data) {
    return null
  }

  getAttribute(key) {
    if (this.attribute !== null) {
      return this.attribute;
    }
    return key;
  }
}

class StringField extends RawField {
  constructor(config) {
    super(config);
  }

  output(data) {
    return data ? String(data) : this.defaultValue;
  }
}

class DefaultField extends RawField {
  constructor(config) {
    super(config);
  }

  output(data) {
    return data !== undefined ? data : this.defaultValue;
  }
}

class NestedField extends RawField {
  constructor(config = {}) {
    super(config);
    this.fields = config.fields ? config.fields : null;
  }

  output(data) {
    return marshal_with(data, this.fields)
  }
}

module.exports.field = {
  RawField: RawField,
  StringField: StringField,
  DefaultField: DefaultField,
  NestedField: NestedField
};

module.exports.marshal_with = marshal_with;
