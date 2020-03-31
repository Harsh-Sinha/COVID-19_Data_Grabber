$(window).on('load', function ()
{
	const ACCEPTED_STATES = ["Alabama",
							"Alaska",
							"Arizona",
							"Arkansas",
							"California",
							"Colorado",
							"Connecticut",
							"Delaware",
							"District of Columbia",
							"Florida",
							"Georgia",
							"Hawaii",
							"Idaho",
							"Illinois",
							"Indiana",
							"Iowa",
							"Kansas",
							"Kentucky",
							"Louisiana",
							"Maine",
							"Maryland",
							"Massachusetts",
							"Michigan",
							"Minnesota",
							"Mississippi",
							"Missouri",
							"Montana",
							"Nebraska",
							"Nevada",
							"New Hampshire",
							"New Jersey",
							"New Mexico",
							"New York",
							"North Carolina",
							"North Dakota",
							"Ohio",
							"Oklahoma",
							"Oregon",
							"Pennsylvania",
							"Rhode Island",
							"South Carolina",
							"South Dakota",
							"Tennessee",
							"Texas",
							"Utah",
							"Vermont",
							"Virginia",
							"Washington",
							"West Virginia",
							"Wisconsin",
							"Wyoming"];

	// Get The JSON File that CDC Updates and Operate on it
	$.getJSON('https://www.cdc.gov/coronavirus/2019-ncov/map-cases-us.json', function(json_string)
	{
		//Get rid of extra entries that are not in the accepted state list above
		$(json_string)[0].data = getRidOfExtraEntries($(json_string)[0].data);

		//Create the proper dom elements to populate the table entry defined in html
		createTable($(json_string)[0].data);
	});

	//Get rid of extra entries that are not in the accepted state list above
	function getRidOfExtraEntries(entries)
	{
		var inList = false;
		//For every entry check if is in the accepted list
		for(var i = 0; i < entries.length; i++)
		{
			//check every index in accepted list
			for(var j = 0; j < ACCEPTED_STATES.length; j++)
			{
				//Entry is acceptable so break out of inner loop
				//that check to see if it is acceptable
				if(entries[i].Jurisdiction == ACCEPTED_STATES[j])
				{
					inList = true;
					break;
				}
			}

			//If flag is still false then we need to remove this entry
			if(!inList)
			{
				entries.splice(i, 1);
			}

			//Reset flag
			inList = false;
		}

		//Return the new trimmed entries
		return entries;
	}

	//Create the proper dom elements to populate the table entry defined in html
	function createTable(entries)
	{
		//Get tthe predefined table dom node to populate with new nodes
		var table = document.getElementById("content");

		//To Keep track of sums for each column
		var reportedSum = 0;
		var minSum = 0;
		var maxSum = 0;

		for(var i = 0; i < entries.length; i++)
		{
			//Create a td node for the name of the state
			var name = document.createElement('td');
			$(name)[0].innerHTML = entries[i]['Jurisdiction'];

			//Create a td node for the reported cases for each state
			var reported = document.createElement('td');
			$(reported)[0].innerHTML = $(entries)[i]['Cases Reported'];
			//Add the current number of reported cases to the summation
			reportedSum += $(entries)[i]['Cases Reported'];

			//The range is given to us in a string format
			var range =  $(entries)[i]['Range'];
			var splitRange = range.split(" ");

			//Parse the min and max
			var min = document.createElement('td');
			min.innerHTML = parseInt(splitRange[0]);
			minSum += parseInt(splitRange[0]);

			var max = document.createElement('td');
			//If no max was given then try to deduce what it could be
			if(splitRange[2] == "more")
			{
				max.innerHTML = $(entries)[i]['Cases Reported'] + Math.round($(entries)[i]['Cases Reported'] * .15);
				maxSum += $(entries)[i]['Cases Reported'] + Math.round($(entries)[i]['Cases Reported'] * .15);
			}
			else
			{
				max.innerHTML = parseInt(splitRange[2]);
				maxSum += parseInt(splitRange[2]);
			}

			//Link the td nodes into a tr node
			var tableEntry = document.createElement('tr');
			tableEntry.append(name);
			tableEntry.append(reported);
			tableEntry.append(min);
			tableEntry.append(max);

			//Add the tr node into the table
			table.append(tableEntry);
		}

		//Create Last Entry - same concept as above
		var lastEntryName = document.createElement('td');
		$(lastEntryName)[0].innerHTML = "Total:"

		var reportedSumNode = document.createElement('td');
		$(reportedSumNode)[0].innerHTML = reportedSum;

		var minSumNode = document.createElement('td');
		$(minSumNode)[0].innerHTML = minSum;

		var maxSumNode = document.createElement('td');
		$(maxSumNode)[0].innerHTML = maxSum;

		var lastTableEntry = document.createElement('tr');
		lastTableEntry.append(lastEntryName);
		lastTableEntry.append(reportedSumNode);
		lastTableEntry.append(minSumNode);
		lastTableEntry.append(maxSumNode);

		lastTableEntry.style.background = 'lightblue';

		table.append(lastTableEntry);

		//Figure out update time
		var date = new Date();

		var hour = date.getHours();
		var minute = date.getMinutes();
		if(hour >= 16)
		{
			hour = 14;
			minute = 0;
		}

		var updateTime = hour.toString().concat(":", minute.toString());

		if(minute == 0)
		{
			updateTime = updateTime.concat("0");
		}

		var message = "Total:<b> ";
		message = message.concat(reportedSum.toString(), 
			"</b><br>Range:<b>  ",
			 minSum.toString(), " to ", maxSum.toString(), "</b><br>Updated: ", updateTime, " ET"); 
		$('p.cdc_data_summary')[0].innerHTML = message;
	}

});