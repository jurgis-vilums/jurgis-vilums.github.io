//html extentions


//button emulation
function _active(val, color, obj) {
	var cc = arguments.callee;
	if( !cc.tmp_vals ) cc.tmp_vals = [];
	
	var ch = obj.childNodes;
	if( !ch ) return;
	if( obj.parentNode.parentNode && obj.parentNode.parentNode.tagName == "TABLE" ) {
		with( obj.parentNode.parentNode ) {
			if( className == "dis" ) return;
		}
	}
	var j = 0;
	for( var i in ch ) {
		if( !/^TD$/i.test( ch[i].tagName ) ) continue;
		if( val ) {
			if( j == 1 ) {
				cc.tmp_vals[j] = ch[i].style.background;
				if( cc.pre_img ) ch[i].style.background = "url(" + cc.pre_img[color][j].src + ")";
			}
			else {
				cc.tmp_vals[j] = ch[i].childNodes[0].src;
				if( cc.pre_img ) ch[i].childNodes[0].src = cc.pre_img[color][j].src;
			}
			
		}
		else if( cc.tmp_vals[j] ) {
			if( j == 1 ) {
				ch[i].style.background = cc.tmp_vals[j];
			}
			else {
				ch[i].childNodes[0].src = cc.tmp_vals[j];
			}
		}
		j ++;
	}
}

//buttons disable
function _disable(el,dis) {
	var cc = arguments.callee;
	if( !cc.BUTTONS ) cc.BUTTONS = [];
	if( !cc.BUTTONS[el] ) cc.BUTTONS[el] = document.getElementById( el );
	if( !cc.BUTTONS[el] ) return;
	with( cc.BUTTONS[el] ) {
		className = dis ? "dis" : "";
	}
}


