
function pin_name(el) {
	l = el.classList;
	return l[l.length-1];
}

function get_param(){
	param = {};
	$(".param").each(function(){
		param[pin_name(this)] = $(this).val();
	});
	console.log(param);
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
			hal[pin_name(this)] = this.checked;
		}
		if (this.type=="text")
		{	
			hal[pin_name(this)] = this.value;
		}
		
		
	});
	console.log(hal);
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

function on_load(){
$("body").keydown(0,function(a){console.log(a.keyCode)});
}
//set_data({"xpos":1123, "ypos":"13.2"});


