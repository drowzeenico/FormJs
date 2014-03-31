FormJs
======

Simple library for handling forms.
Features:
- form validation
- before/after filters
- ajax form submit
- form status handling (fails or success)

Jquery >= 1.10 is required.

#### How to install

Download form.js and include it to html template:
```html
<script type="text/javascript" src="path/to/jquery.1.10.js"></script>
<script type="text/javascript" src="path/to/form.js"></script>
```

#### How to use it

Form example:
```html
  <form action="/someurl" method="POST" id="formId">
    ...
  </form>
```

Attributes 'action' and 'id' is required. 'Method' must be "POST" or "GET". 'Method' is 'GET' by default.

Then, you have to create form handler object:
```js
var form = new Form({
	id : 'formId' // required
});
```
That's it, your form will be processed by Form.js


#### Form Validation
You have to define some rules to validate form.
```js
var form = new Form({
	id : 'formId',
	rules : {
	  'formField1Name' : {
	    alpha:{error: 'ErroMessage1'},
	    //...
	    ruleN:{need: 'someValue2', error: 'ErroMessage2'},
	  }
	}
});
```
'rules' - list of form fields names. Every field have some validation rules and types. There are supported types and rules:
- alpha: only string;
- alphanum: string and numeric data;
- int: integer number;
- float: float or double number;
- email: email validation;
- url: check for valid url;
- required: field is required;
- length: string length. You have to add 'need' field for this rule;
- max: top value for integer or float fields;
- min: minimal value for integer or float fields;
- regexp: your own regexp pattern for field

How to use rules:
```js
var form = new Form({
	id : 'formId',
	rules : {
	  'formField1Name' : {
	    alpha:{error: 'Only text'},
	    alphanum: {error:'Only text or numbers'},
	    int:{error: 'This field requires int digit as a value'},
	    float:{error: 'This field requires float digit as a value'},
	    email:{error: 'This field must be email'},
	    url:{error: 'Enter correct URL'},
	    required:{error: 'This field is reqired'},
	    length:{need:[minValue, maxValue], error: 'This string\'s length must be between minValue and maxValue'},
	    max: {need: someValue, error: 'Value have to be smaller than someValue'},
	    min: {need: someValue, error: 'Value have to be higher than someValue'},
	    reqexp: {need: yourRegexp, error: 'test for yourRegexp'}
	  }
	}
});
```
Combine this rules and types and validate your form as you want.
If form validation is failed, 'form.fails()' will be called.

#### Other options
##### - form.before
This is a before-filter function. It will be called before form processing.
```js
var form = new Form({
	id : 'formId', // required,
	before: function () {
	  // do some actions before validation and submitting
	}
});
```

##### - form.after
This is a after-filter function. It will be called after form process.
```js
var form = new Form({
	id : 'formId', // required,
	after: function () {
	  // do some actions after form process
	}
});
```

##### - form.fails
Callback, that function will be called if form validation is failed. It's getting 'error' argument, that containg names of fields and error messages.
```js
var form = new Form({
	id : 'formId', // required,
	fails: function (error) {
	  // errors output
	  for(var key in error.fields)
	    console.log(error.fields[key]);
	}
});
```
##### - form.success
Callback, that function will be called after success form processing.
```js
var form = new Form({
	id : 'formId', // required,
	success: function (data) {
	   alert('Well done!');
	}
});
```

'data' argument is a json-object, responded by the server:
```json
data = {
  // form state at server side. required
  valid: true|false,
  // if server find errors we have to return them, 
  errors: {field1Name:'error1 message', field2Name: 'other error message'},
  // this object contains some data, that server was returned
  data: {}
};
```

Some php example:
```php
  <?php
    if(!formDataValidate())
      echo json_encode(
        array (
          'valid' => false,
          'errors' => array (
            'formField1Name' => 'Error message',
            'formField2Name' => 'Another error message'
          )
        )
      );
    else
      echo json_encode (
        array (
          'valid' => true,
          'data' => array ('navigateTo' => 'site.com')
        )
      );
  ?>
```