//x-browser range element v2.0
//usage: call this function on document load bypass arguments or after input:range creation
//use obj.set(<n>) not value=<n> for dynamic value change
function input_range(obj, forAll) {
	//check for necessarity
	var emulate = true;
	if( !forAll ) {
		var tst = document.createElement( 'input' );
		try {
			tst.type = 'range';
			if( tst.type == 'range' ) {
				emulate = false;
			}
		}
		catch(e) {}
		delete tst;
	}
	
	
	this.RANGE_MOVEELEMENT = false;
	this.XPOSITION;
	
	//detect elements
	var els = [];
	if( obj ) {
		if( typeof obj == 'object' && obj.tagName == 'INPUT' && obj.getAttribute( "type" ).toLowerCase() == 'range' ) {
			els.push( obj );
		}
		else return;
	}
	else {
		var ii = document.getElementsByTagName( 'input' );
		for( var i = 0; i < ii.length; i ++ ) {
			if( ii[i].getAttribute( "type" ).toLowerCase() != 'range' ) continue;
			els.push( ii[i] );
		}
	}
	
	//begin
	var v, el, html, size, tmp;
	while( els.length ) {
		v = els.pop();
		
		//changes value and moves runner
		if( typeof v.set == 'function' ) continue;
		v.set = function(setValue) {
			var vmin = this.getAttribute( "min" );		if( vmin === null ) vmin = 0;
			var vmax = this.getAttribute( "max" );		if( vmax === null ) vmax = 100;
			var vstep = this.getAttribute( "step" );	if( vstep === null ) vstep = 1;
			if( setValue != null ) {
				setValue = Math.round( setValue / vstep ) * vstep;
				if( setValue > vmax ) setValue = vmax;
				if( setValue < vmin ) setValue = vmin;
				this.value = setValue;
				if( this.onchange ) this.onchange();
			}
			if( !emulate ) return;
			
			var el = this.parentNode;
			var runner = el.childNodes[0];
			var size = [parseInt( el.style.width ), parseInt( el.style.height )];
			
			var margin = (this.value - vmin) / (vmax - vmin) * 100;
			margin *= size[0] - parseInt(runner.style.width);
			margin = Math.round( margin / vstep ) * vstep / 100;
			margin = Math.round( margin );
			runner.style.marginLeft = margin + 'px';
		}
		if( !emulate ) continue;
		
		//calc size
		tmp = v.currentStyle ? v.currentStyle : getComputedStyle( v, null );
		size = [
			tmp.width == 'auto' || /%$/.test( tmp.width ) ? v.scrollWidth : parseInt( tmp.width ),
			tmp.height == 'auto' || /%$/.test( tmp.height ) ? v.scrollHeight : parseInt( tmp.height )
		];
		size[0] += parseInt( tmp.paddingLeft ) + parseInt( tmp.paddingRight ) + parseInt( tmp.borderLeftWidth ) + parseInt( tmp.borderRightWidth ) - 2;
		size[1] += parseInt( tmp.paddingTop ) + parseInt( tmp.paddingBottom ) + parseInt( tmp.borderTopWidth ) + parseInt( tmp.borderBottomWidth );
		
		//prev values
		if( v.getAttribute( "min" ) === null ) v.setAttribute( "min", 0 );
		if( v.getAttribute( "max" ) === null ) v.setAttribute( "max", 100 );
		if( v.getAttribute( "step" ) === null ) v.setAttribute( "step", 1 );
		if( !/^\-?[0-9]+$/.test( v.value ) ) v.value = 50;
		
		//emulation
		el = document.createElement( 'div' );
		el.style.display = !window.innerHeight ? 'inline' : 'inline-block';	//MSIE/FFox
		el.style.cursor = 'default';
		el.style.width = size[0] + 'px';
		el.style.height = size[1] + 'px';
	//	el.onclick = function(e) {	//quick change to do
	//		if( !e ) e = event;
	//	}
		
	//	tmp = v.scrollHeight;	height: '+tmp+'px;
		el.onselectstart = function() { return false; }
		v.parentNode.replaceChild( el, v );
		
		//runner
		html =
		'<img src="/img/runner.gif" style="position: absolute; margin-top: -1px;'+
			' -moz-user-select: none; -khtml-user-select: none; user-select: none;'+
			' width: 11px; height: 21px;"'+
			' onmouseover="if(RANGE_MOVEELEMENT) return; this.src = this.src.replace(/(_over)?(\.gif)/, \'_over$2\');"'+
			' onmouseout="if(RANGE_MOVEELEMENT) return; this.src = this.src.replace(/(_over)?(\.gif)/, \'$2\');"'+
			( v.className ? ' class="'+v.className+'"' : '' ) +
			'>' +
		'<hr width="'+size[0]+'" '+(window.opera ? 'style="margin-top: 7px;"' : '')+'>';
		
		el.innerHTML = html;
		el.childNodes[0].onmousedown = function(e) {
			if( !e ) e = event;
			XPOSITION = (e.x ? e.x : e.clientX) - parseInt( this.style.marginLeft );
			RANGE_MOVEELEMENT = this;
			this.parentNode.childNodes[2].focus();
			this.src = this.src.replace(/(_over)?(\.gif)/, '_over$2');
		}
		el.childNodes[0].ondragstart = function() { return false; }
		
		//v.style.display = 'none';
		v.style.position = 'absolute';
		v.style.left = '-1000px';
		el.appendChild( v );
		v.set();
	}
	if( !emulate ) return;
	
	//declare once
	if( typeof document.body.range_ev == 'boolean' ) return;
	document.body.range_ev = true;
	(new Image()).src = '/img/runner_over.gif';	//predownload
	
	//crossbrowser events
	if( typeof document.body.attachEvent == 'undefined' ) {
		document.body.attachEvent = function(type, action) {
			document.body.addEventListener(type.replace( /^on/, '' ), action,true);
		}
	}
	
	//moveevents
	document.body.attachEvent( 'onmousemove', function(e) {
		if( !RANGE_MOVEELEMENT ) return;
		if( !e ) e = event;
		
		var v = RANGE_MOVEELEMENT.parentNode.childNodes[2];
		
		var vmin = v.getAttribute( "min" );
		var vmax = v.getAttribute( "max" );
		var vstep = v.getAttribute( "step" );
		var max = parseInt( RANGE_MOVEELEMENT.parentNode.style.width ) - parseInt( RANGE_MOVEELEMENT.style.width );
		var mrg = (e.x ? e.x : e.clientX) - XPOSITION;
		if( mrg > max ) mrg = max;
		if( mrg < 0 ) mrg = 0;
		var mrgstep = max / (vmax - vmin) * vstep;
		RANGE_MOVEELEMENT.style.marginLeft = Math.round( Math.round( mrg / mrgstep ) * mrgstep ) + 'px';
		
		//element form change
		var val = Math.ceil( vmin ) + Math.round( mrg / max * (vmax - vmin) );
		val = Math.round( val / vstep ) * vstep;
		v.value = val;
		if( v.onchange ) v.onchange();
	} );
	
	document.body.attachEvent( 'onmouseup', function() {
		if(RANGE_MOVEELEMENT) with(RANGE_MOVEELEMENT.parentNode.childNodes[0]) src = src.replace(/(_over)?(\.gif)/, '$2');
		RANGE_MOVEELEMENT = false;
	} );
	document.body.attachEvent( 'onmouseleave', function() {
		if(RANGE_MOVEELEMENT) with(RANGE_MOVEELEMENT.parentNode.childNodes[0]) src = src.replace(/(_over)?(\.gif)/, '$2');
		RANGE_MOVEELEMENT = false;
	} );
}

