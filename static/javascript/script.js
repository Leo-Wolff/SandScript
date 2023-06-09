// LETTER.EJS RELATED
// Initialise quill editor
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

// Post quill contents
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

// Create new letter
const matchItem = document.querySelectorAll(".matchable"),
    matchProfile = document.querySelector(".match-profile")

const clickMatch = (e) => {
    const matchID = e.currentTarget.querySelector(".username").innerHTML
    console.log(matchID)
    window.location.href = `/editor/letter?matchID=${encodeURIComponent(
        matchID
    )}`
}

if (matchItem != null) {
    matchItem.forEach((matchItem) => {
        matchItem.addEventListener("click", clickMatch)
    })
}

// BOTTLE.EJS RELATED
// variables
const photoPopup = document.querySelectorAll(".bottle section")[1]

if (document.querySelector(".camera") != null) {
    document.querySelector(".camera").addEventListener("click", () => {
        photoPopup.classList.remove("hidden")
        console.log("Open insert photo pop-up")
    })
}

if (document.getElementById("insert-photo") != null) {
    document.getElementById("insert-photo").addEventListener("change", (e) => {
        let reader = new FileReader()

        reader.onload = () => {
            photoPopup.querySelector("div img").src = reader.result
        }

        reader.readAsDataURL(e.target.files[0])

        // output is hidden so that the border style only shows when an image is uploaded
        photoPopup.querySelector(".output").classList.remove("hidden")

        // show a different button to fake a confirm button
        photoPopup.querySelector("div label").classList.add("hidden")
        photoPopup.querySelector("div p").classList.remove("hidden")
    })
}

// Add photo to bottle
if (photoPopup != null) {
    photoPopup.querySelector("div p").addEventListener("click", () => {
        document.querySelector(".bottle-img").src = "/img/open-img-bottle.svg" // add a polaroid photo into the bottle when a photo is selected

        photoPopup.classList.add("hidden") // hide the select photo pop-up

        //make it so that when the user clicks on the pop-up again, they can upload a different photo
        photoPopup.querySelector("div label").classList.remove("hidden")
        photoPopup.querySelector("div p").classList.add("hidden")
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
        const response = await fetch("/editor/delete-draft", {
            method: "DELETE",
            headers: {
                // headers = extra information
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

// Insert draft item in quill editor at letter.ejs
const clickDraftItem = (e) => {
    const draftID = e.currentTarget.querySelector("img").getAttribute("data-id")
    console.log(draftID)
    window.location.href = `/editor/letter?draftID=${encodeURIComponent(
        draftID
    )}`
}

if (draftItem != null) {
    draftItem.forEach((draftItem) => {
        draftItem.addEventListener("click", clickDraftItem)
    })
}

// Load in draft contents if they exist
if (draftText != null) {
    console.log(draftText.innerHTML)
    quill.container.firstChild.innerHTML = draftText.innerHTML
}

// POP-UPS
// variables
const closeButtons = document.querySelectorAll(".popup img"),
    stopPopup = document.querySelectorAll(".popup section")[0],
    signPopup = document.querySelectorAll(".popup section")[1],
    signForm = document.querySelectorAll(".popup section")[2]

// All popups are included here since there is never a time that more than one popup has to be open
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

// Letter
if (document.getElementById("back-button") != null) {
    document.getElementById("back-button").addEventListener("click", () => {
        stopPopup.classList.remove("hidden")
        signPopup.classList.add("hidden")
        signForm.classList.add("hidden")

        console.log("Open stop writing letter pop-up")
    })
}

if (document.querySelector(".confirm-button") != null && signForm != null) {
    document.querySelector(".confirm-button").addEventListener("click", () => {
        signPopup.classList.remove("hidden")
        stopPopup.classList.add("hidden")
        signForm.classList.add("hidden")

        console.log("Open sign letter pop-up")
    })
}

if (document.querySelector(".styled-like-a") != null) {
    document.querySelector(".styled-like-a").addEventListener("click", () => {
        signForm.classList.remove("hidden")
        stopPopup.classList.add("hidden")
        signPopup.classList.add("hidden")

        console.log("Open sign letter form")
    })
}

// Show recipient profile
if (document.querySelector(".recipient") != null) {
    document.querySelector(".recipient").addEventListener("click", () => {
        matchProfile.classList.remove("hidden")

        console.log("Show recipient's profile")
    })
}

if (document.querySelector(".close-button") != null) {
    document.querySelector(".close-button").addEventListener("click", () => {
        matchProfile.classList.add("hidden")
        console.log("Hide recipient's profile")
    })
}

// FILTER FORM RELATED

// search for filter form
const filterForm = document.getElementById("filter")

// if filter form has been found, do the function
if (filterForm != null) {
    const filterIcon = document.querySelector(".filterIcon")
    filterIcon.addEventListener("click", () => {
        filterForm.classList.remove("hidden") // show form when clicked on filterIcon
    }) // close button to close form

    const closeFilterFormButton = document.querySelector(".cancel-filter")
    closeFilterFormButton.addEventListener("click", () => {
        filterForm.classList.add("hidden") // hide form when clicked on clos button
    })
}

// search for sort form
const sorterForm = document.getElementById("sorter")

// if sorter form has been found, do the function
if (sorterForm != null) {
    const sortIcon = document.querySelector(".sortIcon")
    sortIcon.addEventListener("click", () => {
        sorterForm.classList.remove("hidden") // show form when clicked on sortIcon
    }) // close button to close form

    const closeSortFormButton = document.querySelector(".cancel-sorter")
    closeSortFormButton.addEventListener("click", () => {
        sorterForm.classList.add("hidden") // hide form when clicked on clos button
    })
}
