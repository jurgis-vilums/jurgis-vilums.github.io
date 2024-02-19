var Countdown = jQuery.Class.create({
	options : {
			digitWidth: 45,
			digitHeight: 83,
			animateSpeed: 1000,
			animateDelay: 20,
			animateShortDelay: 5,
			counter: 0,
			digits: 7,
			steps: 6,
			cookieToLive: 1,
			parentWidth: 679,
			largeMargin: 12
	},
	
	digits :[],
	
	obj : null,
	
	countCall: 0,
	
	locked: false,
	
	init: function(obj, options) {
		this.obj = $(obj);
		this.options = $.extend(this.options, options);
		this.countdown();
	},
	//plugin name - countdown
	countdown: function() {
		
		if (parseInt($.cookie('countdown'))>0) {
			this.options.counter = Math.max(parseInt($.cookie('countdown')), this.options.counter);
		}
		
		
		var o = this.options;
		
		var counter_string = o.counter+'';
		
		o.digits = counter_string.length;
		this.obj.width(0);
		for (var i=0; i<o.digits; i++) {
			this.digits.push($('<div class="digit" style="background-position: 50% 0px; float: left;"></div>"').appendTo(this.obj));
			this.obj.width(this.obj.width()+o.digitWidth+1);
		}

		this.digits = this.digits.reverse();
		
		for (var i=0; i<this.digits.length; i++) {
			if (i%3==0) { 
				this.digits[i].css('marginRight', (o.largeMargin-1)+'px');
				this.obj.width(this.obj.width()+o.largeMargin-1);
			}
		}
		
		$('<div class="ls"></div>"').appendTo(this.obj)
		
		this.obj.width(this.obj.width()+this.obj.children('.ls').width()+2);
		
		o.parentWidth = this.obj.parent().width() || o.parentWidth;
		this.obj.css('left', (( o.parentWidth-this.obj.width() ) / 2) + 'px');

		counter_string = counter_string.split('').reverse().join('');

		for (var i=0; i<counter_string.length; i++) {
			this.digits[i].css('backgroundPosition', '50% -'+parseInt(parseInt(counter_string.slice(i,i+1)) * o.steps * o.digitHeight)+'px');
			//this.digits[i].css('background-position', '0px -'+(parseInt(counter_string[i]) * o.steps * o.digitHeight)+'px');
		}
		
		//this.obj.at_intervals(this.countTimerUp, { delay: o.animateSpeed}, this);
   	},
   	
   	countTimerUp: function() {
   		if (this.locked) return false;
   		this.countUp();
   	},
   	
   	countUp: function(){
   		
   		var o = this.options;
   		o.counter++;
   		this.countCall++;
   		
   		
   		counter_string = o.counter+'';
   		counter_array = counter_string.split('').reverse();
			
		for (var j=0; j<this.digits.length; j++) {

			var bgpos = 1;
			if (j>0) {
				bgpos = this.digits[j-1].css('backgroundPosition').split(' ');
				bgpos = parseInt(bgpos[1]);
			}
			
			//if (j!=0 && ( Math.abs(bgpos) % (10*o.digitHeight*o.steps) ) != (10*o.digitHeight*o.steps)-(o.steps*o.digitHeight)) break;
			if (j!=0 && counter_array[j-1]!=0) break;
			
			this.digits[j].queue("fx", []);
			
			this.digits[j].css('backgroundPosition', '50% -'+parseInt((counter_array[j]==0?9:counter_array[j]-1) * o.steps * o.digitHeight)+'px');
		
			for (var i=1; i<=o.steps; i++) {
				this.digits[j].delay(o.animateDelay).animate({'left': 0}, 0, function(){
					var bgpos = $(this).css('backgroundPosition').split(' ');
					bgpos = parseInt(bgpos[1]);	
					$(this).css('backgroundPosition', '50% '+((bgpos - o.digitHeight)%(10*o.digitHeight*o.steps))+'px'); 
				} );
			}
		
		}
		
		$.cookie('countdown', o.counter, { path: '/', domain: location.host, secure: true });
		
		var counter_string = o.counter+'';
		if (counter_string.length == o.digits+1) {
			o.digits++;
			this.digits.push($('<div class="digit" style="background-position: 50% -'+(o.digitHeight*o.steps)+'px;"></div>"').insertBefore(this.obj.children('div:first')));
			
			this.obj.width(this.obj.width()+o.digitWidth+1);
			
			if ((o.digits-1)%3==0) { 
				this.digits[o.digits-1].css('marginRight', (o.largeMargin-1)+'px');
				this.obj.width(this.obj.width()+o.largeMargin-1);
			}
			
			o.parrentWidth = this.obj.parent().width() || o.parrentWidth;
			this.obj.css('left', ( o.parrentWidth-this.obj.width() ) / 2);
		}
	},
	
	goTo : function(new_counter) {
		if (new_counter<this.options.counter) return;
		
		this.lock();
		
		var o = this.options;
		
		o.counter = new_counter;
		
		var counter_string = o.counter+'';
		while (counter_string.length>o.digits) {
			o.digits++;
			this.digits.push($('<div class="digit" style="background-position: 50% 0px;"></div>"').insertBefore(this.obj.children('div:first')));
			
			this.obj.width(this.obj.width()+o.digitWidth+1);
			
			if ((o.digits-1)%3==0) { 
				this.digits[o.digits-1].css('marginRight', (o.largeMargin-1)+'px');
				this.obj.width(this.obj.width()+o.largeMargin-1);
			}
			
			o.parrentWidth = this.obj.parent().width() || o.parrentWidth;
			this.obj.css('left', ( o.parrentWidth-this.obj.width() ) / 2);
		}
		
		counter_string = counter_string.split('').reverse().join('');
		
		var max_steps = 0;

		for (var j=0; j<counter_string.length; j++) {
			this.digits[j].queue("fx", []);
     		this.digits[j].stop();

			bgpos = this.digits[j].css('backgroundPosition').split(' ');
			bgpos = parseInt(bgpos[1]);
			bgpos = bgpos-(bgpos % o.digitHeight);
			this.digits[j].css('backgroundPosition', '50% '+bgpos+'px');
			
			var steps_length = bgpos + parseInt((parseInt(counter_string.slice(j,j+1))+10) * o.steps * o.digitHeight);
			var steps = Math.abs( steps_length  / o.digitHeight);
			
			
			max_steps = Math.max(max_steps, steps);

			for (var i=1; i<=steps; i++) {
				this.digits[j].delay(o.animateDelay).animate({'left': 0}, 0, function(){
					var bgpos = $(this).css('backgroundPosition').split(' ');
					bgpos = parseInt(bgpos[1]);	
					$(this).css('backgroundPosition', '50% '+((bgpos - o.digitHeight)%(10*o.digitHeight*o.steps))+'px'); 
				} );
			}
		}
		var self = this;
		setTimeout(function(){ self.unlock.apply(self) }, max_steps*o.animateDelay);
		
	},
	
	goToLow: function(new_counter) {
		if (new_counter<=this.options.counter || this.locked==true) return;
		
		this.lock();
		
		var self = this;
		var timer = 0;
		
		var animateDelay = this.options.animateDelay;
		this.options.animateDelay = this.options.animateShortDelay;
		
		var difference = new_counter-this.options.counter;
		
		for (var i=0; i<difference; i++) {
			setTimeout(function(){self.countUp()}, timer);
			timer = timer + this.digits.length * this.options.steps * this.options.animateDelay;
		}

		setTimeout(function(){ 
			self.locked = false;
			self.options.animateDelay = animateDelay;
			//self.obj.data('at_intervals').should_pause = false;
		 }, timer);
		
		
	},
	
	lock: function() {
		this.locked = true;
		//this.obj.data('at_intervals').should_pause = true;
	},
	
	unlock: function() {
		this.locked = false;
		//this.obj.data('at_intervals').should_pause = false;
	}
   	
});