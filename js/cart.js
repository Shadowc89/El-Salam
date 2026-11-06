function animateProductToCart(button) {
    if (!(button instanceof HTMLButtonElement)) return;

    button.dataset.defaultMarkup ||= button.innerHTML;
    button.classList.add("added");
    button.innerHTML = "تمت الإضافة <i class='fa-solid fa-check' aria-hidden='true'></i>";

    clearTimeout(addButtonTimers.get(button));
    addButtonTimers.set(button, setTimeout(() => {
        if (!button.isConnected) return;
        button.classList.remove("added");
        button.innerHTML = button.dataset.defaultMarkup;
    }, 1100));

    const cartButton = document.querySelector(".cart-trigger");
    const productImage = button.closest(".product-card")?.querySelector(".product-image img");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!cartButton || !productImage || reduceMotion || typeof productImage.animate !== "function") return;

    const imageRect = productImage.getBoundingClientRect();
    const cartRect = cartButton.getBoundingClientRect();
    const size = Math.min(64, imageRect.width * 0.28);
    const startX = imageRect.left + (imageRect.width - size) / 2;
    const startY = imageRect.top + (imageRect.height - size) / 2;
    const endX = cartRect.left + cartRect.width / 2 - (startX + size / 2);
    const endY = cartRect.top + cartRect.height / 2 - (startY + size / 2);
    const flyingImage = productImage.cloneNode();

    Object.assign(flyingImage.style, {
        position: "fixed",
        zIndex: "200",
        top: `${startY}px`,
        left: `${startX}px`,
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "cover",
        borderRadius: "12px",
        boxShadow: "0 12px 30px rgba(41, 35, 31, .24)",
        pointerEvents: "none"
    });
    document.body.append(flyingImage);

    const animation = flyingImage.animate([
        { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
        { transform: `translate(${endX}px, ${endY}px) scale(.18) rotate(12deg)`, opacity: .25 }
    ], {
        duration: 650,
        easing: "cubic-bezier(.22, .72, .24, 1)",
        fill: "forwards"
    });
    animation.onfinish = () => flyingImage.remove();
    animation.oncancel = () => flyingImage.remove();
}

function animateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (!cartCount || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cartCount.classList.remove("bump");
    void cartCount.offsetWidth;
    cartCount.classList.add("bump");
}

function addToCart(productId, button) {
    const product = products.find((item) => item.id === Number(productId));
    if (!product) {
        console.error(`Cannot add missing product ${productId} to the cart.`);
        showToast("تعذر العثور على المنتج.");
        return;
    }
    if (cart[product.id] >= product.stock) {
        showToast("وصلت للكمية المتاحة من هذا المنتج.");
        return;
    }

    cart[product.id] = (cart[product.id] || 0) + 1;
    updateCart();
    animateProductToCart(button);
    animateCartCount();
    showToast(`تمت إضافة "${product.name}" إلى السلة`);
}

function focusCartItemControl(productId, action) {
    const control = document.querySelector(
        `.cart-item[data-product-id="${productId}"] [data-cart-action="${action}"]`
    );
    if (control) {
        control.focus();
        return;
    }

    const fallback = document.querySelector(".empty-cart-link") ||
        document.querySelector("#cart-drawer .close-btn");
    fallback?.focus();
}

function changeQuantity(productId, delta, button) {
    const product = products.find((item) => item.id === Number(productId));
    if (!product) {
        console.error(`Cannot update missing product ${productId} in the cart.`);
        return;
    }
    const nextQuantity = (cart[product.id] || 0) + delta;
    if (nextQuantity > product.stock) {
        showToast("وصلت للكمية المتاحة من هذا المنتج.");
        return;
    }
    cart[product.id] = nextQuantity;
    if (cart[productId] <= 0) delete cart[productId];
    updateCart();
    if (button instanceof HTMLButtonElement) {
        const action = button.dataset.cartAction;
        if (cart[productId]) focusCartItemControl(productId, action);
        else focusCartItemControl(Object.keys(cart)[0], "remove");
    }
}

function removeFromCart(productId) {
    delete cart[productId];
    updateCart();
    focusCartItemControl(Object.keys(cart)[0], "remove");
}



