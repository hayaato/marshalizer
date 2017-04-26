# Marshalizer

## Introduction
Marshalizer provide an easy reusable way to format data you send for render.
With Marshalizer, you can use any object (ORM models/custom classes/etc.).

Thanks to the output_fields, you can define what attribute will be present in the returned object.

## Basic Usage

```javascript
var marshalizer = require('marshalizer');
var book_output_field = {
    id: new marshalizer.field.StringField(),
    name: new marshalizer.field.StringField()
};

app.use('/books', function(req, res, next) {
    BookSchema.find({}, function(err, books) {
        res.json(marshilizer.marshal_with(books, book_output_field))
    });
});
```
If you have a document from database like:
```javascript
book = {id: "47478fds4fd4s894fdszab8", name: 'Poney book', __v: 0, super_secret_data: 'my beautiful secret', price: 10.5}
```
The result of:
```javascript
marshalizer.marshal_with(book, book_output_field);
```
will return:
```javascript
{id: "47478fds4fd4s894fdszab8", name: 'Poney book'}
```

## Renaming Attribute
Because sometime, your sent data has not to be as the private data, you can define the public key of the object by giving the 'attribute' keyword
```javascript
book_output_fields = {
    'id': marshalizer.field.String(),
    'name': marshalizer.field.String({attribute: 'private_name'}),
}
```

## Define your own field
Your custom field must extends marshalizer.field.RawField

#### Example
```javascript
class CustomPriceField extends field.RawField {
  constructor(config) {
    super(config)
  }

  output(price) {
    return String(price) + '$';
  }
}
```
Then, you can use it:
```javascript
var book_output_field = {
    id: new marshalizer.field.StringField(),
    name: new marshalizer.field.StringField()
};

app.use('/books', function(req, res, next){
    res.json(marshalizer.marshal_with(books, book_output_field));
    /* This will return
    [{
        id: "47478fds4fd4s894fdszab8",
        name: 'Poney book',
        price: '10.5$'
    }]
    /*
});
```

## Nested Fields
Sometimes, we have documents into others. For example, books can contain author informations
```javascript
var author_output_field = {
    firstname: new marshalizer.field.StringField(),
    lastname: new marshalizer.field.StringField(),
    age: Number,
}

var book_output_field = {
    id: new marshalizer.field.String(),
    name: new marshalizer.field.String(),
    author: new marshalizer.field.NestedField({field: author_output_field}),
};

app.use('/books', function(req, res, next){
    res.json(marshalizer.marshal_with(books, book_output_field));
    /* This will return
    [{
        id: "47478fds4fd4s894fdszab8",
        name: 'Poney book',
        author: {
            firstname: 'John',
            lastname: 'Doe',
            age: 42
        }
    }]
    /*
});
```