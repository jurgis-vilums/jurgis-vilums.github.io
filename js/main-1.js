function win( url, w, h, resize ) {
	if( !w ) w = 500;
	if( !h ) h = 400

	w = parseInt( w );
	h = parseInt( h );

	var aw = screen.availWidth;
	var ah = screen.availHeight;
	if( w > aw ) w = aw;
	if( h > ah ) h = ah;

	if( resize == null || !/^[01]$/.test( resize.toString() ) ) {
		resize = 1;
	}

	var l = Math.round( ( aw - w ) / 2 );
	var t = Math.round( ( ah - h ) / 2 );

	return window.open( url, "_blank", 'channelmode=0, directories=0, height='+h+'px, width='+w+'px, location=0, menubar=0, resizable='+resize+', scrollbars=1, status=0, toolbar=0, top='+t+'px, left='+l+'px' );
}

//проигрывает указанный .mp3 файл (громкость -- [1-100])
function _sound(sound, volume) {
	var cc = arguments.callee;
	var player = '/js/play.swf';
	if( volume == null ) volume = 80;
	
	if( sound == null ) {
		if( cc.obj ) cc.obj.innerHTML = '';
		return;
	}
	if( !cc.obj ) {
		cc.obj = document.createElement( 'div' );
		cc.obj.style.position = 'absolute';
		cc.obj.style.left = '0px';
		cc.obj.style.top = '-1000px';
		document.body.appendChild( cc.obj );
	}
	
	//stop prev
	_sound();
	
	//run now
	cc.obj.innerHTML = 
	'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"' +
	'	codebase="https://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"' +
	'	style="height: 0px; width: 0px;>' +
	'<param name="allowScriptAccess" value="sameDomain">' +
	'<param name="movie" value="' + player + '">' +
	'<param name="flashvars" value="name=' + sound + '&volume=' + volume + '">' +
	'<embed src="' + player + '" allowScriptAccess="sameDomain"' +
	'	type="application/x-shockwave-flash" pluginspage="https://www.macromedia.com/go/getflashplayer"' +
	'	flashvars="name=' + sound + '&volume=' + volume + '"' +
	'	style="height: 0px; width: 0px;">' +
	'</object>';
}


function getChildsByTagName( name, obj, near ) {
	if( !obj ) obj = document.body;
	var reg = name.match( /([a-z]+[0-9]*)/gi );
	if( !reg ) return [];
	reg = new RegExp( "^("+reg.join( '|' )+")$", 'i' );
	
	var ret = [];
	var cld = obj.childNodes;
	for( var i = 0; i < cld.length; i ++ ) {
		if( reg.test( cld[i].tagName ) ) {
			ret.push( cld[i] );
			if( near ) continue;
		}
		ret = ret.concat( getChildsByTagName( name, cld[i], near ) );
	}
	return ret;
}

function getParentByTagName( name, obj ) {
	name = name.toUpperCase();
	
	var prnt = obj.parentNode;
	if( !prnt ) return false;
	if( prnt.tagName == name ) return prnt;
	return getParentByTagName( name, prnt );
}

function msie6_png(obj) {
	if( !window.clientInformation ) return;
	var v = window.clientInformation.appVersion.match( /MSIE\s+([0-9]+)/i );
	if( !v || !v[1] ) return;
	if( v[1] > 6 ) return;
	if( !/\.png/i.test( obj.src ) ) return;
	
	with( obj ) {
		style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + src + ",sizingMethod=crop)";
		src = "/img/pixel.gif";
	}
}
//javascript analog of PHP function
function number_format(number, decimals, dec_point, thousands_sep){
	var exponent = "";
	var numberstr = number.toString ();
	var eindex = numberstr.indexOf ("e");
	var i, z;
	if(eindex > -1){
		exponent = numberstr.substring (eindex);
		number = parseFloat (numberstr.substring (0, eindex));
	}
  
	if(decimals != null){
		var temp = Math.pow (10, decimals);
		number = Math.round (number * temp) / temp;
	}
	var sign = number < 0 ? "-" : "";
	var integer = (number > 0 ? Math.floor (number) : Math.abs (Math.ceil (number))).toString ();
	
	var fractional = number.toString ().substring (integer.length + sign.length);
	dec_point = dec_point != null ? dec_point : ".";
	fractional = decimals != null && decimals > 0 || fractional.length > 1 ? (dec_point + fractional.substring (1)) : "";
	if(decimals != null && decimals > 0){
		for(i = fractional.length - 1, z = decimals; i < z; ++i)
		fractional += "0";
	}
	
	thousands_sep = (thousands_sep != dec_point || fractional.length == 0) ? thousands_sep : null;
	if(thousands_sep != null && thousands_sep != ""){
		for (i = integer.length - 3; i > 0; i -= 3)
		integer = integer.substring (0 , i) + thousands_sep + integer.substring (i);
	}
	return sign + integer + fractional + exponent;
}

