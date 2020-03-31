$(window).on('load', function ()
{
	$.ajax(
	{
		url: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports',
		cache: false,
		type: 'GET',
		dataType: 'html',
		success: function(data)
		{
			var wrapper = document.createElement('div');
			wrapper.innerHTML = data;

			var sitreps = wrapper.querySelectorAll('p');

			var latest = "https://www.who.int";
			latest = latest.concat(sitreps[0].querySelectorAll('a')[0].getAttribute('href'));
			

			var aNode = document.createElement('a');
			aNode.innerHTML = "Latest Sit Rep";
			aNode.setAttribute('href', latest);
			
			var descriptor = document.querySelectorAll('p.who_data_summary')[0];
			descriptor.innerHTML = "";
			descriptor.append(aNode);
		}
	});
	
});