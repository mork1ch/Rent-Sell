function Sim(sldrId) {

	let id = document.getElementById(sldrId);
	if(id) {
		this.sldrRoot = id
	}
	else {
		this.sldrRoot = document.querySelector('.sim-slider')
	};

	// Carousel objects
	this.sldrList = this.sldrRoot.querySelector('.sim-slider-list');
	this.sldrElements = this.sldrList.querySelectorAll('.sim-slider-element');
	this.sldrElemFirst = this.sldrList.querySelector('.sim-slider-element');
	this.leftArrow = this.sldrRoot.querySelector('div.sim-slider-arrow-left');
	this.rightArrow = this.sldrRoot.querySelector('div.sim-slider-arrow-right');
	this.indicatorDots = this.sldrRoot.querySelector('div.sim-slider-dots');

	// Initialization
	this.options = Sim.defaults;
	Sim.initialize(this)
};

Sim.defaults = {

	// Default options for the carousel
	loop: true,     // Бесконечное зацикливание слайдера
	auto: true,     // Автоматическое пролистывание
	interval: 5000, // Интервал между пролистыванием элементов (мс)
	arrows: true,   // Пролистывание стрелками
	dots: true      // Индикаторные точки
};

Sim.prototype.elemPrev = function(num) {
	num = num || 1;

	let prevElement = this.currentElement;
	this.currentElement -= num;
	if(this.currentElement < 0) this.currentElement = this.elemCount-1;

	if(!this.options.loop) {
		if(this.currentElement == 0) {
			this.leftArrow.style.display = 'none'
		};
		this.rightArrow.style.display = 'block'
	};
	
	this.sldrElements[this.currentElement].style.opacity = '1';
	this.sldrElements[prevElement].style.opacity = '0';

	if(this.options.dots) {
		this.dotOn(prevElement); this.dotOff(this.currentElement)
	}
};

Sim.prototype.elemNext = function(num) {
	num = num || 1;
	
	let prevElement = this.currentElement;
	this.currentElement += num;
	if(this.currentElement >= this.elemCount) this.currentElement = 0;

	if(!this.options.loop) {
		if(this.currentElement == this.elemCount-1) {
			this.rightArrow.style.display = 'none'
		};
		this.leftArrow.style.display = 'block'
	};

	this.sldrElements[this.currentElement].style.opacity = '1';
	this.sldrElements[prevElement].style.opacity = '0';

	if(this.options.dots) {
		this.dotOn(prevElement); this.dotOff(this.currentElement)
	}
};

Sim.prototype.dotOn = function(num) {
	this.indicatorDotsAll[num].style.cssText = 'background-color:#BBB; cursor:pointer;'
};

Sim.prototype.dotOff = function(num) {
	this.indicatorDotsAll[num].style.cssText = 'background-color:#556; cursor:default;'
};

Sim.initialize = function(that) {

	// Constants
	that.elemCount = that.sldrElements.length; // Количество элементов

	// Variables
	that.currentElement = 0;
	let bgTime = getTime();

	// Functions
	function getTime() {
		return new Date().getTime();
	};
	function setAutoScroll() {
		that.autoScroll = setInterval(function() {
			let fnTime = getTime();
			if(fnTime - bgTime + 10 > that.options.interval) {
				bgTime = fnTime; that.elemNext()
			}
		}, that.options.interval)
	};

	// Start initialization
	if(that.elemCount <= 1) {   // Отключить навигацию
		that.options.auto = false; that.options.arrows = false; that.options.dots = false;
		that.leftArrow.style.display = 'none'; that.rightArrow.style.display = 'none'
	};
	if(that.elemCount >= 1) {   // показать первый элемент
		that.sldrElemFirst.style.opacity = '1';
	};

	if(!that.options.loop) {
		that.leftArrow.style.display = 'none';  // отключить левую стрелку
		that.options.auto = false; // отключить автопркрутку
	}
	else if(that.options.auto) {   // инициализация автопрокруки
		setAutoScroll();
		// Остановка прокрутки при наведении мыши на элемент
		that.sldrList.addEventListener('mouseenter', function() {clearInterval(that.autoScroll)}, false);
		that.sldrList.addEventListener('mouseleave', setAutoScroll, false)
	};

	if(that.options.arrows) {  // инициализация стрелок
		that.leftArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if(fnTime - bgTime > 1000) {
				bgTime = fnTime; that.elemPrev()
			}
		}, false);
		that.rightArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if(fnTime - bgTime > 1000) {
				bgTime = fnTime; that.elemNext()
			}
		}, false)
	}
	else {
		that.leftArrow.style.display = 'none'; that.rightArrow.style.display = 'none'
	};

	if(that.options.dots) {  // инициализация индикаторных точек
		let sum = '', diffNum;
		for(let i=0; i<that.elemCount; i++) {
			sum += '<span class="sim-dot"></span>'
		};
		that.indicatorDots.innerHTML = sum;
		that.indicatorDotsAll = that.sldrRoot.querySelectorAll('span.sim-dot');
		// Назначаем точкам обработчик события 'click'
		for(let n=0; n<that.elemCount; n++) {
			that.indicatorDotsAll[n].addEventListener('click', function() {
				diffNum = Math.abs(n - that.currentElement);
				if(n < that.currentElement) {
					bgTime = getTime(); that.elemPrev(diffNum)
				}
				else if(n > that.currentElement) {
					bgTime = getTime(); that.elemNext(diffNum)
				}
				// Если n == that.currentElement ничего не делаем
			}, false)
		};
		that.dotOff(0);  // точка[0] выключена, остальные включены
		for(let i=1; i<that.elemCount; i++) {
			that.dotOn(i)
		}
	}
};

