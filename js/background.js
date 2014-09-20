checkForNewMessages();
setInterval(checkForNewMessages, "6000");

chrome.browserAction.onClicked.addListener(function () {
	checkForNewMessages();
});

function checkForNewMessages() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://vk.com/im", true);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) 
		{	
			if (xhr.responseText) 
			{
				$('div#wrapper').html("");
			
				chrome.browserAction.setIcon({ path: "../images/vk16.png" });
				chrome.browserAction.setBadgeText({ text: "" });
				chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });

				var data = xhr.responseText;
				var new_message = $('li#l_msg', data).find('span.left_count').html();
				new_message = new_message.substr(1,1);
				
				var dialogs_row = $('div.dialogs_row', data);
				
				dialogs_row.each(function(){
					var unread_dialogs = $('div.dialogs_unread', this).html();
					unread_dialogs = parseInt(unread_dialogs);
					if (!isNaN(unread_dialogs)) {
						var sender_name = $('div.dialogs_user a', this).html();
						var sender_profile = $('div.dialogs_user a', this).attr("href");
						var time_sent = $('div.dialogs_date', this).html();
						var sender_avatar = $('td.dialogs_photo img', this).attr("src");
						$('div#wrapper').append('<div class="message-box"><img src="http://vk.com' + sender_avatar + '" hspace="10"><b>Message from: </b><a href="http://vk.com' + sender_profile + '" target="_blank">'  + sender_name + '</a></br><b>Time send: </b>' + time_sent + '</br>');
					}
				});

				if (parseInt(new_message) >= 1) {
					$('div#wrapper').removeClass("no-messages");
					$('div#wrapper').addClass("has-message");
					chrome.browserAction.setBadgeText({ text: new_message.toString() });
				}
				else {
					$('div#wrapper').removeClass("has-message");
					$('div#wrapper').addClass("no-messages").html("No new messages for you, mate :(");
				}
			}
			else {
				chrome.browserAction.setIcon({ path: "../images/lock-icon.png" });
				chrome.browserAction.setBadgeText({ text: "?" });
				chrome.browserAction.setBadgeBackgroundColor({ color: "#ccc" });
			}
		}
	}
}