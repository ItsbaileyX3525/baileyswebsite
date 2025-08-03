const pathElement: HTMLElement | null = document.getElementById('path')
const currentDir: HTMLElement | null = document.getElementById('currentDir')

//Holy shit this finna be confusing but idk a better way.

//Key: path
//Object: Array [Text display, onclick code]

const pathToElements: Record<string, [string, string | (() => void)][]> = {
    "./" : [
        [
            "Downloads/", () => {changeDir('Downloads')}
        ],
        [
            "Images/", ""
        ],
        [
            "AboutMe.txt", ""
        ],
        [
            "README.md", ""
        ]
    ],
    "./Downloads" : [
        ["Maxwell.png", ""],
        ["Placeholder.png", ""],
    ]
}

function removeDirContents(): void {
    if (!currentDir){
        return
    }

    var items: Element[] = Array.from(currentDir.children)
    for (let item of items){
        item.remove()
    }
}

function appendDirContents(newPath: string): void {
    if (!currentDir){
        return
    }

    var itemsToAdd = pathToElements[newPath]

    itemsToAdd.forEach(function (item){
        var pChild: HTMLParagraphElement = document.createElement('p')
        pChild.classList.add('cursor-pointer')
        pChild.innerText = item[0]
        pChild.onclick = function() {
            const command = item[1];
            if (typeof command === "function") {
                command();
            }
        }
        var spanChild: HTMLSpanElement = document.createElement('span')
        spanChild.classList.add("pl-12", "mt-3", "text-4xl")
        spanChild.appendChild(pChild)
        currentDir.appendChild(spanChild)
    })
}

function changeDir(path: String, shouldReturn: Boolean = false): void {
    if (!pathElement){
        return
    }
    
    let currentPath: string = pathElement.innerText

    removeDirContents()

    if (shouldReturn){
        if (currentPath !== "./"){
            let parts = currentPath.split("/").filter(Boolean) //Ngl love truthy falsy
            let pathSplit = parts.map((part, i) => i < parts.length - 1 ? part + "/" : part);
            let newPath: string = ""
            pathSplit.pop()
            pathSplit.forEach(function (item: string) {
                newPath += item
            })
            pathElement.innerText = newPath

            appendDirContents(newPath)

        }
        return;
    }

    let newPath: string = currentPath + "" + path
    pathElement.innerText = newPath
    appendDirContents(newPath)

    return;
}

(window as any).changeDir = changeDir;

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