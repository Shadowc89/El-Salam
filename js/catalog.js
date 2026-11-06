const productsContainer = document.getElementById("products-container");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const requestedCategory = new URLSearchParams(window.location.search).get("category");
const validCategories = ["all", "men", "women", "kids", "sport", "sale"];

if (validCategories.includes(requestedCategory)) {
    currentCategory = requestedCategory;
}

if (productsContainer) {
    document.querySelectorAll(".filter-btn").forEach((button) => {
        button.classList.toggle("active", button.dataset.category === currentCategory);
    });
}

function formatPrice(value) {
    return `${value.toLocaleString("ar-EG")} جنيه`;
}

function discountPercent(product) {
    if (!product.old) return 0;
    return Math.round((1 - product.price / product.old) * 100);
}

function getVisibleProducts() {
    const query = searchInput.value.trim().toLocaleLowerCase("ar");
    let result = products.filter((product) => {
        const matchesCategory =
            currentCategory === "all" ||
            (currentCategory === "sale" ? Boolean(product.old) : product.cat === currentCategory);
        const matchesQuery = !query || product.name.toLocaleLowerCase("ar").includes(query);
        return matchesCategory && matchesQuery;
    });

    switch (sortSelect.value) {
        case "low":
            result.sort((a, b) => a.price - b.price);
            break;
        case "high":
            result.sort((a, b) => b.price - a.price);
            break;
        case "name":
            result.sort((a, b) => a.name.localeCompare(b.name, "ar"));
            break;
    }
    return result;
}

function renderProducts() {
    if (!productsContainer || !searchInput || !sortSelect) return;
    const visibleProducts = getVisibleProducts();
    document.getElementById("results-count").textContent =
        `${visibleProducts.length.toLocaleString("ar-EG")} من ${products.length.toLocaleString("ar-EG")} منتج`;

    if (!visibleProducts.length) {
        productsContainer.innerHTML = `
          <div class="empty-state">
            <strong>مش لاقيين المنتج ده</strong>
            <span>جرّب كلمة بحث مختلفة أو اختار قسم تاني.</span>
          </div>`;
        return;
    }

    productsContainer.innerHTML = visibleProducts.map((product) => `
        <article class="product-card">
          <div class="product-image">
            <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
            ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ""}
            <button class="quick-add" type="button" onclick="addToCart(${product.id}, this)">أضف إلى السلة <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i></button>
          </div>
          <div class="product-info">
            <div class="product-category">${categoryNames[product.cat] || "COLLECTION"}</div>
            <h3>${escapeHTML(product.name)}</h3>
            <div class="price-row">
              <span class="price-now">${formatPrice(product.price)}</span>
              ${product.old ? `<span class="price-old">${product.old.toLocaleString("ar-EG")}</span><span class="price-discount">خصم ${discountPercent(product)}%</span>` : ""}
            </div>
            <div class="product-actions">
              <button class="mobile-add" type="button" onclick="addToCart(${product.id}, this)">أضف للسلة <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i></button>
              <button class="product-details-btn" type="button" aria-label="تفاصيل ${escapeHTML(product.name)}"
                  title="تفاصيل المنتج" aria-haspopup="dialog"
                  onclick="showProductDetails(${product.id}, this)">
                التفاصيل <i class="fa-regular fa-eye" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </article>
      `).join("");
}

function setCategory(category) {
    currentCategory = category;
    document.querySelectorAll(".filter-btn").forEach((button) => {
        button.classList.toggle("active", button.dataset.category === category);
    });
    searchInput.value = "";
    renderProducts();
}

function searchProducts() {
    renderProducts();
}

function sortProducts() {
    renderProducts();
}
