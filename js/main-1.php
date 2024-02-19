
var MAIN_CURR = "EUR";
var CURRENCY = {"EUR":"€"};

		function _exchange( sum, from, to, rnd ) {
			var curr = {LVL:0.702804,EUR:1};
			if( !curr[from] ) return false;
			if( !curr[to] ) return false;
			var ret = sum * curr[to] / curr[from];
			if( rnd != null ) {
				var tmp = Math.pow( 10, rnd );
				ret = Math.round( ret * tmp ) / tmp;
			}
			return ret;
		}