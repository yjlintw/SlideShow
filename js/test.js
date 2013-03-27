$(document).ready(function () 
{
	//var content = $('#input').text().toString().split(',');
	var content = [];
	var canvas = $('#canvas');
	var title = $('#titleMiddle');
	var durationImage = 5000;
	var srcImage = '<img src="$" alt="">';
	var srcVideo = '<video autoplay><source src="$" type="video/mp4"></source></video>';
	var current = 0;
	var regex = /(?:\.([^.]+))?$/;
	var timer;
	var menuColor = [ '#6f73ff', '#7fe22e', '#f92672', '#fd971f', '#e6db74' ];
	var colorIndex = 0;
	var timer2;
	var timeVisible = 5000;
	timeFadeout();

	function timeFadeout()
	{
		timer2 = setTimeout(function(){
			$('.control').fadeOut();
		}, timeVisible);
	}

	$('html').on('touchend', function(e){
		clearTimeout(timer2);
		if ($('.control:visible').length)
		{
			if (!$(e.target).hasClass('panel') && !$(e.target).hasClass('link'))
			{
				$('.control').fadeOut();
			}
			else
			{
				timeFadeout();
			}
		}
		else
		{
			$('.control').fadeIn();
			timeFadeout();
		}

	});
	// get all of the url which would need to be displayed later
	function retriveData()
	{
		$('#input').children('div').each(function(){
			var year = $(this).attr('id');
			$(this).children('div').each(function(){
				var awardType = $(this).attr('class');
				var urls = $(this).text().toString().split(',');
				$.each(urls, function(i,url)
				{
					var nameArr = url.split('/');
					content.push({'url': url.trim(), 'year': year, 'awardType': awardType, 'name':nameArr[4].trim().substring(3)});
				});
			});
		});
	}

	// setup the link
	function setupMenu()
	{
		var menu = $('#menu');
		var liString = '<li class="panel"><p class="link">$</p></li>';
		var outputString = '';
		var yearSet = {};

		$.each(content, function(i, obj)
		{
			yearSet[obj.year] = true;
		});

		$.each(yearSet, function(i, obj)
		{
			var tmpString = liString;
			tmpString = tmpString.replace('$', i);
			outputString += tmpString + '\n';
		});
		
		menu.html(outputString);
	}

	function setCurrentMenu(currentIndex)
	{
		var year = content[currentIndex].year;
		var menu = $('#menu');

		menu.children('li').each(function(){
			///// TODO //////
			var link = $(this).children('p');
			if (link.text().toString() == year)
			{
				$(this).addClass('current');
				$(this).css('background','#0a0a0a');
			}
			else
			{
				$(this).removeClass('current');
				$(this).css('background', '');
			}

		});
	}

	function setupSubmenu(currentIndex)
	{
		var year = content[currentIndex].year;
		var submenu = $('#submenu');
		var adwardSet = {};
		var liString ='<li class="panel"><p class="link">$</p></li>';
		var outputString = '';

		$.each(content, function(i, obj){
			if (obj.year == year)
			{
				adwardSet[obj.awardType] = true;
			}
		});

		$.each(adwardSet, function(i, obj){
			var tmpString = liString;
			tmpString = tmpString.replace('$', i);
			outputString += tmpString + '\n';
		});
		submenu.html(outputString);

		submenu.children('li').each(function(){
			$(this).children('p').addClass('color' + colorIndex++);
			if (colorIndex >= menuColor.length)
			{
				colorIndex = 0;
			}
		});
		
	}

	function setCurrentSubMenu(currentIndex)
	{
		var awardType = content[currentIndex].awardType;
		var menu = $('#submenu');

		menu.children('li').each(function(){
			///// TODO //////
			var link = $(this).children('p');
			if (link.text().toString() == awardType)
			{
				
				$(this).addClass('current');
				var className = link.attr('class').split(/\s+/);
				var cIndex = parseInt(className[1].substring(5));
				cIndex %= menuColor.length;
				var tmpColor = menuColor[cIndex];

				$(this).css('background', tmpColor);
			}
			else
			{
				$(this).removeClass('current');
				$(this).css('background', '');
			}

		});
	}

	function getCurrentYear()
	{
		return content[current].year;
	}

	function getCurrentAwardType()
	{
		return content[current].awardType;
	}

	function play(index)
	{
		if (index >= content.length || index < 0)
		{
			index = 0;
		}
		current = index;

		var source = null;
		var file = content[current].url.trim();
		var extension = regex.exec(file)[1];

		title.html(content[current].name)

		if (extension == 'jpg' || extension == 'png')
		{
			source = srcImage;
			timer = setTimeout(function() {playNext();}, durationImage);
		}
		else if (extension == 'mp4' || extension == 'mov')
		{
			source = srcVideo;
		}
		else
		{
			playNext();
			return;
		}

		if (null !== source)
		{
			source = source.replace('$', file);
			canvas.html(source);

			if (extension == 'mp4' || extension == 'mov')
			{
				canvas.find('video').bind("ended", function(){
					playNext();
				});
			}
		}
	}
	
	function playNext()
	{
		++current;
		// setupMenu
		play(current);
		setCurrentMenu(current);
		setupSubmenu(current);
		setCurrentSubMenu(current);
	}

	function getIndexByYear(year)
	{
		var output;
		$.each(content, function(i, obj){
			if (obj.year == year)
			{
				output = i;
				return false;
			}
		});
		return output;
	}

	function getIndexByAwardType(awardType)
	{
		var year = getCurrentYear();
		var output;
		$.each(content, function(i, obj){
			if (obj.year == year && obj.awardType == awardType)
			{
				output = i;
				return false;
			}
		});
		return output;
	}

	$('.link').live('touchend',function(e){
		var type = $(this).parent().parent().attr('id');
		var value = $(this).text();

		if (type == 'submenu')
		{
			var index = getIndexByAwardType(value);
			setCurrentSubMenu(index);
			clearTimeout(timer);
			canvas.find('video').unbind("ended");
			play(index);
			e.preventDefault();
		}
		else if (type == 'menu')
		{
			var index = getIndexByYear(value);
			setCurrentMenu(index);
			setupSubmenu(index);
			setCurrentSubMenu(index);
			clearTimeout(timer);
			canvas.find('video').unbind("ended");
			play(index);
			e.preventDefault();
		}
	});

	$('#naviNext').on('touchstart', function(e){
		$('#naviNext').addClass('active');
	});

	$('#naviNext').on('touchend',function(e){
		clearTimeout(timer);
		canvas.find('video').unbind("ended");
		$('#naviNext').removeClass('active');
		playNext();
	});

	$('#naviPrev').on('touchstart', function(e){
		$('#naviPrev').addClass('active');
	});


	var count = 0;
	$('#naviPrev').on('touchend',function(e){
		clearTimeout(timer);
		canvas.find('video').unbind("ended");
		current--;
		if (current < 0)
		{
			current = content.length - 1;
		}
		$('#naviPrev').removeClass('active');
		play(current);
		setCurrentMenu(current);
		setupSubmenu(current);
		setCurrentSubMenu(current);
	});


	//////Main//////

	$('#input').load('./embeded.html',function()
	{
		retriveData();
		setupMenu();
		setCurrentMenu(0);
		setupSubmenu(0);
		setCurrentSubMenu(0);

		play(0);
	});
	
});