function updateCart() {
    scheduleCartSave();

    const entries = Object.entries(cart);
    const itemCount = entries.reduce((total, [, quantity]) => total + quantity, 0);
    const total = entries.reduce((sum, [id, quantity]) => {
        const product = products.find((item) => item.id === Number(id));
        return sum + product.price * quantity;
    }, 0);

    const cartCount = document.getElementById("cart-count");
    const drawerCount = document.getElementById("drawer-count");
    const cartTotal = document.getElementById("cart-total");
    const cartTriggers = document.querySelectorAll(".cart-trigger");
    const checkoutButton = document.getElementById("checkout-btn");
    if (cartCount) {
        cartCount.textContent = itemCount.toLocaleString("ar-EG");
        cartCount.hidden = itemCount === 0;
    }
    const quantityLabel = itemCount === 1 ? "قطعة" : itemCount === 2 ? "قطعتان" : itemCount > 2 && itemCount < 11 ? "قطع" : "قطعة";
    cartTriggers.forEach((trigger) => {
        trigger.setAttribute("aria-label", `فتح سلة التسوق  ${itemCount.toLocaleString("ar-EG")} ${quantityLabel}`);
        const count = trigger.querySelector(".mobile-bottom-nav-count");
        if (count) {
            count.textContent = itemCount.toLocaleString("ar-EG");
            count.hidden = itemCount === 0;
        }
    });
    if (drawerCount) {
        const quantityLabel = itemCount === 1 ? "قطعة" : itemCount === 2 ? "قطعتان" : itemCount > 2 && itemCount < 11 ? "قطع" : "قطعة";
        drawerCount.textContent = `${itemCount.toLocaleString("ar-EG")} ${quantityLabel}`;
    }
    if (cartTotal) cartTotal.textContent = formatPrice(total);
    if (checkoutButton) checkoutButton.disabled = entries.length === 0;
    const cartItems = document.getElementById("cart-items");
    if (!cartItems) return;
    if (!entries.length) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <span class="cart-empty-icon" aria-hidden="true"><i class="fa-solid fa-bag-shopping"></i></span>
                <strong>سلتك لسه فاضية</strong>
                <span>اكتشف القطع اللي تكمل إطلالتك.</span>
                <a class="empty-cart-link" href="products.html">تصفّح المنتجات</a>
            </div>`;
        return;
    }

    cartItems.innerHTML = entries.map(([id, quantity]) => {
        const product = products.find((item) => item.id === Number(id));
        return `
          <article class="cart-item" data-product-id="${product.id}" role="listitem">
            <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}">
            <div class="cart-item-details">
              <h3>${escapeHTML(product.name)}</h3>
              <div class="item-price">${formatPrice(product.price)} للقطعة</div>
              <div class="quantity-controls">
                <button type="button" data-cart-action="decrease" aria-label="تقليل كمية ${escapeHTML(product.name)}"
                    onclick="changeQuantity(${product.id}, -1, this)">−</button>
                <span aria-live="polite">${quantity.toLocaleString("ar-EG")}</span>
                <button type="button" data-cart-action="increase" aria-label="زيادة كمية ${escapeHTML(product.name)}"
                    ${quantity >= product.stock ? "disabled" : ""}
                    onclick="changeQuantity(${product.id}, 1, this)">+</button>
              </div>
            </div>
            <div class="cart-item-end">
                <strong class="item-subtotal">${formatPrice(product.price * quantity)}</strong>
                <button class="remove-item" type="button" data-cart-action="remove" aria-label="حذف ${escapeHTML(product.name)}"
                    onclick="removeFromCart(${product.id})"><i class="fa-regular fa-trash-can" aria-hidden="true"></i></button>
            </div>
          </article>`;
    }).join("");
}

function openCart(trigger) {
    closeMobileNav();
    const drawer = document.getElementById("cart-drawer");
    const cartTrigger = trigger instanceof HTMLElement
        ? trigger
        : document.querySelector(".cart-trigger");
    if (!drawer) return;

    lastPanelTrigger = cartTrigger;
    document.querySelectorAll(".cart-trigger").forEach((button) => {
        button.setAttribute("aria-expanded", "true");
    });
    drawer.classList.add("open");
    drawer.inert = false;
    drawer.setAttribute("aria-hidden", "false");
    document.getElementById("overlay")?.classList.add("open");
    document.body.classList.add("locked");
    drawer.querySelector(".close-btn")?.focus();
}

function toggleMobileNav(trigger) {
    closeCart();
    const nav = document.getElementById("mobile-nav");
    if (!nav) return;
    const isOpen = nav.classList.toggle("open");
    if (isOpen) {
        lastPanelTrigger = trigger instanceof HTMLElement ? trigger : document.querySelector(".mobile-menu-btn");
    }
    lastPanelTrigger?.setAttribute("aria-expanded", String(isOpen));
    nav.setAttribute("aria-hidden", String(!isOpen));
    document.getElementById("overlay")?.classList.toggle("open", isOpen);
    document.body.classList.toggle("locked", isOpen);
    if (isOpen) nav.querySelector(".close-btn")?.focus();
}

function closeCart() {
    const drawer = document.getElementById("cart-drawer");
    drawer?.classList.remove("open");
    if (drawer) drawer.inert = true;
    drawer?.setAttribute("aria-hidden", "true");
    document.querySelectorAll(".cart-trigger").forEach((button) => {
        button.setAttribute("aria-expanded", "false");
    });
}

function closeMobileNav() {
    const nav = document.getElementById("mobile-nav");
    if (!nav) return;
    nav.classList.remove("open");
    nav.setAttribute("aria-hidden", "true");
    document.querySelector(".mobile-menu-btn")?.setAttribute("aria-expanded", "false");
}

function closePanels() {
    const trigger = lastPanelTrigger;
    closeCart();
    closeMobileNav();
    document.getElementById("overlay")?.classList.remove("open");
    document.body.classList.remove("locked");
    lastPanelTrigger = null;
    if (trigger?.isConnected) trigger.focus();
}
