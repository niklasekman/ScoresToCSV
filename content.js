// The good stuff
function jsonToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            return str;
        }

function scoresToCsv() {
	// Scrape the scores
	var scores = {};
	jQuery("[id^=contentframe-room]").each(function(){ 
		var scoreCollection = jQuery(this).contents().find("iframe#content").contents().find("a.score");
		scoreCollection.each(function(){
			var rawScore = this.getAttribute('onclick').split("'")
			var name = unescape(rawScore[5].replace(",",""));
			var assignment = rawScore[7];
			var score = rawScore[11];
			if(!scores[name]) {
				scores[name] = {};
			}
			scores[name][assignment] = score;
		});
	});

	// Transform the object into an array of objects
	var scoreArray = [];
	var firstRow=["Namn"];
	for (var key in scores) {
		if (scores.hasOwnProperty(key)) {
			var row = {};
			
			row["Namn"] = key;
			for (var assKey in scores[key]) {
				if (scores[key].hasOwnProperty(assKey)) {
					if (firstRow.indexOf(assKey) < 0) {
						firstRow.push(assKey);
					}
					row[assKey] = scores[key][assKey];
				}
			}
			scoreArray.push(row);
		}
	}
	scoreArray.unshift(firstRow);

	// Turn the array into JSON
	var jsonObject = JSON.stringify(scoreArray);

	return jsonToCSV(jsonObject);
}

chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {

		switch(message.type) {
			case "scrape-scores":
				
				var encodedUri = encodeURI(scoresToCsv());
				var link = document.createElement("a");
				link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodedUri);
				link.setAttribute("download", "scores.csv");

				link.click();
				
			break;
	}
});