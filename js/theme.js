function applyTheme(theme, persist = false) {
    const selectedTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = selectedTheme;

    const nextThemeLabel = selectedTheme === "dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي";
    document.querySelectorAll(".theme-toggle").forEach((button) => {
        button.setAttribute("aria-label", nextThemeLabel);
        button.setAttribute("title", nextThemeLabel);
        button.setAttribute("aria-pressed", String(selectedTheme === "dark"));
    });

    document.querySelector('meta[name="theme-color"]')?.setAttribute(
        "content",
        selectedTheme === "dark" ? "#121b18" : "#f5f4ef"
    );

    if (persist) {
        try {
            localStorage.setItem("el-salam-theme", selectedTheme);
        } catch (error) {
            console.error("Could not save the selected theme.", error);
            showToast("تعذر حفظ اختيار المظهر في هذا المتصفح.");
        }
    }
}

function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme, true);
}
