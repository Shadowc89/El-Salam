let productDetailsTrigger = null;

function createProductDetailsDialog() {
    const dialog = document.createElement("dialog");
    dialog.className = "product-details-dialog";
    dialog.setAttribute("aria-labelledby", "product-details-title");
    dialog.innerHTML = `
        <div class="product-details-header">
            <span class="product-details-kicker">EL SALAM / DETAILS</span>
            <button class="product-details-close" type="button" aria-label="إغلاق التفاصيل">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
        </div>
        <div class="product-details-body">
            <img class="product-details-image" alt="">
            <div class="product-details-copy">
                <span class="product-details-category"></span>
                <h2 id="product-details-title"></h2>
                <strong class="product-details-price"></strong>
                <div class="product-details-stats">
                    <div class="product-details-stat">
                        <i class="fa-solid fa-boxes-stacked" aria-hidden="true"></i>
                        <span>القطع المتاحة</span>
                        <strong class="product-details-stock"></strong>
                    </div>
                    <div class="product-details-stat">
                        <i class="fa-solid fa-palette" aria-hidden="true"></i>
                        <span>الألوان</span>
                        <strong class="product-details-color-count"></strong>
                    </div>
                </div>
                <section class="product-details-colors" aria-labelledby="product-details-colors-title">
                    <h3 id="product-details-colors-title">الألوان المتاحة</h3>
                    <div class="product-details-swatches"></div>
                </section>
                <section class="product-size-guide">
                    <button class="product-size-guide-toggle" type="button" aria-expanded="false"
                        aria-controls="product-size-guide-panel">
                        <i class="fa-solid fa-ruler" aria-hidden="true"></i>
                        <span>دليل المقاسات</span>
                        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
                    </button>
                    <div class="product-size-guide-panel" id="product-size-guide-panel" hidden>
                        <p class="product-size-guide-note"></p>
                        <div class="product-size-guide-sizes" role="list" aria-label="المقاسات المتاحة"></div>
                    </div>
                </section>
            </div>
        </div>`;

    dialog.querySelector(".product-details-close").addEventListener("click", closeProductDetails);
    dialog.querySelector(".product-size-guide-toggle").addEventListener("click", (event) => {
        const button = event.currentTarget;
        const panel = dialog.querySelector(".product-size-guide-panel");
        const isExpanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isExpanded));
        panel.hidden = isExpanded;
    });
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeProductDetails();
    });
    dialog.addEventListener("close", () => {
        if (productDetailsTrigger?.isConnected) productDetailsTrigger.focus();
        productDetailsTrigger = null;
    });

    document.body.append(dialog);
    return dialog;
}

function showProductDetails(productId, trigger) {
    const product = products.find((item) => item.id === Number(productId));
    if (!product) {
        showToast("تعذر العثور على تفاصيل المنتج.");
        return;
    }

    let dialog = document.querySelector(".product-details-dialog");
    if (!dialog) dialog = createProductDetailsDialog();

    productDetailsTrigger = trigger instanceof HTMLElement ? trigger : null;
    dialog.querySelector(".product-details-image").src = product.image.trim();
    dialog.querySelector(".product-details-image").alt = product.name;
    dialog.querySelector(".product-details-category").textContent = categoryNames[product.cat] || "EL SALAM";
    dialog.querySelector("#product-details-title").textContent = product.name;
    dialog.querySelector(".product-details-price").textContent = formatPrice(product.price);

    const sizeGuide = getProductSizeGuide(product);
    const sizeGuideButton = dialog.querySelector(".product-size-guide-toggle");
    const sizeGuidePanel = dialog.querySelector(".product-size-guide-panel");
    const sizeGuideSizes = dialog.querySelector(".product-size-guide-sizes");
    sizeGuideButton.setAttribute("aria-expanded", "false");
    sizeGuidePanel.hidden = true;
    dialog.querySelector(".product-size-guide-note").textContent = sizeGuide.note;
    sizeGuideSizes.replaceChildren();

    for (const size of sizeGuide.sizes) {
        const sizeLabel = document.createElement("span");
        sizeLabel.className = "product-size-guide-size";
        sizeLabel.setAttribute("role", "listitem");
        sizeLabel.textContent = size;
        sizeGuideSizes.append(sizeLabel);
    }

    const stock = Number.isInteger(product.stock) && product.stock >= 0 ? product.stock : null;
    const stockLabel = stock === null
        ? "غير محدد"
        : stock === 0
            ? "نفدت الكمية"
            : `${stock.toLocaleString("ar-EG")} ${stock === 1 || stock > 10 ? "قطعة" : stock === 2 ? "قطعتان" : "قطع"
            }`;
    dialog.querySelector(".product-details-stock").textContent = stockLabel;

    const colors = Array.isArray(product.colors) ? product.colors : [];
    dialog.querySelector(".product-details-color-count").textContent = colors.length.toLocaleString("ar-EG");
    const swatches = dialog.querySelector(".product-details-swatches");
    swatches.replaceChildren();

    for (const color of colors) {
        const option = document.createElement("span");
        option.className = "product-details-color";
        option.title = color.name;

        const swatch = document.createElement("span");
        swatch.className = "product-details-swatch";
        swatch.style.backgroundColor = color.value;
        swatch.setAttribute("aria-hidden", "true");

        const label = document.createElement("span");
        label.textContent = color.name;
        option.append(swatch, label);
        swatches.append(option);
    }

    dialog.showModal();
}

function getProductSizeGuide(product) {
    const sizes = Array.isArray(product.sizes)
        ? [...new Set(product.sizes.map((size) => String(size).trim()).filter(Boolean))]
        : [];

    return {
        sizes,
        note: sizes.length
            ? "المقاسات المسجلة لهذا المنتج."
            : "لم تُحدد مقاسات لهذا المنتج بعد."
    };
}

function closeProductDetails() {
    const dialog = document.querySelector(".product-details-dialog");
    if (dialog?.open) dialog.close();
}
