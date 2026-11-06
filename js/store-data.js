const products = [
    {
        id: 1,
        name: "قميص كلاسيكي أبيض",
        price: 350,
        old: 480,
        cat: "men",
        badge: "جديد",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=85",
        stock: 12,
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { name: "أبيض", value: "#f5f2eb" },
            { name: "أسود", value: "#292929" },
            { name: "أزرق سماوي", value: "#91b5d1" }
        ]
    },
    {
        id: 2,
        name: "فستان سهرة أنيق",
        price: 780,
        old: 1100,
        cat: "women",
        badge: "الأكثر مبيعًا",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85",
        stock: 7,
        sizes: ["S", "L", "XL"],
        colors: [
            { name: "أسود", value: "#29252a" },
            { name: "نبيتي", value: "#743a4b" },
            { name: "زيتي", value: "#65705b" }
        ]
    },
    {
        id: 3,
        name: "بنطلون جينز أزرق",
        price: 450,
        old: null,
        cat: "men",
        badge: null,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=85",
        stock: 15,
        sizes: ["30", "32", "34", "36"],
        colors: [
            { name: "أزرق", value: "#405d83" },
            { name: "أسود", value: "#292929" },
            { name: "رمادي", value: "#858585" }
        ]
    },
    {
        id: 4,
        name: "حذاء رياضي مريح",
        price: 590,
        old: 800,
        cat: "sport",
        badge: "تخفيض",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
        stock: 9,
        sizes: ["40", "41", "42", "43"],
        colors: [
            { name: "أحمر", value: "#c6413d" },
            { name: "أبيض", value: "#f5f2eb" },
            { name: "أسود", value: "#292929" }
        ]
    },
    {
        id: 5,
        name: "بلوزة كاجوال ملونة",
        price: 260,
        old: null,
        cat: "women",
        badge: null,
        image: "https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=700&q=85",
        stock: 11,
        sizes: ["S", "M", "L"],
        colors: [
            { name: "وردي", value: "#d9a2a4" },
            { name: "أبيض", value: "#f5f2eb" },
            { name: "أزرق", value: "#6d8da9" }
        ]
    },
    {
        id: 6,
        name: "بدلة أطفال كاملة",
        price: 370,
        old: 520,
        cat: "kids",
        badge: "تخفيض",
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=85",
        stock: 8,
        sizes: ["2Y", "4Y", "6Y"],
        colors: [
            { name: "أزرق", value: "#7293b8" },
            { name: "بيج", value: "#c6aa87" },
            { name: "رمادي", value: "#8a8a88" }
        ]
    },
    {
        id: 7,
        name: "جاكيت شتوي دافئ",
        price: 980,
        old: 1400,
        cat: "men",
        badge: "تخفيض",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85",
        stock: 5,
        sizes: ["M", "L", "XL"],
        colors: [
            { name: "بني", value: "#76533f" },
            { name: "أسود", value: "#292929" },
            { name: "زيتي", value: "#59624c" }
        ]
    },
    {
        id: 8,
        name: "عباءة رسمية راقية",
        price: 690,
        old: null,
        cat: "women",
        badge: "جديد",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=85",
        stock: 6,
        sizes: ["L", "XL"],
        colors: [
            { name: "أسود", value: "#292929" },
            { name: "كحلي", value: "#303b55" },
            { name: "بني", value: "#76533f" }
        ]
    },
    {
        id: 9,
        name: "تيشيرت رياضي خفيف",
        price: 215,
        old: 320,
        cat: "sport",
        badge: "تخفيض",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
        stock: 18,
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { name: "أبيض", value: "#f5f2eb" },
            { name: "أسود", value: "#292929" },
            { name: "أحمر", value: "#c6413d" }
        ]
    },
    {
        id: 10,
        name: "تيشيرت أطفال كاجوال",
        price: 275,
        old: null,
        cat: "kids",
        badge: "جديد",
        image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=700&q=85",
        stock: 10,
        sizes: ["4Y", "6Y", "8Y"],
        colors: [
            { name: "أحمر", value: "#c6413d" },
            { name: "أزرق", value: "#405d83" },
            { name: "أبيض", value: "#f5f2eb" }
        ]
    },
    {
        id: 11,
        name: "كنزة صوفية رجالية",
        price: 530,
        old: 630,
        cat: "men",
        badge: null,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85",
        stock: 8,
        sizes: ["M", "XL"],
        colors: [
            { name: "رمادي", value: "#858585" },
            { name: "كحلي", value: "#303b55" },
            { name: "بيج", value: "#c6aa87" }
        ]
    },
    {
        id: 12,
        name: "تنورة قصيرة عصرية",
        price: 345,
        old: 430,
        cat: "women",
        badge: "تخفيض",
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=700&q=85",
        stock: 9,
        sizes: ["S", "L"],
        colors: [
            { name: "أسود", value: "#292929" },
            { name: "بني", value: "#76533f" },
            { name: "بيج", value: "#c6aa87" }
        ]
    }
];

