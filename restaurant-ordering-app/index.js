import { menuArray } from "./data.js";

const menuContainer = document.getElementById('menu-container');

const renderMenu = (dinerMenu) => {
    return dinerMenu.map(({emoji, name, ingredients, price, id}) => `
        <div class="menu-list" id="menu-item-${id}">
            <p class="menu-image">${emoji}</p>
            <div class="menu-details">
                <h2>${name}</h2>
                <p>${ingredients.join(', ')}</p>
                <h3>$${(price + .00)}</h3>
            </div>
            <div class="addbtn-notification">
                <p class="add-notification" id="add-notification-${id}">
                    Added to cart
                </p>
                <button class="add-btn" id="btn-notification-${id}" data-addmenu="${id}">
                    +
                </button>
            </div>
        </div>
    `).join('')
}

menuContainer.innerHTML = renderMenu(menuArray)

let dinerCart = []

if (dinerCart.length === 0) {
    document.getElementById('complete-order-btn').classList.add('unclickable')
}

const renderCart = (dinerCart) => {
    return dinerCart.map(({name, id, count, price}) => `
        <div class="cart-item" id="cart-item-${id}">
            <h2>${name}</h2>
            <span class="remove-btn" data-removemenu="${id}">Remove</span>
            <h3>${count} x $${(price + .00)} = $${(count * (price + .00)).toFixed(2)}</h3>
        </div>
    `).join('')
}

const updateCartDisplay = () => {
    const cartContentEl = document.getElementById('cart')
    const completeOrderEl = document.getElementById('complete-order-btn')
    const totalPriceEl = document.getElementById('total-item-price')

    if (dinerCart.length === 0) {
        cartContentEl.classList.add('hidden')
        completeOrderEl.classList.add('unclickable')
    } else {
        cartContentEl.classList.remove('hidden')
        completeOrderEl.classList.remove('unclickable')
    }

    cartContentEl.innerHTML = renderCart(dinerCart)

    const totalPrice = dinerCart.reduce((total, { price, count }) => total + (price + .00).toFixed(2) * count, 0)
    totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`
}

const handleAddBtn = (itemId) => {
    const targetMenuObj = menuArray.find(item => item.id === Number(itemId))
    if (!targetMenuObj) return

    const existingItem = dinerCart.find(item => item.id === targetMenuObj.id)

    if (existingItem) {
        existingItem.count += 1
    } else {
        dinerCart.push({ ...targetMenuObj, count: 1 })
    }

    const notification = document.getElementById(`add-notification-${itemId}`)
    if (notification) {
        notification.style.visibility = 'visible'

        setTimeout (() => {
            notification.style.visibility = 'hidden'
        }, 750)
    }

    const btnNotification = document.getElementById(`btn-notification-${itemId}`)
    if (btnNotification) {
        btnNotification.textContent = "✓"
        btnNotification.classList.add("btn-notification")

        setTimeout (() => {
            btnNotification.textContent = "+"
            btnNotification.classList.remove('btn-notification')
        }, 750)
    }

    updateCartDisplay()
}

const handleRemoveBtn = (itemId) => {
    const targetMenuObj = menuArray.find(item => item.id === Number(itemId))

    if(!targetMenuObj) return

    const existingItem = dinerCart.find(item => item.id === targetMenuObj.id)

    if (existingItem) {
        if (existingItem.count === 1) {
            dinerCart = dinerCart.filter(item => item.id !== targetMenuObj.id)
        } else {
            existingItem.count -= 1
        }
    }

    updateCartDisplay()
}

document.addEventListener('click', (e) => {
    const completeOrderBtn = document.getElementById('complete-order-btn')
    const paymentContainer = document.getElementById('payment-container')

    if (e.target.dataset.addmenu) {
        handleAddBtn(e.target.dataset.addmenu)
    }

    if (e.target.dataset.removemenu) {
        handleRemoveBtn(e.target.dataset.removemenu)
    }

    if (e.target === document.getElementById('complete-order-btn')) {
        completeOrderBtn.classList.add('unclickable')
        paymentContainer.style.display = 'block'
        menuContainer.style.pointerEvents = 'none'
    }

    if (e.target === document.getElementById('close-payment-modal')) {
        completeOrderBtn.classList.remove('unclickable')
        paymentContainer.style.display = 'none'
        menuContainer.style.pointerEvents = 'auto'
    }
})

const orderFormDetails = document.getElementById('payment-details')

orderFormDetails.addEventListener('submit', (e) => {
    e.preventDefault()

    orderFormDetails.style.display = 'none'
    document.getElementById('payment-title').style.display = 'none'
    document.getElementById('menu-container').style.pointerEvents = 'none'

    const orderFormData = new FormData(orderFormDetails)
    const name = orderFormData.get('name')
    const address = orderFormData.get('address')

    const orderConfirmation = document.getElementById('order-confirmation')
    const totalPrice = dinerCart.reduce((total, { price, count }) => total + (price + .00).toFixed(2) * count, 0)

    orderConfirmation.innerHTML = `
        <h2>Thanks, ${name}!</h2>
        <br />
        <h3>Your order is on it's way to ${address}</h3>
        <h4 class="cash">Please make sure you have $${totalPrice.toFixed(2)} ready in cash.</h4>
        <p class="refresh-page">
            <a href="#" id="refresh-page">Click here to make a new order</a>
        </p>
    `

    orderConfirmation.style.display = 'block'

    document.getElementById('refresh-page').addEventListener('click', (e) => {
        e.preventDefault()
        location.reload()
    })


})