//кроссбраузерное вращение любого объекта на произвольный угол относительно центра
function _rotation(obj, angle) {
	angle = parseFloat( angle );
	while( angle < 0 ) angle += 360;
	while( angle >= 360 ) angle -= 360;
	
	var width = obj.scrollWidth;
	var height = obj.scrollHeight;
	var cc = arguments.callee;
	
	//<= MSIE8?
	if( cc.msie8 == null ) {
		cc.msie8 = typeof window.ActiveXObject != 'undefined';
		if( cc.msie8 ) {	//версия
			var ver = navigator.userAgent.match( /MSIE\s+([0-9\.]+)/i );
			cc.msie8 = ver && parseFloat(ver[1]) < 9;
		}
	}
	
	with( obj ) {
		style.cssText += "; -moz-transform: rotate("+angle+"deg)";
		style.cssText += "; -webkit-transform: rotate("+angle+"deg)";
		style.cssText += "; -o-transform: rotate("+angle+"deg)";
		style.cssText += "; -ms-transform: rotate("+angle+"deg)";
		style.cssText += "; transform: rotate("+angle+"deg)";
		
		//для MSIE
		if( cc.msie8 ) {
			var rad = angle * Math.PI / 180;
			var costheta = Math.cos(rad);
			var sintheta = Math.sin(rad);
			style.filter = 'progid:DXImageTransform.Microsoft.Matrix('+
				'M11='+costheta+', '+
				'M12='+(-sintheta)+', '+
				'M21='+sintheta+', '+
				'M22='+costheta+', '+
				'SizingMethod="auto expand", '+
				'enabled=true'+
			')';
		
			//коррекция отступов
			rad = angle;
			if( rad > 90 && rad <= 180 ) rad = 180 - rad;
			else if( rad > 180 && rad <= 270 ) rad -= 180;
			else if( rad > 270 && rad <= 360 ) rad = 360 - rad;
			rad *= Math.PI / 180;
			costheta = Math.cos(rad);
			sintheta = Math.sin(rad);
			var dX = Math.round( (width - (sintheta * height + costheta * width)) / 2 );
			var dY = Math.round( (height - (costheta * height + sintheta * width)) / 2 );
			
			//применяем
			if( !obj.defaultMargin ) obj.defaultMargin = [parseInt(style.marginLeft),parseInt(style.marginTop)];
			style.marginLeft = (obj.defaultMargin[0] + dX) + 'px';
			style.marginTop = (obj.defaultMargin[1] + dY) + 'px';
		}
	}
}

