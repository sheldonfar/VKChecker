checkForNewMessages(); // Function that checks if there are any new messages in your im
setInterval(checkForNewMessages, "30000"); // Every 30 sec

chrome.browserAction.onClicked.addListener(function () {
	checkForNewMessages();
});

function checkForNewMessages() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://vk.com/im", true); // Creating Cross-Domain request to VK
	xhr.send(null); // Dont sending anything, just getting info
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) // When transaction is complete
		{	
			if (xhr.responseText) // Getting html response from VK
			{
				$('div#wrapper').html(""); // Cleaning wrapper from previous check
			
				chrome.browserAction.setIcon({ path: "../images/vk16.png" }); // Setting the icon on icon-desk
				chrome.browserAction.setBadgeText({ text: "" }); // Clearing badge text
				chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" }); // Color of the text on badge

				var data = xhr.responseText; // Copying responseText to a variable
				var new_message = $('li#l_msg', data).find('span.left_count').html(); // Are there any new messages for me?
				new_message = new_message.substr(1,1); // Deleting "+" from answer
				
				var dialogs_row = $('div.dialogs_row', data); //Each dialog has .dialogs_row class
				
				dialogs_row.each(function(){ // For each of them
					var unread_dialogs = $('div.dialogs_unread', this).html(); // If dialog is unread
					unread_dialogs = parseInt(unread_dialogs); // Parsing it straight into Integer
					if (!isNaN(unread_dialogs)) { // If it is still an integer and not a NaN
						var sender_name = $('div.dialogs_user a', this).html(); // Getting name of the message sender
						var sender_profile = $('div.dialogs_user a', this).attr("href"); // Getting link to his profile
						var time_sent = $('div.dialogs_date', this).html(); // Getting time when message was sent
						var sender_avatar = $('td.dialogs_photo img', this).attr("src"); // Getting sender's avatar
						/* COLLECT THEM ALL into wrapper*/
						$('div#wrapper').append('<div class="message-box"><img src="http://vk.com' + sender_avatar + '" hspace="10"><b>Message from: </b><a href="http://vk.com' + sender_profile + '" target="_blank">'  + sender_name + '</a></br><b>Time send: </b>' + time_sent + '</br>');
					}
				});
				/* If there are unread messages in feed */
				if (parseInt(new_message) >= 1) {
					$('div#wrapper').removeClass("no-messages"); // Removing class .no-messages
					$('div#wrapper').addClass("has-message"); // Adding class .has-message
					chrome.browserAction.setBadgeText({ text: new_message.toString() }); // Setting badge text as amount of unread messages
				}
				else {
					$('div#wrapper').removeClass("has-message"); // Removing class .has-messages
					// Adding no-messages class and a very sympathetic user-friendly message
					$('div#wrapper').addClass("no-messages").html("No new messages for you, mate :(");
					
				}
			}
			else {
				chrome.browserAction.setIcon({ path: "../images/lock-icon.png" }); // Changing icon to a lock-icon
				chrome.browserAction.setBadgeText({ text: "?" }); // Setting text like "WTF?"
				chrome.browserAction.setBadgeBackgroundColor({ color: "#ccc" }); // Changing color to smth very sad & depressive
			}
		}
	}
}