var config = module.exports = {};

var env = process.env.NODE_ENV;
config.env = env || 'development';

if (env === 'production') {
	config.test = false; // default: false
	config.localhost = false;
	config.db_url = "mongodb://leela:futura-mamart1n1!@widmore.mongohq.com:10010/clola";
	config.rabbit_url = "amqp://fewesxfs:3ITZ4-fehoXUPxnvZC7O79XZDyZvuJog@lemur.cloudamqp.com/fewesxfs";
	
	// socket settings
  config.redis_port = "17935";
  config.redis_host = "pub-redis-17935.us-east-1-2.3.ec2.garantiadata.com";
  config.redis_auth_key = "ns3uGTP8sUmKAepo";
} else if (env === 'staging') {
	config.test = false; // default: false
	config.localhost = false;
	config.db_url = "mongodb://leela:futura-mamart1n1!@widmore.mongohq.com:10010/clola";
	config.rabbit_url = "amqp://fewesxfs:3ITZ4-fehoXUPxnvZC7O79XZDyZvuJog@lemur.cloudamqp.com/fewesxfs";
	
	// socket settings
	config.redis_port = "18856";
	config.redis_host = "pub-redis-18856.us-east-1-4.1.ec2.garantiadata.com";
	config.redis_auth_key = "4eGEfwCG5p3i3JmN";
} else {
	config.test = true; // default: true
	config.localhost = true;
	config.db_url = "mongodb://leela:futura-mamart1n1!@widmore.mongohq.com:10010/clola_dev";
	// config.rabbit_url = "amqp://localhost";
	// comment this out on local host... I haven't gotten the production CDN and javascript loaders working yet
	config.rabbit_url = "amqp://fewesxfs:3ITZ4-fehoXUPxnvZC7O79XZDyZvuJog@lemur.cloudamqp.com/fewesxfs";
	
	// socket settings config.redis_port = "18856";
	config.redis_port = "19874";
  config.redis_host = "pub-redis-19874.us-east-1-4.1.ec2.garantiadata.com";

  config.redis_auth_key = "NA35IaD1kdHR66Pq";
}

config.support_email = "support@clola.com";

config.manifest = require('./manifest.json');

config.title = "Clola";

config.twilio_sid = "AC20775dc15a1598af7e86c5ce40dd4e43";
config.twilio_auth_token = "eb2b86382d4d3009391142d6839a26b1";
config.twilio_number = "+19414445652";

config.cdn_assets_url = "/assets";