//плавное сворачивание/разворачивание блока
function _expand( obj, up, dir, callback, alpha ) {	//v2.3
	var cc = arguments.callee;
	if( cc.lastnum == null ) cc.lastnum = 0;	//счётчик нумерации
	if( !cc.busy ) cc.busy = [];	//список текущих разворачиваний
	if( !cc.stack ) cc.stack = [];	//спиок ожидающих разворачиваний
	if( dir == null ) dir = 'v';	//направление сворачивания по умолчанию


	//если передана ссылка только на разворачиваемый блок, определяем вложенный объект
	if( obj[0] == null && obj[1] == null ) {
		obj = [obj];	//преобразуем в массив
		obj[1] = getChildsByTagName( 'table|div|center', obj[0] );	//ищем вложенный блок, который можно абсолютно позиционировать
		if( obj[1].length ) {
			obj[1] = obj[1][0];	//первый встретившийся
		}
		else obj[1] = null;
	}
	
	//если не найден вложенный блок, то применяем простое удаление
	if( obj[1] == null ) {
		obj[0].style.display = up ? 'none' : '';
		return;
	}


	//нумерация для исключения конфликтов при одновременном разворачивании
	var num = obj[0].expandProcessNum;
	if( num == null ) {
		obj[0].expandProcessNum = num = cc.lastnum;
		cc.lastnum ++;
	}

	
	if( typeof cc.busy[num] == 'undefined' ) cc.busy[num] = '';
	if( typeof cc.stack[num] == 'undefined' ) cc.stack[num] = '';
	
	if( typeof alpha == 'undefined' ) {
		if( cc.busy[num] == '' ) {
			if( !up && obj[0].style.display != 'none' ) return;
			if( up && obj[0].style.display == 'none' ) return;
		}
		if( cc.busy[num] == 'down' ) cc.stack[num] = up ? 'up' : '';
		if( cc.busy[num] == 'up' ) cc.stack[num] = !up ? 'down' : '';
		if( cc.busy[num] != '' ) return;
	}
	
	//высота (ширина), до которой надо развернуть блок
	var maxval = dir == 'v' ? obj[1].scrollHeight : obj[1].scrollWidth;
	
	cc.busy[num] = up ? 'up' : 'down';
	
	//проверка ширины блока
	if( obj[0].once == null ) {
		obj[0].once = true;
		if( dir == 'v' ) {
			for( var i = 0; i < obj.length; i ++ ) if( !obj[i].style.width ) obj[i].setWidth = true;
		}
	}
	
	//начало разворачивания/сворачивания
	if( typeof alpha == 'undefined' ) {
		alpha = up ? 90 : 270;
		if( !up ) obj[0].style.display = '';
		
		//задаём ширину, если не задана напрямую
		for( var i = 0; i < obj.length; i ++ ) {
			if( !obj[i].setWidth ) continue;
			obj[i].style.width = obj[i].scrollWidth + 'px';
		}
		
		//в процессе разв./св. вложенный элемент позиционируем абсолютно
		if( obj[1].style.position != 'absolute' ) {
			obj[0].setAttribute( 'defheight', dir == 'v' ? obj[0].style.height : obj[0].style.width );
			if( dir == 'v' )	obj[0].style.height = (up ? maxval : 1) + 'px';
			else				obj[0].style.width = (up ? maxval : 1) + 'px';
			if( callback ) callback(up ? maxval : 1, obj[0].style.display);
			obj[1].style.position = 'absolute';
		}
	}
	alpha %= 360;
	
	//завершение разворачивания
	if( !up && alpha >= 90 && alpha < 180 ) {
		//возвращаем исходное позиционирование и высоту вложенному объекту
		obj[1].style.position = '';
		if( dir == 'v' ) {
			obj[0].style.height = obj[0].getAttribute( 'defheight' );
			//сбрасываем ширину, если не была задана напрямую
			for( var i = 0; i < obj.length; i ++ ) {
				if( !obj[i].setWidth ) continue;
				obj[i].style.width = '';
			}
		}
		else {
			obj[0].style.width = obj[0].getAttribute( 'defheight' );
		}
		if( callback ) callback(obj[0].getAttribute( 'defheight' ), obj[0].style.display);
		
		var tmp = cc.stack[num];
		cc.busy[num] = '';
		cc.stack[num] = '';
		if( tmp == 'up' ) _expand( obj, true, dir, callback );
		return;
	}
	//завершение сворачивания
	else if( up && alpha >= 270 && alpha < 360 ) {
		//возвращаем исходное позиционирование и высоту вложенному объекту
		obj[1].style.position = '';
		if( dir == 'v' )	obj[0].style.height = obj[0].getAttribute( 'defheight' );
		else				obj[0].style.width = obj[0].getAttribute( 'defheight' );
		obj[0].style.display = 'none';
		if( callback ) callback(obj[0].getAttribute( 'defheight' ), obj[0].style.display);
		
		var tmp = cc.stack[num];
		cc.busy[num] = '';
		cc.stack[num] = '';
		if( tmp == 'down' ) _expand( obj, null, dir, callback );
		return;
	}
	
	var radius = maxval / 2;
	var hh = Math.round( radius + Math.sin( deg2rad( alpha ) ) * radius );
	if( hh > maxval ) hh = maxval;
	if( hh < 0 ) hh = 0;
	
	if( dir == 'v' )	obj[0].style.height = hh + 'px';
	else				obj[0].style.width = hh + 'px';
	if( callback ) callback(hh, obj[0].style.display);
	obj[1].style.clip = dir == 'v' ? 'rect(auto, auto, '+hh+'px, auto)' : 'rect(auto, '+hh+'px, auto, auto)';
	
	setTimeout( function() { _expand( obj, up, dir, callback, alpha + 15 ); }, 15 );
}


