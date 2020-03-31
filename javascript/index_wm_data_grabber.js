$(window).on('load', function ()
{
	$.ajaxSetup(
	{
		cache: false
	});
	

	$.ajax(
	{
		url: 'https://www.worldometers.info/coronavirus/country/us/',
		cache: false,
		type: 'GET',
		dataType: 'html',
		success: function(data)
		{
			var wrapper= document.createElement('div');
			wrapper.innerHTML = data;
			
			var externalTable = wrapper.querySelectorAll('table#usa_table_countries_today')[0]; 
			var body = externalTable.querySelectorAll('tbody')[0];
			createWMTable(body.querySelectorAll('tr'));

			

			var updateTime = wrapper.querySelectorAll('.content-inner')[0].querySelectorAll('div')[1].innerHTML.split(': ')[1];
			var temp = $('p.wm_data_summary')[0].innerHTML;
			temp = temp.concat("<br>Updated: ", updateTime);
			$('p.wm_data_summary')[0].innerHTML = temp;
		}
	});
	

	function createWMTable(entries)
	{
		var wmTable = document.getElementById('wm_data_table');

		var caseSum = 0;
		var newCaseSum = 0;

		for(var i = 0; i < entries.length; i++)
		{
			var entry = entries[i].querySelectorAll('td');

			var name = document.createElement('td');
			$(name)[0].innerHTML = entry[0].innerText;

			var totalCase = document.createElement('td');
			$(totalCase)[0].innerHTML = entry[1].innerText;
			caseSum += parseInt(entry[1].innerText.replace(/,/g, ''));

			var newCases = document.createElement('td');
			$(newCases)[0].innerHTML = entry[2].innerText;
			var temp = entry[2].innerText.split('+')[1];
			if(temp != undefined)
			{
				newCaseSum += parseInt(temp.replace(/,/g, ''));
			}

			var tableEntry = document.createElement('tr');
			tableEntry.append(name);
			tableEntry.append(totalCase);
			tableEntry.append(newCases);

			wmTable.append(tableEntry);
		}

		//Create Last Entry
		var lastEntryName = document.createElement('td');
		$(lastEntryName)[0].innerHTML = "Total:"

		var reportedSumNode = document.createElement('td');
		$(reportedSumNode)[0].innerHTML = caseSum;

		var newCaseNode = document.createElement('td');
		$(newCaseNode)[0].innerHTML = newCaseSum;

		var lastTableEntry = document.createElement('tr');
		lastTableEntry.append(lastEntryName);
		lastTableEntry.append(reportedSumNode);
		lastTableEntry.append(newCaseNode);

		lastTableEntry.style.background = 'lightblue';

		wmTable.append(lastTableEntry);

		var message = "Total: <b>";
		message = message.concat(caseSum.toString(), "</b><br>New Cases:<b> ", newCaseSum.toString(), "</b>");
		$('p.wm_data_summary')[0].innerHTML = message;
	}
});