const categoryNames = {
    men: "رجالي",
    women: "نسائي",
    kids: "أطفال",
    sport: "رياضي",
};

let currentCategory = "all";
let cart = {};
let toastTimer;
let lastPanelTrigger = null;
let cartSaveTimer;
const addButtonTimers = new WeakMap();
const cartStorageKey = "elegance-cart";
const inventoryStorageKey = "el-salam-inventory";
const ordersStorageKey = "el-salam-orders";

window.addEventListener("error", (event) => {
    console.error("[EL SALAM] JavaScript or resource error.", event.error || {
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno
    });
});

window.addEventListener("unhandledrejection", (event) => {
    console.error("[EL SALAM] Unhandled promise rejection.", event.reason);
});

function readLocalData(key, fallback, validate) {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue === null) return fallback;
        const parsedValue = JSON.parse(storedValue);
        if (validate(parsedValue)) return parsedValue;
        console.error(`Ignoring invalid local data for "${key}".`);
    } catch (error) {
        console.error(`Could not read local data for "${key}".`, error);
    }
    return fallback;
}

const savedInventory = readLocalData(
    inventoryStorageKey,
    {},
    (value) => value !== null && typeof value === "object" && !Array.isArray(value)
);
for (const product of products) {
    const savedStock = Number(savedInventory[product.id]);
    if (Number.isInteger(savedStock) && savedStock >= 0) {
        product.stock = savedStock;
    }
}

const savedCart = readLocalData(
    cartStorageKey,
    {},
    (value) => value !== null && typeof value === "object" && !Array.isArray(value)
);
cart = Object.fromEntries(Object.entries(savedCart).flatMap(([id, quantity]) => {
    const product = products.find((entry) => entry.id === Number(id));
    if (!product || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) return [];
    const availableQuantity = Math.min(Number(quantity), product.stock);
    return availableQuantity > 0 ? [[product.id, availableQuantity]] : [];
}));

const productsReady = Promise.resolve(products);

function persistCartNow() {
    clearTimeout(cartSaveTimer);
    try {
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
        return Promise.resolve();
    } catch (error) {
        console.error("Could not save the cart in this browser.", error);
        return Promise.reject(new Error("تعذر حفظ السلة في هذا المتصفح."));
    }
}

function scheduleCartSave() {
    clearTimeout(cartSaveTimer);
    cartSaveTimer = setTimeout(() => {
        persistCartNow().catch((error) => {
            showToast(error.message);
        });
    }, 180);
}

function persistInventory() {
    const inventory = Object.fromEntries(products.map((product) => [product.id, product.stock]));
    localStorage.setItem(inventoryStorageKey, JSON.stringify(inventory));
}

function saveLocalOrder(order) {
    const orders = readLocalData(
        ordersStorageKey,
        [],
        (value) => Array.isArray(value)
    );
    orders.push(order);
    localStorage.setItem(ordersStorageKey, JSON.stringify(orders));
}

window.addEventListener("pagehide", () => {
    persistCartNow().catch(() => { });
});

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}
