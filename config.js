var config = module.exports = {};

var env = process.env.NODE_ENV;
config.env = env || 'development';

if (env === 'production') {
	config.test = false; // default: false
	config.db_url = "mongodb://leela:futura-mamart1n1!@widmore.mongohq.com:10010/clola";
} else if (env === 'staging') {
	config.test = false; // default: false
	config.db_url = "mongodb://leela:futura-mamart1n1!@widmore.mongohq.com:10010/clola";
} else {
	config.test = true; // default: true
	config.db_url = "mongodb://leela:futura-mamart1n1!@widmore.mongohq.com:10010/clola";
}

config.support_email = "support@clola.com";

config.title = "Clola";

