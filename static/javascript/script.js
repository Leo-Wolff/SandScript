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

//letter
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

//bottle
//variables
const photoPopup = document.getElementById("insert-photo")
const photoInput = document.getElementById("insert-input")

if (photoInput != null) {
	photoInput.addEventListener("change", (e) => {
		let reader = new FileReader()

		reader.onload = () => {
			document.getElementById("output").src = reader.result
		}

		reader.readAsDataURL(e.target.files[0])

		// output is hidden so that the border style only shows when an image is uploaded
		document.getElementById("output").classList.remove("hidden")

		// show a different button to fake a confirm button
		document.getElementById("upload-photo").classList.add("hidden")
		document.getElementById("confirm-photo").classList.remove("hidden")
	})
}

//TEXT EDITOR FORM POSTING
const quillDataButton = document.querySelectorAll(".get-quill-data")

if (quillDataButton != null) {
	quillDataButton.forEach((element) => {
		element.addEventListener("click", () => {
			let delta = quill.container.firstChild.innerHTML
			document.getElementById("content").value = delta
			console.log(document.getElementById("content").value)
		})
	})
}

//DRAFT ITEM DELETE
const deleteDraftItem = async (draftId) => {
	try {
		const response = await fetch("/delete-draft", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ draftId }),
		})
		const result = await response.json()
		console.log("Deleted document with _id:", draftId)
		console.log(result)
	} catch (err) {
		console.error(err)
	}
	location.reload()
	return false
}

const imagesDelete = document.querySelectorAll(".draft-item img")

if (imagesDelete != null) {
	imagesDelete.forEach((img) => {
		img.addEventListener("click", () => {
			const draftId = img.dataset.documentId
			deleteDraftItem(draftId)
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

function openSortForm() {
	document.getElementById("sorter").style.display = "block"
}

function closeSortForm() {
	document.getElementById("sorter").style.display = "none"
}

function openSortForm() {
	document.getElementById("sorter").style.display = "block"
}

function closeSortForm() {
	document.getElementById("sorter").style.display = "none"
}
