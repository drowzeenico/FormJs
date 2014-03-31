/**
	Javascript form handler
	jQuery >= 1.10 is required
*/

	var Form = function ( options ) {

		// jquery form object
		this.formObject = null;

		//form id
		this.id = null;

		// form method
		this.method = 'GET';

		//form action
		this.action = null;

		// form status
		this.valid = true;

		// validation rules
		this.rules = null;

		this.error = '';

		this.data = null;

		this.errorFields = {};

		// call this before send
		this.before = function () {};

		// call this after send
		this.after = function () {};

		// success request handler
		this.success = function () {};

		// if form is not valid
		this.fails = function () {};

		// calling constructor
		this.init( options );
	};

	// validation types
	Form.prototype.types = {
		alpha: function (value) {
			var regexp = /^[A-ZА-Я]+$/i;
			return regexp.test(value);
		},
		alphanum: function (value) {
			var regexp = /^[0-9A-ZА-Я]+$/i;
			return regexp.test(value);
		},
		int : function (n) {
			return n == parseInt(n, 10);
		},
		float : function (n) {
			return n == parseFloat(n, 10);
		},
		email : function (value) {
			var regexp = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return regexp.test(value);
		},
		url : function (value) {
			var regexp = /^https?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/;
			return regexp.test(value);
		},
		required : function (value) {
			return (value == null || value == '') ? false : true;
		},
		length : function (value, data) {
			var len = value.length, min = data[0], max = data[1];
			return (len >= min && len <= max) ? true : false;
		},
		max : function (value, lim) {
			return value <= lim ? true : false;
		},
		min : function (value, lim) {
			return value >= lim ? true : false;
		},
		regexp : function (value, regexp) {
			return regexp.test(value);
		}
	};

	// constructor
	Form.prototype.init = function ( options ) {
		for ( var key in options )
			this[key] = options[key];

		if( this.id == null ) {
			this.error = 'You have to define form id';
			return false;
		}

		this.formObject = $('#' + this.id);
		this.registerHandler();
	};

	// registering submit handler
	Form.prototype.registerHandler = function () {
		var iam = this;
		$(document).on('submit', 'form#' + this.id, function(event, data) {
			// turn off default browser action
			event.preventDefault();

			iam.getData();

			iam.before();

			// validate form data by the rules
			if(iam.rules != null && iam.validate() == false) {
				var data = {};
				data.valid = iam.valid;
				data.fields = iam.errorFields;
				iam.fails(data);
			}
			else
				iam.send();

			iam.after();
		});
	}

	// get Form data and create unserialize to object
	Form.prototype.getData = function() {
		this.valid = true;
		this.errorFields = {};
		formData = this.formObject.serialize();
		this.data = this.unserialize(formData);
	};

	// fend form
	Form.prototype.send = function () {
		this.method = this.formObject.attr('method') || this.method;
		this.action = this.formObject.attr('action');

		if(this.method && this.action) {
			var requestMethod = (this.method).toLowerCase();
			if($[requestMethod] == undefined)
				return console.log('Error: ' +requestMethod+' method is undefined');

			$[requestMethod](this.action, this.data, function(response) {
				console.log(response);
			}, 'json');
		}
		else
			console.log('Error: Method or action of form is undefined');
	};

	// validate form
	Form.prototype.validate = function () {
		for (var key in this.rules) {
			for (var criteria in this.rules[key]) {
				if (this.types[criteria](this.data[key], this.rules[key][criteria]['need']) === false) {
					this.valid = false;
					this.errorFields[key] = this.rules[key][criteria]['error'];
					break;
				}
			}
		}

		return this.valid;
	};

	Form.prototype.unserialize = function ( serializedString ) {
		var str = decodeURI(serializedString); 
		var pairs = str.split('&');
		var obj = {}, p, idx;
		for (var i = 0, n = pairs.length; i < n; i++) {
			p = pairs[i].split('=');
			idx = p[0];

			if(p[1] === 'on')
				p[1] = 1;

			if (obj[idx] === undefined)
				obj[idx] = unescape(p[1]);
			else {
				if (typeof obj[idx] == "string")
					obj[idx] = [obj[idx]];

				obj[idx].push(unescape(p[1]));
			}
		}
		return obj;
	};
