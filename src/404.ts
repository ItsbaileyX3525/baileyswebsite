let pageValid: boolean = false

const validFilePath: string[] = [
    "/",
    "/flikhost",
    "/game",
    "/stats",
    "/404"
]

function checkValid() {
    for (let e of validFilePath){
        if (window.location.pathname == e){
            pageValid = true
        } 
    }

    if (window.location.pathname == "/portfolio") {//This shouldn't really happen ever...
        window.location.href = "/portfolio.html"
        return
    }

    if (window.location.pathname == "/portfolio.html") {//This should NEVER happen
        window.location.reload()
        return
    }

    if (!pageValid) {
        localStorage.setItem("404", "/404")
        window.location.href = "/"
    } else {
        if (!localStorage.getItem("404")) {
            localStorage.setItem("404", window.location.pathname)
        }
        window.location.href = "/"
    }
}

checkValid()