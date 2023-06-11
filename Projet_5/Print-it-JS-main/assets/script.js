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
// Sélection des éléments dans le HTML 
const arrowLeft = document.querySelector('.arrow_left');
const arrowRight = document.querySelector('.arrow_right');
const dots = document.querySelector('.dots');
const image = document.querySelector('.banner-img');
const text = document.querySelector('.banner-txt');
// Variable pour le slide sur lequel on se trouve
let currentSlide = 0;

arrowLeft.addEventListener('click', () => changeSlide(-1));

arrowRight.addEventListener('click', () => changeSlide(1));

for(let i = 0; i < slides.length; i++){
	const dot = document.createElement('span');
	dot.classList.add('dot')
	if(i === 0){
		dot.classList.add('dot_selected');
	}
	dots.appendChild(dot);
}
function changeSlide(step){
	currentSlide = (currentSlide + step + slides.length) % slides.length;
	updateSlide();
	updateDots();
}
function updateSlide(){
	image.src = `./assets/images/slideshow/${slides[currentSlide].image}`;
	text.innerHTML = slides[currentSlide].tagLine;
}

function updateDots(){
	const allDots = document.querySelectorAll('.dot');
	allDots.forEach(dot => dot.classList.remove('dot_selected'));
	allDots[currentSlide].classList.add('dot_selected');
}