//выставляет размер фотки с сохранением пропорций
function _set_size(img, setsize, crop) {
	//создаём объект image, так как у img не всегда оказывается заданы размеры (+ они могут быть заданы руками)
	var loader = new Image();
	loader.source = img;
	loader.onload = function() {
		var img = this.source;
		var size = [this.width,this.height];
		
		//не получилось пробить размеры картинки (при новом подходе через лодыря -- не должно быть)
		if( !size[0] || !size[1] ) {
			alert(size[0]);	//test
			return;
		}
		var k = size[0] / size[1];
		var k2 = setsize[0] / setsize[1];
		
		
		//пропорции совпдают
		if( k == k2 ) {
			img.width = setsize[0];
			img.height = setsize[1];
			return;
		}
		
		//вычисляем размеры
		var newsize = [setsize[0], setsize[1]];	//новый размер
		var border = [0,0,0,0];					//граница
		if( k > k2 ) {
			newsize[1] = Math.round( setsize[0] / k );
			border[0] = Math.round( (setsize[1] - newsize[1]) / 2 );
			border[2] = setsize[1] - newsize[1] - border[0];
		}
		else {
			newsize[0] = Math.round( setsize[1] * k );
			border[3] = Math.round( (setsize[0] - newsize[0]) / 2 );
			border[1] = setsize[0] - newsize[0] - border[3];
		}
		
		//применяем
		img.width = newsize[0];
		img.height = newsize[1];
		img.style.border = 'solid transparent';
		img.style.borderWidth = border.join( 'px ' ) + 'px';
		
		//test : if crop не реализовано, так как пока без надобности. 05.12.2012
	}
	//загружаем картинку в лодыря
	loader.src = img.src;
}

//просмотр картинок поверх контента
function _pic_enlarge(image) {
	//внешние элементы
	var global = {
		fixed: 'fixed',		//класс для имитации position: fixed;
		bgcolor: 'black',	//цвет фона
		progress: '/img/progress_black.gif'	//прогресс-гифка
	};
	
	var cc = arguments.callee;
	
	
	//перемещение фотки на центр
	if( !cc._toCenter ) cc._toCenter = function() {
		if( !cc.obj ) return;
		if( cc.obj.style.display == "none" ) return;
		
		var cs = [cc.obj.scrollWidth,cc.obj.scrollHeight];
		var left = Math.round( ((window.innerWidth ? window.innerWidth : document.body.offsetWidth) - parseInt( cs[0] )) / 2 );
		var top = Math.round( ((window.innerHeight ? window.innerHeight : document.body.offsetHeight) - parseInt( cs[1] )) / 2 );
		cc.obj.style.left = left + "px";
		cc.obj.style.top = top + "px";
	}
	//закрытие фотки
	if( !cc._close ) cc._close = function() {
		if( !cc.obj ) return;
		if( cc.obj.style.display == "none" ) return;
		cc.obj.style.display = "none";
	}
	
	
	//создаём объект
	if( !cc.obj ) {
		cc.obj = document.createElement( 'div' );
		cc.obj.className = global.fixed;
		cc.obj.style.top = -1000;
		cc.obj.style.left = 0;
		document.body.appendChild(cc.obj);
	}
	cc.obj.style.display = "";


	//html
	html = '';
	html += '<table border="0" cellpadding="0" cellspacing="0" bgcolor="'+global.bgcolor+'" style="cursor: pointer;" '+
				'onclick="event.returnValue = false; event.cancelBubble = true; _pic_enlarge._close();">';
	html += '<tr>';
	html += '	<td align="center" style="padding: 0px; background: url('+global.progress+') no-repeat center center;" width="100" height="100">';
	html += 		'<img src="'+image+'" style="display: none;" '+
						'onload="this.style.display = \'\'; this.parentNode.width = this.width; this.parentNode.style.backgroundImage = \'\';'+
						'this.parentNode.height = this.height; _pic_enlarge._toCenter();">';
	html += 	'</td>';
	html += '</tr>';
	html += '</table>';
	cc.obj.innerHTML = html;
	
	//тень
	_shadow( cc.obj.childNodes[0], 20, [0,0] );
	
	//в центр
	cc._toCenter();
	
	if( !cc.once ) {
		cc.once = true;
		//по ресайзу -- на центр
		if( window.attachEvent ) window.attachEvent( "onresize", cc._toCenter );
		else window.addEventListener( "resize", cc._toCenter );
		
		//по клику на свободную область -- закрывать
		if( document.body.attachEvent ) { document.body.attachEvent( "onmousedown", cc._close );}
		else document.body.addEventListener( "mousedown", cc._close );
		
		//по эскейпу -- закрывать
		if( document.body.attachEvent ) document.body.attachEvent( "onkeydown", function(e){if(e.keyCode == 27)_pic_enlarge._close()} );
		else document.body.addEventListener( "keydown", function(e){if(e.keyCode == 27)_pic_enlarge._close()} );
	}
}

