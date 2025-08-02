function toggleReveal(el: HTMLElement, arr: HTMLElement): void {
    if (el && arr){
        if (el.classList.contains('max-h-0')) {
            el.classList.remove('max-h-0');
            el.classList.add('max-h-40');
            arr.innerText = "↑"
        } else {
            el.classList.remove('max-h-40');
            el.classList.add('max-h-0');
            arr.innerText = "↓"
        }
    }
}

(window as any).toggleReveal = toggleReveal;