$(function(){
	var input = $('<input type="text">').css({
		position: 'absolute',
		left: 10,
		top: 10
	}).attr({
		placeholder: 'Your name'
	}).appendTo(document.body);
	
	function getCar(){
		return $('<img/>').attr({src: '/images/car.png', width: 100, height: 56}).css({position: 'absolute'}).appendTo('#container');
	}
	
	var car = getCar();
	
	var carData = {
		speed: 5,
		direction: 0,
		carX: 400,
		carY: 550
	}
	
	function updateCar(data, element, label){
		data.carX += Math.cos(Math.PI / 180 * data.direction) * data.speed;
		data.carY += Math.sin(Math.PI / 180 * data.direction) * data.speed;
		
		element.css('left', data.carX);
		element.css('top', data.carY);
		element.css('transform', 'rotate(' + data.direction + 'deg)');
		
		if(label){
			label.css({
				left: data.carX,
				top: data.carY
			});
		}
	}
	
	setInterval(function(){
		// gasing / braking
		
		if(upKeyPressed && !downKeyPressed){
			carData.speed++;
		}
		if(downKeyPressed && !upKeyPressed){
			carData.speed--;
		}
		
		if(!upKeyPressed && !downKeyPressed){
			carData.speed /= 1.2;
		}
		
		// steering
		
		var steeringSpeed = 0;
		
		if(Math.abs(carData.speed) > 0 && Math.abs(carData.speed) < 10){
			steeringSpeed = Math.min(Math.abs(carData.speed), 10);
		}
		if(Math.abs(carData.speed) > 10){
			steeringSpeed = 10;
		}
		
		if(carData.speed > 0){
			if(leftKeyPressed && !rightKeyPressed){
				carData.direction -= steeringSpeed;
			}
			if(rightKeyPressed && !leftKeyPressed){
				carData.direction += steeringSpeed;
			}
		} else {
			if(leftKeyPressed && !rightKeyPressed){
				carData.direction += steeringSpeed;
			}
			if(rightKeyPressed && !leftKeyPressed){
				carData.direction -= steeringSpeed;
			}
		}
		
		// wrapping
		
		if(carData.carX < 100){
			carData.carX += $(window).width();
		}
		
		if(carData.carX > $(window).width()){
			carData.carX -= $(window).width();
		}
		
		if(carData.carY < 100){
			carData.carY += $(window).height();
		}
		
		if(carData.carY > $(window).height()){
			carData.carY -= $(window).height();
		}
		
		updateCar(carData, car);
		
		$.each(cars, function(i, carData){
			updateCar(carData, carData.element, carData.label);
		})
	}, 30);
	
	var leftKeyPressed = false;
	var rightKeyPressed = false;
	var upKeyPressed = false;
	var downKeyPressed = false;
	
	$(window).keydown(function(event){
		switch(event.keyCode){
		case 37: leftKeyPressed = true; return false;
		case 38: upKeyPressed = true; return false;
		case 39: rightKeyPressed = true; return false;
		case 40: downKeyPressed = true; return false;
		}
	}).keyup(function(event){
		switch(event.keyCode){
		case 37: leftKeyPressed = false; return false;
		case 38: upKeyPressed = false; return false;
		case 39: rightKeyPressed = false; return false;
		case 40: downKeyPressed = false; return false;
		}
	});
	
	setInterval(function(){
		carData.name = input.val();
		
		$.post('/sendCarPosition', carData);
	}, 100);
	
	window.cars = {};
	
	setInterval(function(){
		$.get('/getCarPositions', function(response){
			$.each(response.cars, function(i, car){
				var carData = cars[car.ip];
				
				if(!carData){
					cars[car.ip] = carData = {
						element: getCar().css('opacity', 0.5),
						label: $('<span class="label label-default"></span>').text(car.ip).css({position: 'absolute', marginTop: 50}).appendTo(document.body)
					};
				}
				
				if(car.name){
					carData.label.text(car.name);
				}
				
				$.extend(carData, car);
			});
		});
	}, 100);
});