//кросбрузерное добавление тени
function _shadow(obj, size, shift) {
	//для неэксплорера выводим стандартно
	if( !document.body.filters ) {
		obj.style.cssText += '-moz-box-shadow: '+shift[0]+' '+shift[1]+' '+size+'px black;';
		obj.style.cssText += '-webkit-box-shadow: '+shift[0]+' '+shift[1]+' '+(size * 2)+'px black;';
		obj.style.cssText += 'box-shadow: '+shift[0]+' '+shift[1]+' '+size+'px black;';
		return;
	}
	
	//внешние элементы
	var global = {
		img: {				//картинки для теней
			c:'/img/shadow/shadow.png',
			v:'/img/shadow/shadow_v.png',
			h:'/img/shadow/shadow_h.png',
			size: [146,146]
		},
		pgif: '/img/p.gif'	//прозрачный пиксель
	};
	
	//эмулируем тень для эксплорера; вам-то он умеет, только некрасиво
	html = '';
	html += '<table border="0" cellpadding="0" cellspacing="0">';
	html += '<tr height="'+(size - shift[1])+'">';
	html += '	<td width="'+(size - shift[0])+'" style="background: url('+global.img.c+') no-repeat top left;"></td>';
	html += '	<td>';
	html += '		<table border="0" cellpadding="0" cellspacing="0" width="100%" height="'+(size - shift[1])+'">';
	html += '		<tr>';
	html += '			<td style="background: url('+global.img.c+') no-repeat -'+(size - shift[0])+'px top;" width="'+(size + shift[0])+'"></td>';
	html += '			<td style="background: url('+global.img.v+') repeat-x top;"><img src="'+global.pgif+'" width="1" height="1"></td>';
	html += '			<td style="background: url('+global.img.c+') no-repeat -'+(global.img.size[0] - (size + shift[0]) * 2)+'px top;" width="'+(size + shift[0])+'"></td>';
	html += '		</tr>';
	html += '		</table>';
	html += '	</td>';
	html += '	<td width="'+(size + shift[0])+'" style="background: url('+global.img.c+') no-repeat top right;"></td>';
	html += '</tr>';
	html += '<tr height="100%">';
	html += '	<td>';
	html += '		<table border="0" cellpadding="0" cellspacing="0" width="'+(size - shift[0])+'" height="100%">';
	html += '		<tr height="'+(size + shift[1])+'">';
	html += '			<td style="background: url('+global.img.c+') no-repeat left -'+(size - shift[1])+'px;"></td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td style="background: url('+global.img.h+') repeat-y left;"><img src="'+global.pgif+'" width="1" height="1"></td>';
	html += '		</tr>';
	html += '		<tr height="'+(size + shift[1])+'">';
	html += '			<td style="background: url('+global.img.c+') no-repeat left -'+(global.img.size[0] - (size + shift[1]) * 2)+'px;"></td>';
	html += '		</tr>';
	html += '		</table>';
	html += '	</td>';
	html += '	<td>';
	html +=			obj.outerHTML;
	html += '	</td>';
	html += '	<td>';
	html += '		<table border="0" cellpadding="0" cellspacing="0" width="'+(size + shift[0])+'" height="100%">';
	html += '		<tr height="'+(size + shift[1])+'">';
	html += '			<td style="background: url('+global.img.c+') no-repeat right -'+(size - shift[1])+'px;"></td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td style="background: url('+global.img.h+') repeat-y right;"><img src="'+global.pgif+'" width="1" height="1"></td>';
	html += '		</tr>';
	html += '		<tr height="'+(size + shift[1])+'">';
	html += '			<td style="background: url('+global.img.c+') no-repeat right -'+(global.img.size[0] - (size + shift[1]) * 2)+'px;"></td>';
	html += '		</tr>';
	html += '		</table>';
	html += '	</td>';
	html += '</tr>';
	html += '<tr height="'+(size + shift[1])+'">';
	html += '	<td style="background: url('+global.img.c+') no-repeat bottom left;"></td>';
	html += '	<td>';
	html += '		<table border="0" cellpadding="0" cellspacing="0" width="100%" height="'+(size + shift[1])+'">';
	html += '		<tr>';
	html += '			<td style="background: url('+global.img.c+') no-repeat -'+(size - shift[0])+'px bottom;" width="'+(size + shift[0])+'"></td>';
	html += '			<td style="background: url('+global.img.v+') repeat-x bottom;"><img src="'+global.pgif+'" width="1" height="1"></td>';
	html += '			<td style="background: url('+global.img.c+') no-repeat -'+(global.img.size[0] - (size + shift[0]) * 2)+'px bottom;" width="'+(size + shift[0])+'"></td>';
	html += '		</tr>';
	html += '		</table>';
	html += '	</td>';
	html += '	<td style="background: url('+global.img.c+') no-repeat bottom right;"></td>';
	html += '</tr>';
	html += '</table>';
	html += '</form>';
	
	obj.outerHTML = html;
}


