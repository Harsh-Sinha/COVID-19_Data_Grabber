$(window).on('load', function ()
{
	$.ajax(
	{
		url: 'https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
		cache: false,
		type: 'GET',
		dataType: 'html',
		success: function(data)
		{
			var wrapper = document.createElement('div');
			wrapper.innerHTML = data;

			var entries = wrapper.querySelectorAll('table.js-csv-data')[0].querySelectorAll('tbody')[0].querySelectorAll('tr');
			
			//Find The US Entry
			var caseNumbers = 0;
			for(var i = 0; i < entries.length; i++)
			{
				var entry = entries[i].querySelectorAll('td');

				if(entry[2].innerHTML == "US")
				{

					caseNumbers = entry[entry.length - 1].innerHTML;
					break;
				}
			}

			var updated = wrapper.querySelectorAll('relative-time')[0].attributes[0].value;
			var message = "Total:<b> ";
			message = message.concat(caseNumbers.toString(), "</b><br>Update: ", updated);
			$('p.jh_data_summary')[0].innerHTML = message;
		}
	});
});