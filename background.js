chrome.browserAction.onClicked.addListener(function() {
	console.log('Sending message');

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, {
	            type: "scrape-scores",
	            data: {
	            	save: true
	        	}
	    });
	});
});
