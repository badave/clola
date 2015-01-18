/** ------------------------------------------------------------------------------------------------------------ *
 * @class: Timer
 * @classDescription: implements a timer class to handle timed events
 * @author: Sebastian Martens
 ** ------------------------------------------------------------------------------------------------------------ */
function Timer( obj ){
	this.isRunning = false; // is timer currently running
	this.interval = 500; // default interval of event calls
	
	this.funcRef = null; // reference to called function
	this.scope = this; 
	
	this._timerId = 0; // global timer id
	
	/**
	 * @constructor
	 * @param {Object} obj - construction parameter
	 */
	this.construct = function( obj ){
		this.mixIn( obj, this );
		// find smallest not used timer id
		while( document[ 'myTimer'+this._timerId ]!=null ) this._timerId++;
		document[ 'myTimer'+this._timerId ] = this;
	};
	
	/**
	 * mix a given object into this object
	 * @param {Object} obj - given object with parameters
	 */	
	this.mixIn = function( obj, scope ){
		if(!scope) scope = this;
		var item = null;
		for(item in obj){
			scope[ item ] = obj[item];
		}
	};
	
	/**
	 * starts timer
	 * @param {Int} interval - time in milliseconds for time interval
	 * @param {Node} scope - the execution scope of the reference function
	 * @param {Function} funcRef - function reference of function to be called on time event
	 */
	this.start = function( funcRef, scope, interval ){
		if(interval) this.interval = interval;
		
		this.scope = scope;		
		this.funcRef = funcRef;
		this.isRunning = true;
		this.startTimer();
	};
	
	/**
	 * starts a new time event call with given time interval
	 */
	this.startTimer = function(){
		if( !this.isRunning ) return; 
		window.setTimeout("document['myTimer"+this._timerId+"'].timedHandler()",this.interval);
	};
	
	/**
	 * stopps the timer
	 */	
	this.stopp = function(){
		this.isRunning = false;
	};
	
	/**
	 * timed event handler. will be called on each time event
	 */
	this.timedHandler = function(){
		if( this.isRunning ){
			if( this.funcRef ){
				this.funcRef.apply(this.scope);
			}else this.stopp();
			
			// do next timer call
			this.startTimer();
		}
	};
	
	// constructor call
	this.construct( obj );
}