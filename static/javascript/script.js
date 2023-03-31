//QUILL EDITOR
var toolbarOptions = [
	["bold", "italic", "underline", "strike"], // toggled buttons
]

var quill = new Quill("#editor", {
	modules: {
		toolbar: toolbarOptions,
	},

	placeholder: "Write your letter...",

	theme: "snow",
})

// POP-UPS
//variables
const closeButtons = document.querySelectorAll(".popup img"),
	stopPopup = document.querySelectorAll(".popup section")[0],
	signPopup = document.querySelectorAll(".popup section")[1],
	signForm = document.querySelectorAll(".popup section")[2]

//All popups are included here since there is never a time that more than one popup has to be open
if (closeButtons != null) {
	closeButtons.forEach((element) => {
		element.addEventListener("click", () => {
			stopPopup.classList.add("hidden")
			signPopup.classList.add("hidden")
			signForm.classList.add("hidden")
			console.log("Close pop-up")
		})
	})
}

if (document.getElementById("back-button") != null) {
	document.getElementById("back-button").addEventListener("click", () => {
		stopPopup.classList.remove("hidden")
		console.log("Open stop writing letter pop-up")
	})
}

if (document.querySelector(".confirm-letter") != null) {
	document.querySelector(".confirm-letter").addEventListener("click", () => {
		signPopup.classList.remove("hidden")
		console.log("Open sign letter pop-up")
	})
}

if (document.querySelector(".styled-like-a") != null) {
	document.querySelector(".styled-like-a").addEventListener("click", () => {
		signPopup.classList.add("hidden")
		signForm.classList.remove("hidden")
		console.log("Open sign letter form")
	})
}

//TEXT EDITOR FORM POSTING
if (document.querySelector(".styled-like-a") != null) {
	document.querySelector(".styled-like-a").addEventListener("click", () => {
		var delta = quill.container.firstChild.innerHTML
		document.getElementById("content").value = delta
		console.log(document.getElementById("content").value)
	})
}

//DRAFT ITEM DELETE
const deleteImg = async (documentId) => {
	try {
		console.log("Deleting document with _id:", documentId)
		const response = await fetch("/delete-image", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ documentId }),
		})
		const result = await response.json()
		console.log(result)
	} catch (err) {
		console.error(err)
	}
}

const imagesDelete = document.querySelectorAll(".draft-item img")

if (imagesDelete != null) {
	imagesDelete.forEach((img) => {
		img.addEventListener("click", () => {
			const documentId = img.dataset.documentId
			deleteImg(documentId)
			console.log("Delete document")
		})
	})
}

// CLOCK
let remainingTime = 2 * 60 * 60 // Two hours in seconds
let timerInterval

const hoursElem = document.getElementById("hours"),
	minutesElem = document.getElementById("minutes"),
	secondsElem = document.getElementById("seconds"),
	timer = document.getElementById("timer"),
	content = document.getElementById("content")

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

window.addEventListener("load", () => {
	startCountdown()
	timerInterval = setInterval(startCountdown, 1000)
})

function openForm() {
	document.getElementById("filter").style.display = "block"
}

function closeForm() {
	document.getElementById("filter").style.display = "none"
}
