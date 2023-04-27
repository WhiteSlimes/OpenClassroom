const slides = [
	{
		"image":"slide1.jpg",
		"tagLine":"Impressions tous formats <span>en boutique et en ligne</span>"
	},
	{
		"image":"slide2.jpg",
		"tagLine":"Tirages haute définition grand format <span>pour vos bureaux et events</span>"
	},
	{
		"image":"slide3.jpg",
		"tagLine":"Grand choix de couleurs <span>de CMJN aux pantones</span>"
	},
	{
		"image":"slide4.png",
		"tagLine":"Autocollants <span>avec découpe laser sur mesure</span>"
	}
]

const arrowLeft = document.querySelector('.arrow_left');
const arrowRight = document.querySelector('.arrow_right');
const dots = document.querySelector('.dots');
const image = document.querySelector('.banner-img');
const text = document.querySelector('.banner-txt');
let currentSlide = 0;

arrowLeft.addEventListener('click', function(){
	nextSlideLeft();
});
arrowRight.addEventListener('click', function(){
	nextSlideRight();
});

for(let i =0; i < slides.length; i++){
	const dot = document.createElement('span');
	dot.classList.add('dot')
	if(i === 0){
		dot.classList.add('dot_selected');
	}
	dots.appendChild(dot);
}

function nextSlideRight(){
	if(currentSlide === slides.length - 1){
		currentSlide = 0;
	}else{
		currentSlide++;
	}
	image.src = "./assets/images/slideshow/" + slides[currentSlide].image;
	text.innerHTML = slides[currentSlide].tagLine;
	updateDots();
}
function nextSlideLeft(){
	if(currentSlide === 0){
		currentSlide = slides.length - 1;
	}else{
		currentSlide--;
	}
	image.src = "./assets/images/slideshow/" + slides[currentSlide].image;
	text.innerHTML = slides[currentSlide].tagLine;
	updateDots();
}

function updateDots(){
	const allDots = document.querySelectorAll('.dot')
	for (let i = 0; i < allDots.length; i++){
		allDots[i].classList.remove('dot_selected');
	}
	allDots[currentSlide].classList.add('dot_selected');
}