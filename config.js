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

config.twilio_sid = "AC20775dc15a1598af7e86c5ce40dd4e43";
config.twilio_auth_token = "eb2b86382d4d3009391142d6839a26b1";
config.twilio_number = "+19414445652";