//отображает диалог с надписью
_dialog();	//предваритильное скачивание
function _dialog( obj, text, align, add_offset ) {	//v2.3.1.1
	var cc = arguments.callee;
	if( !cc.freedivs ) cc.freedivs = [];	//свободный стек дивов, которые закрыли
	if( !cc.useddivs ) cc.useddivs = [];	//открытые дивы
	
	if( !cc.img ) cc.img = {
		'tl': '/img/dialog/tl.png',
		'tc': '/img/dialog/tc.png',
		'pp': '/img/dialog/pointer.png',
		'tr': '/img/dialog/tr.png',
		'lc': '/img/dialog/lc.png',
		'rc': '/img/dialog/rc.png',
		'bl': '/img/dialog/bl.png',
		'bc': '/img/dialog/bc.png',
		'br': '/img/dialog/br.png'
	}
	
	//предварительное скачивание картинок
	if( !arguments.length ) {
		for( var i in cc.img ) (new Image()).src = cc.img[i];
		return;
	}
	
	//закрытие всех диалогов
	if( cc.close == null ) {
		cc.close = function(obj) {
			//скрываем конкретный
			if( obj && (obj.tagName || '') == 'DIV' ) {
				for( var i = 0; i < cc.useddivs.length; i ++ ) {
					if( cc.useddivs[i] != obj ) continue;
					var del = cc.useddivs.splice( i, 1 )[0];	//убираем последний из стека используемых
					cc.freedivs.push( del );					//добавляем в конец стека свободных
					del.style.display = 'none';					//прячем сам див
					break;
				}
				return;
			}
			//скрываем все
			while( cc.useddivs.length ) {
				var del = cc.useddivs.pop();	//убираем последний из стека используемых
				cc.freedivs.push( del );		//добавляем в конец стека свободных
				del.style.display = 'none';		//прячем сам див
			}
		}
		
		//по клику на свободную область -- закрывать
		if( document.body.attachEvent ) { document.body.attachEvent( "onmousedown", cc.close );}
		else document.body.addEventListener( "mousedown", cc.close );
		
		//если печатаем -- закрывать
		if( document.body.attachEvent ) document.body.attachEvent( "onkeydown", cc.close );
		else document.body.addEventListener( "keydown", cc.close );
	}
	
	if( cc.freedivs.length ) {
		var div = cc.freedivs.pop();	//берём с конца стека
	}
	//создаём новый объект, если нет свободного в стеке
	else {
		var div = document.createElement('div');
		
		//настройка созданного дива
		div.style.position = 'absolute';
		div.style.zIndex = 2000;
		div.style.display = 'none';
		div.style.maxWidth = '600px';
		
		//содержимое
		var html = '';
		html += '<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;"';
		html += '	onmousedown="event.returnValue = false; event.cancelBubble = true;">';
		html += '<tr height="17">';
		html += '	<td style="font-size: 1px; background: url('+cc.img.tl+') no-repeat right bottom;" width="18"></td>';
		html += '	<td style="font-size: 1px; background: url('+cc.img.tc+') repeat-x bottom;" align="left" valign="top"';
		html += '		><img src="'+cc.img.pp+'" width="65" height="60" style="position: absolute; margin: -59px 0px 0px -10px;"';
		html += '	></td>';
		html += '	<td style="font-size: 1px; background: url('+cc.img.tr+') no-repeat left bottom;" width="17"></td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td style="background: url('+cc.img.lc+') repeat-y right;"></td>';
		html += '	<td bgcolor="white" style="color: black; padding: 0px 0px 8px 8px;" align="'+( align ? align : 'center' )+'"></td>';
		html += '	<td style="background: url('+cc.img.rc+') repeat-y left;"></td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td><img src="'+cc.img.bl+'" width="18" height="19"></td>';
		html += '	<td style="background: url('+cc.img.bc+') repeat-x top;"></td>';
		html += '	<td><img src="'+cc.img.br+'" width="17" height="19"></td>';
		html += '</tr>';
		html += '</table>';
		
		div.innerHTML = html;
		
		//метод для закрытия конкретного диалога
		div.close = function() { cc.close(this); }
		
		//ссылка на ячейку с текстом
		div.content = getChildsByTagName( 'td', div )[4];
		//приделка
		document.body.appendChild(div);
	}
	
	//пополняем стек дивов
	cc.useddivs.push( div );
	
	div.content.innerHTML = text;
	
	//дополнительное позиционирование
	if( add_offset == null ) add_offset = [0, 0];
	
	//позиционирование
	var offset = get_offset(obj);
	div.style.left = (offset.x + 5 + add_offset[0]) + 'px';
	div.style.top = (offset.y + 78 + add_offset[1]) + 'px';
	div.style.display = '';
	
	return div;
}

