document.addEventListener("DOMContentLoaded", () => {
    if (document.compatMode == "BackCompat") {
        localStorage.setItem("404", window.location.pathname)
        window.location.href = "/404"
    }
})