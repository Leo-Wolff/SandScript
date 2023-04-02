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
const photoPopup = document.getElementById("insert-photo"),
	photoInput = document.getElementById("insert-input")

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

//DRAFTS
//variables
const deleteButton = document.querySelectorAll(".draft-item img"),
	draftItem = document.querySelectorAll(".draft-item"),
	draftText = document.getElementById("editor-text")

const deleteDraftItem = async (draftID, callback) => {
	try {
		// fetches objectID of the document that will be deleted and sends a HTTP DELETE request (which gets handled in the controller)
		const response = await fetch("/delete-draft", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ draftID }),
		})
		const result = await response.json()

		// console.log("Deleted document with _id:", draftId)

		console.log(result)
		callback()
	} catch (err) {
		console.error(err)
	}
}

// Insert draft item in quill editor
const clickDraftItem = (e) => {
	const documentId = e.currentTarget
		.querySelector("img")
		.getAttribute("data-id")
	console.log(documentId)
	window.location.href = `/letter?documentId=${encodeURIComponent(documentId)}`
}

// Delete draft item
if (deleteButton != null) {
	deleteButton.forEach((element) => {
		element.addEventListener("click", () => {
			const draftID = element.dataset.id

			console.log(draftID)

			// make sure that clickDraftItem event doesn't override the delete event (since deleteButton is nestled into draftItem)
			draftItem.forEach((draft) => {
				draft.removeEventListener("click", clickDraftItem)
			})

			// reload page so that user doesn't have to to see the result
			deleteDraftItem(draftID, () => {
				location.reload()
			})
		})
	})
}

// Insert draft item in quill editor
if (draftItem != null) {
	draftItem.forEach((draftItem) => {
		draftItem.addEventListener("click", clickDraftItem)
	})
}

if (draftText != null) {
	console.log(draftText.innerHTML)
	quill.container.firstChild.innerHTML = draftText.innerHTML
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