new Sim();

// Второй слайдер

var multiItemSlider = (function () {
	return function (selector, config) {
	  var
		_mainElement = document.querySelector(selector), // основный элемент блока
		_sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
		_sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
		_sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
		_sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
		_sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
		_wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
		_itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента    
		_positionLeftItem = 0, // позиция левого активного элемента
		_transform = 0, // значение транфсофрмации .slider_wrapper
		_step = _itemWidth / _wrapperWidth * 112, // величина шага (для трансформации)
		_items = []; // массив элементов
	  // наполнение массива _items
	  _sliderItems.forEach(function (item, index) {
		_items.push({ item: item, position: index, transform: 0 });
	  });

	  var position = {
		getMin: 0,
		getMax: _items.length - 1,
	  }

	  var _transformItem = function (direction) {
		if (direction === 'right') {
		  if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) >= position.getMax) {
			return;
		  }
		  if (!_sliderControlLeft.classList.contains('slider__control_show')) {
			_sliderControlLeft.classList.add('slider__control_show');
		  }
		  if (_sliderControlRight.classList.contains('slider__control_show') && (_positionLeftItem + _wrapperWidth / _itemWidth) >= position.getMax) {
			_sliderControlRight.classList.remove('slider__control_show');
		  }
		  _positionLeftItem++;
		  _transform -= _step;
		}
		if (direction === 'left') {
		  if (_positionLeftItem <= position.getMin) {
			return;
		  }
		  if (!_sliderControlRight.classList.contains('slider__control_show')) {
			_sliderControlRight.classList.add('slider__control_show');
		  }
		  if (_sliderControlLeft.classList.contains('slider__control_show') && _positionLeftItem - 1 <= position.getMin) {
			_sliderControlLeft.classList.remove('slider__control_show');
		  }
		  _positionLeftItem--;
		  _transform += _step;
		}
		_sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
	  }

	  // обработчик события click для кнопок "назад" и "вперед"
	  var _controlClick = function (e) {
		if (e.target.classList.contains('slider__control')) {
		  e.preventDefault();
		  var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
		  _transformItem(direction);
		}
	  };

	  var _setUpListeners = function () {
		// добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
		_sliderControls.forEach(function (item) {
		  item.addEventListener('click', _controlClick);
		});
	  }

	  // инициализация
	  _setUpListeners();

	  return {
		right: function () { // метод right
		  _transformItem('right');
		},
		left: function () { // метод left
		  _transformItem('left');
		}
	  }

	}
  }());

  var slider = multiItemSlider('.slider')


//   делаю галерею на полюс на втором слайдере

function galerei_open1(){
	document.getElementById("hide_galer1").setAttribute("style", "display: inline-block; margin-right: 200px");
	document.getElementById("plus1").setAttribute("style", "display: none");
	document.getElementById("minus1").setAttribute("style", "display: block; padding-top: -380px;");
	document.getElementById("home1").setAttribute("style", "margin-right: 0px");
}
function galerei_close1(){
	document.getElementById("hide_galer1").setAttribute("style", "display: none");
	document.getElementById("minus1").setAttribute("style", "display: none");
	document.getElementById("plus1").setAttribute("style", "display: block");
	document.getElementById("home1").setAttribute("style", "margin-right: 50px");
}

function galerei_open2(){
	document.getElementById("hide_galer2").setAttribute("style", "display: inline-block; margin-right: 200px");
	document.getElementById("plus2").setAttribute("style", "display: none");
	document.getElementById("minus2").setAttribute("style", "display: block; padding-top: -380px;");
	document.getElementById("home1").setAttribute("style", "display: none");
}
function galerei_close2(){
	document.getElementById("hide_galer2").setAttribute("style", "display: none");
	document.getElementById("minus2").setAttribute("style", "display: none");
	document.getElementById("plus2").setAttribute("style", "display: block");
	document.getElementById("home2").setAttribute("style", "margin-right: 50px");
	document.getElementById("home1").setAttribute("style", "display: block");
}

function galerei_open3(){
	document.getElementById("hide_galer3").setAttribute("style", "display: inline-block; margin-right: 200px");
	document.getElementById("plus3").setAttribute("style", "display: none");
	document.getElementById("minus3").setAttribute("style", "display: block; padding-top: -380px;");
	document.getElementById("home3").setAttribute("style", "margin-right: 0px");
	document.getElementById("home2").setAttribute("style", "display: none");
}
function galerei_close3(){
	document.getElementById("hide_galer3").setAttribute("style", "display: none");
	document.getElementById("minus3").setAttribute("style", "display: none");
	document.getElementById("plus3").setAttribute("style", "display: block");
	document.getElementById("home3").setAttribute("style", "margin-right: 50px");
	document.getElementById("home2").setAttribute("style", "display: block");
}

function galerei_open4(){
	document.getElementById("hide_galer4").setAttribute("style", "display: inline-block; margin-right: 200px");
	document.getElementById("plus4").setAttribute("style", "display: none");
	document.getElementById("minus4").setAttribute("style", "display: block; padding-top: -380px;");
	document.getElementById("home4").setAttribute("style", "margin-right: 0px");
	document.getElementById("home2").setAttribute("style", "display: none");
	document.getElementById("home3").setAttribute("style", "display: none");
}
function galerei_close4(){
	document.getElementById("hide_galer4").setAttribute("style", "display: none");
	document.getElementById("minus4").setAttribute("style", "display: none");
	document.getElementById("plus4").setAttribute("style", "display: block");
	document.getElementById("home4").setAttribute("style", "margin-right: 50px");
	document.getElementById("home2").setAttribute("style", "display: block");
	document.getElementById("home3").setAttribute("style", "display: block");
}