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

for (const e of document.querySelectorAll('img')) {
	e.addEventListener('error', function(event) {
		const target = event.target as HTMLImageElement;
		target.src = 'NoImage.jpg';
		target.onerror = null;
	});

	if (e.complete && e.naturalWidth === 0) {
		e.dispatchEvent(new Event('error'));
	}
}

(window as any).toggleReveal = toggleReveal;