//вывод ошибки
function _out_error(err, obj, align) {
	if( typeof obj == 'string' ) {
		obj = document.getElementById( obj ) || (document.getElementsByName( obj ) || [])[0];
	}
	if( !obj ) return;
	if( obj.length && obj[0].tagName != 'OPTION' ) obj = obj[0];	//radio|checkbox
	
	_dialog( obj, '<b style="color: red;">'+err+'</b>', align ).focus();
	if( obj.focus ) obj.focus();
}


//element offset in document imaginary matrix
function get_offset(obj) {
	if( !obj ) return {x: 0, y: 0};
	var off = {x: obj.offsetLeft, y: obj.offsetTop};
	
	//+= parent offset
	var pp = get_offset(obj.offsetParent);
	off.x += pp.x;
	off.y += pp.y;
	
	return off;
}

function _blink( obj, c2, c1, onready ) {	//v2.0
	if( c2 == null ) c2 = "red";
	if( c1 == null ) {
		var c1 = obj.style.color;
		if( !c1 ) {
			c1 = obj.style.color = "black";
		}
	}
	if( obj.blinkproc == null ) obj.blinkproc = 100;
	if( obj.blinkproc < 0 ) {
		obj.blinkproc = 100;
		obj.style.color = c1;
		obj.style.textShadow = 'none';
		if( onready && onready.call ) onready();
		return;
	}
	obj.style.color = _middlec( c1, c2, obj.blinkproc );
	obj.style.textShadow = '0px 0px '+Math.round(obj.blinkproc / 100 * 5)+'px ' + c2;
	setTimeout( function() {
		obj.blinkproc --;
		_blink( obj, c2, c1, onready );
	}, 10 );
}