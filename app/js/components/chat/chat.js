import { v4 as uuidv4 } from "uuid"
import dateFormat from "../../services/service"

export default class Chat {
	constructor(parrentElement) {
		this.parrentDomEl = document.querySelector(parrentElement)

		this.callSendEventForForm = this.callSendEventForForm.bind(this)
	}

	init() {
		this.userList = [
			{
				id: 1,
				name: "Alexander"
			},
			{
				id: 3,
				name: "Nikita"
			},
			{
				id: 2,
				name: "Rick"
			}
		]
		this.messageList = [
			{
				idParrent: 3,
				date: "23:10 20.03.2019",
				text: "привет как дела"
			},
			{
				idParrent: 2,
				date: "21:10 20.03.2019",
				text: "Пока не родила"
			}
		]

		this.createInitPopup()
	}

	createInitPopup() {
		const initPopupDomEl = document.createElement("div")
		initPopupDomEl.classList.add("popup")
		initPopupDomEl.innerHTML = `
            <div class="popup__content">
                <h2 class="popup__content-title">Выберите псевдоним</h2>
                <div class="popup__content-input">
                    <span></span>
                    <form name="popup-form">
                        <input type="text" name="popup-input" />
                        <button type="submit" class="popup__content-submit">Продолжить</button>
                    </form>
                </div>
            </div>
        `

		this.parrentDomEl.appendChild(initPopupDomEl)

		const nikNameInput = initPopupDomEl.querySelector("input")
		const errorDomEl = initPopupDomEl.querySelector("span")

		initPopupDomEl.addEventListener("click", e => {
			e.preventDefault()

			if (e.target.closest(".popup__content-submit")) {
				if (nikNameInput.value === "") {
					errorDomEl.style.display = "block"
					errorDomEl.textContent = "Задайте ваш псевдоним"

					return
				}

				if (this.userList.findIndex(user => user.name === nikNameInput.value) === -1) {
					this.currentId = uuidv4()

					this.userList.push({
						id: this.currentId,
						name: nikNameInput.value
					})

					nikNameInput.value = ""

					initPopupDomEl.remove()

					this.createChat()
					return
				}

				errorDomEl.style.display = "block"
				errorDomEl.textContent = "Такое имя уже есть"
			}
		})

		nikNameInput.addEventListener("input", () => {
			errorDomEl.style.display = "none"
		})
	}

	createChat() {
		this.chatDomEl = document.createElement("div")
		this.chatDomEl.classList.add("chat")

		this.chatDomEl.innerHTML = `
                <ul class="chat-user-list">
                </ul>
                <div class="chat-content">
                    <ul class="chat-content__message-list">
                    </ul>
                    <form class="chat-content__form" name="chat-form">
                        <textarea class="chat-content__input" name="chat-text" cols="40" rows="1" placeholder="Type your message here"></textarea>
                    </form>
                </div>
        `

		this.parrentDomEl.appendChild(this.chatDomEl)

		this.messageListDomEl = this.chatDomEl.querySelector(".chat-content__message-list")
		this.userListDomEl = this.chatDomEl.querySelector(".chat-user-list")
		this.textAreaDomEl = this.chatDomEl.querySelector(".chat-content__input")
		this.formDomEl = this.chatDomEl.querySelector(".chat-content__form")

		this.currentUser = this.userList.find(user => user.id === this.currentId)

		this.renderUsers()
		this.renderAllMessages()
		this.addEvents()
	}

	addEvents() {
		this.formDomEl.addEventListener("submit", e => {
			e.preventDefault()

			this.createNewMessage(this.textAreaDomEl.value)

			this.textAreaDomEl.value = ""
		})

		this.textAreaDomEl.addEventListener("keydown", this.callSendEventForForm)

		this.textAreaDomEl.addEventListener("keyup", e => {
			if (e.key === "Shift") {
				this.textAreaDomEl.addEventListener("keydown", this.callSendEventForForm)
			}
		})
	}

	callSendEventForForm(e) {
		if (e.key === "Shift") {
			this.textAreaDomEl.removeEventListener("keydown", this.callSendEventForForm)
		}

		if (e.key === "Enter") {
			e.preventDefault()

			if (this.textAreaDomEl.value !== "") {
				this.formDomEl.dispatchEvent(new MouseEvent("submit"))
			}
		}
	}

	renderUsers() {
		this.userListDomEl.innerHTML = ""

		this.userList.forEach(user => {
			const userItemDomEl = document.createElement("li")
			userItemDomEl.classList.add("chat-user-list__item")

			userItemDomEl.innerHTML = `
                <div class="chat-user-list__item-avatar"></div>
                <h2 class="chat-user-list__item-name" style="${user.id === this.currentId ? "color: #FF6600" : ""}">${
				user.id === this.currentId ? "You" : user.name
			}</h2>
            `
			if (user.id === this.currentId) {
				this.userListDomEl.insertAdjacentElement("beforeEnd", userItemDomEl)

				return
			}

			this.userListDomEl.insertAdjacentElement("afterbegin", userItemDomEl)
		})
	}

	createNewMessage(text) {
		const message = {
			idParrent: this.currentId,
			date: dateFormat(),
			text
		}

		this.messageList.push(message)

		this.renderMessage(this.currentUser, message)
	}

	renderMessage(user, message) {
		const messageDomEl = document.createElement("li")

		messageDomEl.classList.add("chat-content__message-list-item")

		messageDomEl.innerHTML = `
            <p class="chat-content__message-list-item-info" style="${user.id === this.currentId ? "color: #FF6600" : ""}">
                ${user.id === this.currentId ? "You" : user.name},
                <span class="chat-content__message-list-item-date"> ${message.date}</span>
            </p>
            <pre class="chat-content__message-list-item-text">${message.text}</pre>
        `
		messageDomEl.style.textAlign = `${user.id === this.currentId ? "right" : ""}`

		this.messageListDomEl.appendChild(messageDomEl)
	}

	renderAllMessages() {
		this.messageList.forEach(message => {
			const currentUser = this.userList.find(user => user.id === message.idParrent)
			this.renderMessage(currentUser, message)
		})
	}
}
