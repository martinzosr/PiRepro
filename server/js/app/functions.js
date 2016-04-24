function secondsToTime(time){
	if(time == 0){
		return "";
	} else {
		return Math.floor(time/60) + ":" + time%60;
	}
}
