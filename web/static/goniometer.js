$( document ).ready(init)

function pin_name(el) {
	l = el.classList;
	return l[l.length-1];
}


function load_param(){
	send({"type":"get-param"})
}

function get_param(){
	param = {};
	$(".param").each(function(){
		param[pin_name(this)] = $(this).val();
	});
	return param
}

function set_param(param){
	for (name in param)
	{
		$(".param." + name).each(function(){
			$(this).val(param[name]);
		});
	}
	
	// set_param({"tool1-x":100,"tool1-y":100});

}

function get_pin()
{
	hal = {}
	$(".pin-out").each(function(){
		
		if (this.type=="radio"){
			hal[pin_name(this)] = this.checked;
		}
		else if (this.type=="button")
		{	
			hal[pin_name(this)] = $(this).attr("active")=="true";
		}
		else 
		{	
			hal[pin_name(this)] = this.value;
		}
		
		
	});
	return hal;
	
}

function set_pin(hal)
{
	for (name in hal)
	{
		$(".pin-in." + name).each(function(){
			if ( this.classList.contains("led")) {
				this.classList.remove("on");
				this.classList.remove("off");
				$(this).addClass((hal[name]?"on":"off"));
			}
			else if (this.tagName == "SPAN") 
				{
					$(this).text(hal[name].toFixed(2));
				} 
		});
	}
}


//set_pin({"xpos":1123, "ypos":"13.2"});


function parse_data(event){
	data = JSON.parse(event.data)
	if ("type" in data){
		if (data["type"] == "get-param")
		{
			set_param(data["param"]);
		}
		if (data["type"] == "pin")
		{
			set_pin(data["pin"]);
		}
		
	}
}



function send_pin(){
	message= {"type": "pin", "pin": get_pin()};
	send(message);
}

function send(data){
	socket.send(JSON.stringify(
		data
	));
}



function init_increments(){
	$("input.inc").change(
		function(){
			v = $("input.inc:checked").val();
			$("input.increment").val(v);
			if (v == "0"){
				$(".jog .pin-out").each(function() {
					c = $(this).attr("class");
					if (c.slice(-1)!="c")
					{
						$(this).attr("class", c+"c");
					}
				})
			}
				
			else {
				$(".jog .pin-out").each(function() {
					c = $(this).attr("class");
					if (c.slice(-1)=="c")
						{$(this).attr("class", c.slice(0, -1));}
					})
	
			}
			
		}
	);

}

function init() {
	host = location.hostname;
	port = location.port;
	socket = new WebSocket("ws://" + host + ":" + port + "/ws");
	socket.onopen = function(event) {load_param();}
	socket.onmessage = parse_data;
	socket.onclose = function(event) {}
	socket.onerror = function(event) {}
	
	
	$("input:button").mousedown(function(){$(this).attr("active",true); send_pin();} );
	$("input:button").mouseup(function(){$(this).attr("active",false);  send_pin();} );
	$("input:button").mouseleave(function(){$(this).attr("active",false);  send_pin();} );
	$("body").keydown(0, function(a){
		k = a.keyCode;
		if (k==27) {
			$(".pin-out.estop").attr("active",true);}
		}
	);
	$("body").keyup(0, function(a){
		k = a.keyCode;
		if (k==27) {
			$(".pin-out.estop").attr("active",false);}
		}
	);
	
	
	
	$("input.param").change(function(){
		message= {"type": "set-param", "param": get_param()};
		send(message);
		});
	codes = {
			221:"bp",
			38: "yp",
			40: "ym",
			39: "xp",
			37: "xm",
			33: "zp",
			34: "zm",
			190:"ap",
			188:"am",
			221:"bp",
			219:"bm"
		}
	
	$(".keyboard-jog").keydown(0,function(a){
		
		k = a.keyCode;
		if (49<=k<=54)
		{
			$(".inc-"+k).click();
		}		
		if (k in codes)
		{$("ul.jog input."+codes[k]).attr("active",true);}			
		{$("ul.jog input."+codes[k]+"c").attr("active",true);}			
		send_pin();			
		if (k in codes){a.preventDefault();}
	});
	$(".keyboard-jog").keyup(0,function(a){
		k = a.keyCode;
		if (k in codes)
		{$("ul.jog input."+codes[k]).attr("active",false);}			
		{$("ul.jog input."+codes[k]+"c").attr("active",false);}			
		send_pin();
		if (k in codes){a.preventDefault();}					
	});
	$(".keyboard-jog").focusout(function(){
		$("ul.jog input:button").each( function() {$(this).attr("active",false);}  );
		send_pin();
	});	
	init_increments()
}



setInterval(send_pin, 100);

