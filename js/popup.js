$(function(){

	$("#URL_Name").focus();
	
	// INITIALIZE CLIPBOARD
	var clipboard = new ClipboardJS('.btn');
	
	// Chrome Storage
  	var storage = chrome.storage.local;
  	var counter = localStorage.length;

  	// ONLOAD - GET FUNCTION (RETRIEVE ALL SAVED ROWS FROM localStorage)
  	function getSavedRows(){
  		storage.get(null, function(items) {
   			for (key in items) {
       			append(items[key][0], items[key][1], key)
       			$("#No_URL").remove();
   			}
		});
  	};

  	// LOAD ROW FUNCTION (append function)
	function append(value1, value2, value3){
		var markup = '<tr><td class="align-middle"><a id="foo' + value3 + '" target="_blank" href="http://' + value1 + '">' + value2 + '</td><td><button class="btn btn-light rounded shadow-sm tooltipOnly" data-toggle="tooltip" data-placement="bottom" data-original-title="Copy" data-clipboard-action="copy" data-clipboard-target="#foo' + value3 + '"><img src="images/icons8-copy-12.png" alt="copy icon"></button></td><td class="align-middle"><button type="button" id="Remove_' + value3 + '" class="btn btn-danger btn-sm">Remove</button></td></tr>';
		$("tbody").append(markup);
		$('[data-toggle="tooltip"]').tooltip();
		// ON CLICK
		$(".tooltipOnly").click(function(){
			$(this).attr("title", "Copied!").tooltip("_fixTitle").tooltip("show").attr("title", "Copy").tooltip("_fixTitle");
			console.log("button triggered");
		});
	};
  	// INIT GET FUNCTION
  	getSavedRows();

	function resetInput(){
		// Restore Input field back to blank
		$("input").val('');

		// Hide any past errors
		$("#URL_Name").removeClass("is-invalid");
		$("#URL_error").addClass("d-none");	

		//Hide No URL message 
		$("#No_URL").remove();
	};

	// SAVE FUNCTION
	function save() {
		var value = $("#URL_Name").val();
		var urlLength = value.length;
		var modifiedValue = value;
		var http_URL_Check = value.substring(0,4);
		var https_URL_Check = value.substring(0,5);
		console.log(http_URL_Check)
		console.log(https_URL_Check)

		// HTTP OR HTTPS CHECKER
		if (https_URL_Check === "https") {
			value = value.slice(8,);
			modifiedValue = value;
		} else if (http_URL_Check ==="http") {
			value = value.slice(7,);
			modifiedValue = value;
		}

		// CHECK FOR BLANK STATE AND CHARACTER LENGTH
		if (value === "") {
			// If URL input field is blank; then show default errors
			$("#URL_Name").addClass("is-invalid");	
			$("#URL_error").removeClass("d-none");
		} else if (urlLength >= 50) {
			// RESET FUNCTION
			resetInput();

			// KEEP COUNTER IN THE BACKGROUND
			counter++;
			localStorage.setItem(counter, 'counter');

			// STORING VALUE IN CHROME LOCAL STORAGE
			modifiedValue = modifiedValue.substring(0,40) + "...";
			storage.set({[counter] : [value, modifiedValue]});
			append(value, modifiedValue, counter);
		} else {
			// RESET FUNCTION
			resetInput();

			// KEEP COUNTER IN THE BACKGROUND
			counter++;
			localStorage.setItem(counter, 'counter');

			// STORING VALUE IN CHROME LOCAL STORAGE
			storage.set({[counter] : [value, modifiedValue]});
			append(value, modifiedValue, counter);
		}
	};

	// SAVE - BUTTON
	$("#URL_Save").click(function (){
		save();
	});

	// SAVE - INPUT FIELD "ENTER"
	$("#URL_Name").on('keypress', function(e){
		if (e.which === 13) {
			save();
		}
	})

	// REMOVE BUTTON
	$("#URL_Table").on('click', '.btn-danger', function (){
		var rowCount = $("tbody tr").length;
		var No_URL_Message = '<div id="No_URL" class="text-center bg-light no-url-height">No URLs Saved</div>'
		var digits = /\d+/;
		var Match_ID = this.id.match(digits);
		var ID_Number = Match_ID[0];

		// IF CHROME HAS 1 KEY; THEN CLEAR STORAGE AND RESTART
		if (rowCount === 1) {
			$(this).closest('tr').remove();
			$("#URL_Container").append(No_URL_Message);
			storage.clear();
			localStorage.clear();		
		} else {
			$(this).closest('tr').remove();
			storage.remove(ID_Number);			
		}
	// END OF REMOVE BUTTON
	});

});