function htmlspecialchars( txt ) {
	return txt.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
}

function quot( txt ) {
	return txt.replace( /"/g, '&quot;' );
}

function js( txt ) {
	txt = txt.replace( /\\/g, '\\' );
	txt = txt.replace( /\r/g, '\\r' );
	txt = txt.replace( /\n/g, '\\n' );
	txt = txt.replace( /"/g, '\\"' );
	return txt;
}

function month_length( date ) {
	var dm = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var yy = date.getFullYear();
	if( (yy % 4 == 0 && yy % 100) || yy % 400 == 0 ) dm[1] = 29;
	return dm[date.getMonth()];
}

//v0.2 разбор текста и возврать его в формате Date()
function strtotime(date) {
	//простой формат
	var m = date.match( /^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(\s([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2}))?)?$/ );
	if( m ) {
		if( !m[4] ) return new Date( m[1], m[2] - 1, m[3] );
		return new Date( m[1], m[2] - 1, m[3], m[5], m[6], (m[7] ? m[8] : 0) );
	}
	
	//формат +- (необходимый в данный момент минимум)
	var m = date.match( /([\+\-])\s*([0-9]+)\s*(day|minute|hour|month|year)/i );
	if( m ) {
		var dd = new Date();
		var diff = m[2] * (m[1] == '+' ? 1 : -1);
		if( m[3] == 'day' )		dd.setDate( dd.getDate() + diff );
		if( m[3] == 'minute' )	dd.setMinutes( dd.getMinutes() + diff );
		if( m[3] == 'hour' )	dd.setHours( dd.getHours() + diff );
		if( m[3] == 'month' )	dd.setMonth( dd.getMonth() + diff );
		if( m[3] == 'year' )	dd.setYear( dd.getFullYear() + diff );
		return dd;
	}
	
	return new Date();
}

//v1.1
function date( format, time ) {
	if( !time ) time = new Date();
	var ret = format;
	with( time ) {
		ret = ret.replace( /(^|[^\\])Y/g, _esc( "$1"+getFullYear() ) );
		ret = ret.replace( /(^|[^\\])m/g, _esc( "$1"+withnull( getMonth() + 1) ) );
		ret = ret.replace( /(^|[^\\])n/g, _esc( "$1"+(getMonth() + 1) ) );
		ret = ret.replace( /(^|[^\\])d/g, _esc( "$1"+withnull( getDate() ) ) );
		ret = ret.replace( /(^|[^\\])H/g, _esc( "$1"+withnull( getHours() ) ) );
		ret = ret.replace( /(^|[^\\])i/g, _esc( "$1"+withnull( getMinutes() ) ) );
		ret = ret.replace( /(^|[^\\])s/g, _esc( "$1"+withnull( getSeconds() ) ) );
		ret = ret.replace( /(^|[^\\])j/g, _esc( "$1"+getDate() ) );
		ret = ret.replace( /(^|[^\\])G/g, _esc( "$1"+getHours() ) );
		ret = ret.replace( /(^|[^\\])w/g, _esc( "$1"+getDay() ) );
		ret = ret.replace( /(^|[^\\])y/g, _esc( "$1"+getFullYear().toString().replace( /^[0-9]{2}([0-9]{2})$/, '$1' ) ) );
		ret = ret.replace( /(^|[^\\])t/g, _esc( "$1"+month_length( time ) ) );
		ret = ret.replace( /(^|[^\\])M/g, _esc( "$1"+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][getMonth()] ) );
		ret = ret.replace( /(^|[^\\])l/g, _esc( "$1"+['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][getDay() - 1] ) );
	}
	return ret.replace( /\\/g, "" );
	
	function withnull( num ) {
		return ('0' + num).replace( /^.?(..)$/, '$1' );
	}
	function _esc( val ) {
		return val.replace( /([YmndHisjGwytMl])/g, "\\$1" );
	}
}

function _parse_color( color ) {
	var dcol = {
		aqua: '#00FFFF',	black: '#000000',	blue: '#0000FF',	fuchsia: '#FF00FF',
		gray: '#808080',	green: '#008000',	lime: '#00FF00',	maroon: '#800000',
		navy:'#000080',		olive: '#808000',	purple: '#800080',	red: '#FF0000',
		silver: '#C0C0C0',	teal: '#008080',	white: '#FFFFFF',	yellow: '#FFFF00'
	};

	if( dcol[color.toLowerCase()] ) color = dcol[color.toLowerCase()];
	else {
		var tmp = color.match( /rgb\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/i );
		if( tmp ) {
			color = '#';
			for( var i = 1; i <= 3; i ++ ) {
				color += parseInt( tmp[i] ).toString(16);
			}
		}
	}
	
	var m = color.match( /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i );
	if( !m ) return new Array();
	
	delete m[0];
	return m;
}

function _middlec( sc, ec, proc ) {
	sc = _parse_color( sc );
	ec = _parse_color( ec );
	
	var ret = new Array();
	for( var i = 1; i <= 3; i ++ ) {
		sc[i] = parseInt( sc[i], 16 );
		ec[i] = parseInt( ec[i], 16 );
		ret[i] = sc[i] + (ec[i] - sc[i]) * proc / 100;
		ret[i] = Math.round( ret[i] );
		ret[i] = ret[i].toString( 16 )
		ret[i] = ('0' + ret[i]).replace( /^.*(.{2})$/, "$1" );
	}
	return '#' +  ret.join( '' );
}

function alert_r(obj, inline, callcnt) {
	if( !inline ) inline = false;
	if( !callcnt ) callcnt = 0;
	
	var type = typeof obj;
	if( type != 'array' && type != 'object' ) {
		if( inline ) {
			return obj;
		}
		alert(obj);
		return;
	}
	
	var sep = '';
	for( var i = 0; i < callcnt; i ++ ) {
		sep += "\t";
	}
	
	var r = '';
	r += type + " (" + sep + "\n";
	for( var i in obj ) {
		try {
		//	if( !/height/i.test(i) ) continue;
			//r += sep + "\t" + "[" + i + "] = " + alert_r( obj[i], 1, callcnt + 1 ) + "\n";
			r += sep + "\t" + "[" + i + "] = " + obj[i] + "\n";
		}
		catch(e) {}
	}
	r += sep + ")\n";
		
	
	if( inline ) {
		return r;
	}

	alert(r);
}

function rad2deg( ang ) { return ang / Math.PI * 180; }
function deg2rad( ang ) { return ang * Math.PI / 180; }

//v2.0 установка/снятие кукиса
function setcookie( name, val, term ) {
	//установка
	if( val != null ) {
		var set = name+"="+val+";path=/;Domain=." + location.host;
		if( term ) set += ";expires=" + date( 'l,j-M-Y H:i:s \\G\\M\\T', term );
		document.cookie = set;
		return;
	}
	//снятие
	document.cookie = name + "=;path=/;Domain=." + location.host + ";expires=Friday,25-Feb-2000 12:00:00 GMT";
}

//парсинг имеющихся кукисов
function _COOKIE() {
	var ret = {};
	var tmp = document.cookie.split( /\s*;\s*/ );
	for( var i = 0; i < tmp.length; i ++ ) {
		var c = tmp[i].split( /=/ );
		ret[unescape( c[0] )] = unescape( c[1] );
	}
	return ret;
}

//парсинг гет-строки
function _GET() {
	var ret = {};
	var tmp = location.search.replace( /^\?/, '' );
	if( tmp == '' ) return ret;
	tmp = tmp.split( /&/g );
	
	for( var i = 0; i < tmp.length; i ++ ) {
		var c = tmp[i].split( /=/ );
		ret[unescape( c[0] )] = c[1] == null ? '' : unescape( c[1] );
	}
	return ret;
}

//тестовая функция для отслеживания событий
function _debug(txt, add) {
	if( !/tester=1/.test( document.cookie ) ) return;
	var cc = arguments.callee;
	if( !cc.obj ) {
		cc.obj = document.createElement("DIV");
		with(cc.obj) {
			style.zIndex = 100000;
			style.backgroundColor = "buttonface";
			style.border = "outset 2px;";
			style.right = "0px";
			style.bottom = "0px";
			style.width = "400px";
			style.height = "400px";
			style.padding = "5px";
			style.position = "fixed";
			style.cssText += ';//position: absolute';
			style.cssText += ';//margin-top: expression( parseInt( document.body.scrollTop ) + "px" )';
			style.cssText += ';//margin-left: expression( parseInt( document.body.scrollLeft ) + "px" )';
			innerHTML = '<form><textarea wrap="off" style="font-family: Lucida console; font-size: 11px; overflow: auto; width: 390px; height: 390px;" id="debug_ta"></textarea></form>';
		}
		document.body.appendChild(cc.obj);
		cc.txt = document.getElementById( "debug_ta" );
	}
	txt = alert_r( txt, 1 )
	if( add ) {
		cc.txt.value += txt + '\n';
	}
	else {
		cc.txt.value = txt + '\n';
	}
	cc.txt.scrollTop = 100000000000;
}