var TSM = {
		TRANSPORTER: null,
		getData: function(result){
			console.log(result);
			if(typeof(result) == "string"){
				TSM.TRANSPORTER = JSON.parse(result.replace(/'/g, '"'));
			} else {
				TSM.TRANSPORTER = result;
			}
			return TSM.TRANSPORTER;
		}
}
