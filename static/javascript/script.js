let remainingTime = 2 * 60 * 60 // Two hours in seconds
let timerInterval

const hoursElem = document.getElementById('hours'),
	minutesElem = document.getElementById('minutes'),
	secondsElem = document.getElementById('seconds'),
	timer = document.getElementById('timer'),
	content = document.getElementById('content')

const formatTime = (time, string) => {
	return time == 1 ? `${time}` : `${time}`
}

const startCountdown = () => {
	if (remainingTime < 1) {
		endCountdown()
	}

	let hours = Math.floor(remainingTime / (60 * 60))
	let minutes = Math.floor((remainingTime % (60 * 60)) / 60)
	let seconds = Math.floor(remainingTime % 60)

	hoursElem.innerHTML = formatTime(hours)
	minutesElem.innerHTML = formatTime(minutes)
	secondsElem.innerHTML = formatTime(seconds)

	remainingTime--
}

const endCountdown = () => {
	clearInterval(timerInterval)
}

window.addEventListener('load', () => {
	startCountdown()
	timerInterval = setInterval(startCountdown, 1000)
})
