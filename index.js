function marshal(model, fields) {
  let output = {}
  for (const key in fields) {
    if (key in model) {
      let value = null;
      let finalKey = key;
      if (Object.getPrototypeOf(fields[key].constructor).name === 'RawField') {
        value = fields[key].output(model[key])
        finalKey = fields[key].getAttribute(key)
      } else {
        value = model[key]
      }
      output[finalKey] = value;
    } else {
      output[key] = null;
    }
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
    return String(data ? data : this.defaultValue);
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
  NestedField: NestedField
};

module.exports.marshal_with = marshal_with;