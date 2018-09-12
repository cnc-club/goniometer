$( document ).ready(init)

function pin_name(el) {
	l = el.classList;
	return l[l.length-1];
}

function generate_prog(s_type)
{

	t = $("textarea.prog");
	t.text("");
	t.text("(Start)\n");
	ang = parseFloat($("input[name=maxang]").val());
	steps = parseInt($("input[name=steps]").val());
	w = parseFloat($("input[name=w]").val());
	h = parseFloat($("input[name=h]").val());
	points = parseFloat($("select[name=points]").val());
	integration = parseFloat($("input[name=integration]").val());
	if (s_type=="" || s_type==undefined ){
		scantype = $("select[name=scantype]").val();
	} else {
		scantype = s_type;
	}
	st = ang/steps;
	console.log(scantype);
	console.log("!");

	t.append("F2500\n");
	t.append("G1 U0 V0\n");
	t.append("G1 W0\n");
	coords = []
	
	csv = $("textarea.csv");
	csv.text("");
	
	
	if (scantype=="sphere"){
		for (i=-steps;i<=steps;i++){
			for (j=-steps;j<=steps;j++){
				t.append("G01 A"+i*st +" B"+j*st+"\n");
				t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");
				coords.push([i*st,j*st])
			}
		}
		t.append("G01 A0 B0\n");		

		i = 0;
		csv.append("Номер	A	B\n");
		for (a1 in coords) {
			a = coords[a1];
			i+=1;
			csv.append(i+"	"+a[0]+"	"+a[1]+"\n");
		}

		
	} else if(scantype=="vert") {
		for (i=-steps;i<=steps;i++){
				t.append("G01 B"+i*st+"\n");
				t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");
				coords.push([0*st,i*st]);
		}
		t.append("G01 B0\n");

		i = 0;
		csv.append("Номер	A	B\n");
		for (a1 in coords) {
			a = coords[a1];
			i+=1;
			csv.append(i+"	"+a[0]+"	"+a[1]+"\n");
		}


	} else if(scantype=="hor") {
		for (i=-steps;i<=steps;i++){
				t.append("G01 A"+i*st+"\n");
				t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");
				coords.push([i*st,0*st]);
		}
		t.append("G01 A0\n");
		
		i = 0;
		csv.append("Номер	A	B\n");
		for (a1 in coords) {
			a = coords[a1];
			i+=1;
			csv.append(i+"	"+a[0]+"	"+a[1]+"\n");
		}
		
	} else if(scantype=="sq") {
		t.append("#&lt;_x0&gt; = #&lt;_x&gt;\n")
		t.append("#&lt;_y0&gt; = #&lt;_y&gt;\n")

		
		if (points==5.){	
			t.append("G01 X[#&lt;_x0&gt;+"+w*0.1+"] Y[#&lt;_y0&gt;-"+h*0.1+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");

			t.append("G01 X[#&lt;_x0&gt;+"+w*0.9+"] Y[#&lt;_y0&gt;-"+h*0.1+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");

			t.append("G01 X[#&lt;_x0&gt;+"+w*0.9+"] Y[#&lt;_y0&gt;-"+h*0.9+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");

			t.append("G01 X[#&lt;_x0&gt;+"+w*0.1+"] Y[#&lt;_y0&gt;-"+h*0.9+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");

			t.append("G01 X[#&lt;_x0&gt;+"+w*0.5+"] Y[#&lt;_y0&gt;-"+h*0.5+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");
			
			
			csv.append("Точка\n");
			csv.append("ЛВУ\n");
			csv.append("ПВУ\n");
			csv.append("ПНУ\n");
			csv.append("ЛНУ\n");
			csv.append("ЦЕНТР\n");

			
		}
		else if (points==9.){		
			t.append("G01 X[#&lt;_x0&gt;+"+w*0.1+"] Y[#&lt;_y0&gt;-"+h*0.1+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");
			t.append("G01 X[#&lt;_x0&gt;+"+w*0.5+"] Y[#&lt;_y0&gt;-"+h*0.1+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");
			t.append("G01 X[#&lt;_x0&gt;+"+w*0.9+"] Y[#&lt;_y0&gt;-"+h*0.1+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");

			t.append("G01 X[#&lt;_x0&gt;+"+w*0.1+"] Y[#&lt;_y0&gt;-"+h*0.5+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");
			t.append("G01 X[#&lt;_x0&gt;+"+w*0.5+"] Y[#&lt;_y0&gt;-"+h*0.5+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");
			t.append("G01 X[#&lt;_x0&gt;+"+w*0.9+"] Y[#&lt;_y0&gt;-"+h*0.5+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");

			t.append("G01 X[#&lt;_x0&gt;+"+w*0.1+"] Y[#&lt;_y0&gt;-"+h*0.9+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");
			t.append("G01 X[#&lt;_x0&gt;+"+w*0.5+"] Y[#&lt;_y0&gt;-"+h*0.9+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");
			t.append("G01 X[#&lt;_x0&gt;+"+w*0.9+"] Y[#&lt;_y0&gt;-"+h*0.9+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");

			csv.append("Точка\n");
			csv.append("1\n");
			csv.append("2\n");
			csv.append("3\n");
			csv.append("4\n");
			csv.append("5\n");
			csv.append("6\n");
			csv.append("7\n");
			csv.append("8\n");
			csv.append("9\n");
			
			
		}
		else { // 4 points
			t.append("G01 X[#&lt;_x0&gt;+"+w*0.1+"] Y[#&lt;_y0&gt;-"+h*0.1+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");

			t.append("G01 X[#&lt;_x0&gt;+"+w*0.9+"] Y[#&lt;_y0&gt;-"+h*0.1+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");

			t.append("G01 X[#&lt;_x0&gt;+"+w*0.9+"] Y[#&lt;_y0&gt;-"+h*0.9+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");

			t.append("G01 X[#&lt;_x0&gt;+"+w*0.1+"] Y[#&lt;_y0&gt;-"+h*0.9+ "]\n");
			t.append("O&lt;trigger&gt; CALL ["+integration+"]\n");

			csv.append("Точка\n");
			csv.append("ЛВУ\n");
			csv.append("ПВУ\n");
			csv.append("ПНУ\n");
			csv.append("ЛНУ\n");

		}
		
		
		t.append("G01 X#&lt;_x0&gt; Y#&lt;_y0&gt;\n");
	}


}





in_progress = 0;
n_string = 0;
function prog_start(){
	n_string = -1;
	in_progress = 1;
}


function prog_stop(){
	in_progress = 0;
}


function prog_run(){
	if (in_progress==1) 
	{
		send_pin();
		if (get_pin_value("mdi-busy") == false){
			n_string +=1; 
			prog = $("textarea.prog").val().split("\n");
			if (n_string < prog.length)
			{
				c = prog[n_string];
				if (c.trim() != "" )
					{
						mdi(c);
					}
			}
		}
	}
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

function value_from_el(el){
	if (el.type=="radio"){
		return el.checked;
	}
	else if (el.type=="button")
	{	
		return $(el).attr("active")=="true";
	}
	else if (el.nodeName=="SPAN"){
		return $(el).hasClass("on");
	}
	else 
	{	
		return el.value;
	}
}

function get_pin_value(n){
	p = $(".pin-out."+n+", .pin-in."+n);
	return value_from_el(p[0]);
}

function get_pin()
{
	hal = {}
	$(".pin-out").each(function(){
		hal[pin_name(this)] = value_from_el(this);
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
	
	page_count = 0;
	$(".page").each(function(){
		$(this).addClass("page-"+page_count);
		n = $("h1",this).first().text();	
		$("div.selector").append("<a class='selector' rel='page-"+page_count+"'>"+n+"</a> ")
		page_count +=1;
	});
	$("a.selector").click(function(){
		console.log($(this).attr("rel"));
		c = $(this).attr("rel"); 
		$(".page").hide();
		$(".page."+c).show();
		$("a.selector").removeClass("active");
		$(this).addClass("active");
	});
	$("a.selector").first().trigger("click");
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

function mdi(c){
	if (c.trim()!="")
	{
		console.log("MDI ",c);
		send({"type":"mdi","mdi":c})
	}
}


setInterval(send_pin, 100);
setInterval(prog_run, 500);
