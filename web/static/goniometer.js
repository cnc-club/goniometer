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

function get_data()
{
	hal = {}
	$(".pin-out").each(function(){
		//console.log(this);
		{
		if (this.type=="radio")
			hal[pin_name(this)] = this.checked;
		}
		if (this.type=="button")
		{	
		//	console.log(this)
			hal[pin_name(this)] = $(this).attr("active")=="true";
		}
		if (this.type=="text")
		{	
			hal[pin_name(this)] = this.value;
		}
		
		
	});
	return hal;
	
}

function set_data(hal)
{
	for (name in hal)
	{
		console.log(".pin-in." + name);
		
		$(".pin-in." + name).each(function(){
			console.log(this.classList);
			if ( this.classList.contains("led")>=0) {
				this.classList.remove("on");
				this.classList.remove("off");
				$(this).addClass((hal[name]?"on":"off"));
			}
			else if (this.tagName == "SPAN") 
			{$(this).text(hal[name]);} 
		});
	}
}


//set_data({"xpos":1123, "ypos":"13.2"});


function parse_data(event){
		data = JSON.parse(event.data)
	if ("type" in data){
		if (data["type"] == "get-param")
		{
			set_param(data["param"]);
		}
	}
}



function send_pin(){
	send(get_data());
}
function send(data){
	socket.send(JSON.stringify(
		data
	));
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
	$("input.param").change(function(){
		message= {"type": "set-param", "param": get_param()};
		send(message);
		});
	
	codes = {
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
		if (k in codes)
		{$("ul.jog input."+codes[k]).attr("active",true);}			
		send_pin();			
	});
	$(".keyboard-jog").keyup(0,function(a){
		k = a.keyCode;
		if (k in codes)
		{$("ul.jog input."+codes[k]).attr("active",false);}			
		send_pin();			
	});
	$(".keyboard-jog").focusout(function(){
		$("ul.jog input:button").each( function() {$(this).attr("active",false);}  );
		send_pin();
	});	

}



setInterval(send_pin, 100);

