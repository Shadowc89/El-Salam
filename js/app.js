function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function checkout() {
    if (!Object.keys(cart).length) {
        showToast("السلة فارغة  أضف منتجًا أولًا.");
        return;
    }

    let dialog = document.getElementById("checkout-dialog");
    if (!dialog) {
        dialog = document.createElement("dialog");
        dialog.id = "checkout-dialog";
        dialog.className = "checkout-dialog";
        dialog.innerHTML = `
            <form class="checkout-form">
                <button class="checkout-close" type="button" aria-label="إغلاق">×</button>
                <h2>بيانات العميل</h2>
                <p class="checkout-note">الدفع نقدًا متاح حاليًا. الطلب يُحفظ على هذا الجهاز فقط ولا يصل للمتجر قبل ربط الخادم.</p>
                <label for="checkout-name">الاسم</label>
                <input id="checkout-name" name="customer_name" maxlength="200" autocomplete="name" required>
                <label for="checkout-phone">رقم الهاتف</label>
                <input id="checkout-phone" name="customer_phone" type="tel" maxlength="40" autocomplete="tel" required>
                <fieldset class="checkout-payment">
                    <legend>طريقة الدفع</legend>
                    <label class="checkout-payment-option">
                        <input type="radio" name="payment_method" value="cash" checked>
                        <span><strong>الدفع نقدًا</strong><small>الدفع الإلكتروني غير متاح حاليًا.</small></span>
                    </label>
                </fieldset>
                <p class="checkout-error" role="alert" hidden></p>
                <button class="primary-btn checkout-submit" type="submit">حفظ الطلب</button>
            </form>`;
        const form = dialog.querySelector(".checkout-form");
        const successPanel = document.createElement("section");
        successPanel.className = "checkout-success";
        successPanel.hidden = true;
        successPanel.setAttribute("aria-labelledby", "checkout-success-title");
        successPanel.innerHTML = `
            <div class="checkout-success-icon" aria-hidden="true">
                <svg viewBox="0 0 64 64" focusable="false">
                    <circle class="checkout-success-circle" cx="32" cy="32" r="28"></circle>
                    <path class="checkout-success-check" d="m18 33 9 9 20-21"></path>
                </svg>
            </div>
            <span class="checkout-success-kicker">EL SALAM / ORDER SAVED LOCALLY</span>
            <h2 id="checkout-success-title">تم حفظ بيانات الطلب</h2>
            <p>طريقة الدفع: نقدًا. الطلب محفوظ على هذا الجهاز فقط ولا يصل للمتجر حاليًا.</p>
            <strong class="checkout-success-order"></strong>
            <button class="primary-btn checkout-success-close" type="button">متابعة التسوق</button>`;
        dialog.append(successPanel);
        document.body.append(dialog);
        dialog.querySelector(".checkout-close").addEventListener("click", () => dialog.close());
        successPanel.querySelector(".checkout-success-close").addEventListener("click", () => dialog.close());
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) dialog.close();
        });
        dialog.querySelector(".checkout-form").addEventListener("submit", async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const submitButton = form.querySelector(".checkout-submit");
            const errorElement = form.querySelector(".checkout-error");
            const formData = new FormData(form);
            submitButton.disabled = true;
            errorElement.hidden = true;

            try {
                await persistCartNow();
                const orderItems = Object.entries(cart).map(([id, quantity]) => {
                    const product = products.find((item) => item.id === Number(id));
                    if (!product) {
                        throw new Error("أحد المنتجات لم يعد متاحًا.");
                    }
                    if (quantity > product.stock) {
                        throw new Error(`الكمية المطلوبة من "${product.name}" غير متوفرة.`);
                    }
                    return {
                        product_id: product.id,
                        product_name: product.name,
                        unit_price: product.price,
                        quantity,
                        line_total: Math.round(product.price * quantity * 100) / 100
                    };
                });
                const orderId = `ES-${Date.now().toString(16).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
                const order = {
                    id: orderId,
                    customer_name: String(formData.get("customer_name")).trim(),
                    customer_phone: String(formData.get("customer_phone")).trim(),
                    payment_method: String(formData.get("payment_method")),
                    items: orderItems,
                    total: orderItems.reduce((sum, item) => sum + item.line_total, 0),
                    created_at: new Date().toISOString(),
                    status: "pending_confirmation"
                };
                saveLocalOrder(order);

                for (const item of orderItems) {
                    const product = products.find((entry) => entry.id === item.product_id);
                    product.stock -= item.quantity;
                }
                try {
                    persistInventory();
                } catch (error) {
                    console.error("Could not save product stock in this browser.", error);
                }
                cart = {};
                updateCart();
                persistCartNow().catch((error) => {
                    console.error("Could not clear the locally saved cart after checkout.", error);
                });
                form.reset();
                form.hidden = true;
                successPanel.querySelector(".checkout-success-order").textContent = `رقم الطلب: ${orderId}`;
                successPanel.hidden = false;
                successPanel.querySelector(".checkout-success-close").focus();
            } catch (error) {
                console.error("Could not submit the order.", error);
                errorElement.textContent = error.message;
                errorElement.hidden = false;
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    const checkoutForm = dialog.querySelector(".checkout-form");
    const successPanel = dialog.querySelector(".checkout-success");
    checkoutForm.hidden = false;
    successPanel.hidden = true;
    checkoutForm.querySelector(".checkout-error").hidden = true;
    dialog.showModal();
    dialog.querySelector("#checkout-name").focus();
}

function mountMobileBottomNav() {
    if (document.querySelector(".mobile-bottom-nav")) return;

    const nav = document.createElement("nav");
    nav.className = "mobile-bottom-nav";
    nav.setAttribute("aria-label", "التنقل السريع");

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const links = [
        { href: "index.html", label: "الرئيسية", icon: "fa-house" },
        { href: "categories.html", label: "الأقسام", icon: "fa-layer-group" },
        { href: "products.html", label: "المنتجات", icon: "fa-shirt" }
    ];

    for (const item of links) {
        const link = document.createElement("a");
        link.className = "mobile-bottom-nav-link";
        link.href = item.href;
        link.innerHTML = `<i class="fa-solid ${item.icon}" aria-hidden="true"></i><span>${item.label}</span>`;
        if (currentPage === item.href) link.setAttribute("aria-current", "page");
        nav.append(link);
    }

    const cartButton = document.createElement("button");
    cartButton.className = "mobile-bottom-nav-link mobile-bottom-nav-cart cart-trigger";
    cartButton.type = "button";
    cartButton.setAttribute("aria-label", "فتح سلة التسوق");
    cartButton.setAttribute("aria-expanded", "false");
    cartButton.innerHTML = `
        <span class="mobile-bottom-nav-cart-icon">
            <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
            <span class="mobile-bottom-nav-count" hidden></span>
        </span>
        <span>السلة</span>`;
    cartButton.addEventListener("click", () => openCart(cartButton));
    nav.append(cartButton);
    document.body.append(nav);
}

document.addEventListener("keydown", (event) => {
    const drawer = document.getElementById("cart-drawer");
    if (event.key === "Escape") {
        closePanels();
        return;
    }
    if (event.key !== "Tab" || !drawer?.classList.contains("open")) return;

    const focusable = [...drawer.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hidden);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
    }
});

mountMobileBottomNav();
applyTheme(document.documentElement.dataset.theme || "light");
productsReady.then(() => {
    for (const id of Object.keys(cart)) {
        if (!products.some((product) => product.id === Number(id))) {
            delete cart[id];
        }
    }
    renderProducts();
    updateCart();
}).catch((error) => {
    console.error("Could not initialize the local product catalog.", error);
    const container = document.getElementById("products-container");
    if (container) {
        container.textContent = "تعذر تحميل كتالوج المنتجات. أعد تحميل الصفحة أو راجع Console.";
    }
    showToast("تعذر تحميل المنتجات.");
});
