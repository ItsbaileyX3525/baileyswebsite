const pathElement: HTMLElement | null = document.getElementById('path')
const currentDir: HTMLElement | null = document.getElementById('currentDir')
const consoleContents: HTMLElement | null = document.getElementById('consoleContents')

//Holy shit this finna be confusing but idk a better way.

//Correction, looks confusing but once you understand it, nah

//Key: path
//Object: Array [Text display, onclick code]

const pathToElements: Record<string, [string, string | (() => void)][]> = {
    "./" : [
        [
            "Downloads/", () => {changeDir('Downloads')}
        ],
        [
            "Images/", () => {changeDir('Images')}
        ],
        [
            "Videos/", () => {changeDir('Videos')}
        ],
        [
            "AboutMe.txt", () => {changeConsole('<data class="text-center"><p>Since I was quite young I have enjoyed coding. One of the first times I started coding was in 2018 when I was messing around with roblox and found a "game" called Roblox Studio, on there I would build very simple games and have a blast doing so, I even posted some <a class="text-[#ff8c69]" href="https://www.youtube.com/watch?v=lltJLW97GLY" target="_blank">videos</a> of it on my youtube channel!</p><br><p>This, however, was short-lived due to the fact that my mind just couldn\'t comprend the immesive coding and I just gave up, but that isn\'t where the story ends, no no no. About 4 years later I got kicked out of my school, <a class="text-[#ff8c69]" href="https://www.youtube.com/watch?v=VSsVM776Xes" target="_blank">this is the background music to the song</a> (for legal reaons I can\'t link the real song.) Anyways, went I went to the local PRU one of the teachers that specialised in coding (he wasn\'t really the best lol) but he let us go on scratch and create a <a class="text-[#ff8c69]" href="https://scratch.mit.edu/projects/678586533/" target="_blank">simple game</a> and eventually it evolved into a big school project that I worked on during breaks, I had loads of fun creating it. It was not a good game however, like it was terrible.</p><br><p>After creating that scratch game I kind of went silent again in the coding aspect as I got bored of scratch as it was very limited. After getting back into mainstream schools I picked my subjects (I was in year 10 at this point) and computer scienece was one of them, in one of our lessons our teacher taught us about "Python" and during that lesson is when I fell in love with coding. After the lesson it was break so I asked if I could stay behind to learn about python on the computers some more and she said yes (Thank god otherwise I would not have ever done coding I can say that with 100% certainty) and I learned about "Ursina" game engine and started creating "Nextbots".</p><br><p>After that I would work on games and my chatroom website (99% AI so I do not want to call it mine at all really) until I graduated secondary school and went to college. At this point I had been coding daily for 2 years and college is when I got serious learning about brainfuck, C, C#, Java, Javascript, CSS, HTML and much more! Pumping out loads of games and loads of websites. Which is where I am at currently, on summer break making a website ready for year 2 as it focuses on website creation!</p><br><p>Thank you for reading this all and make sure to check out ./Videos/FurnessCollege.webm to see a promotional video about my college!</p></data>')}
        ],
        [
            "README.md", () => {changeConsole('<h1 id="hi-i-m-bailey-">Hi, I&#39;m Bailey!</h1><p>I enjoy coding, playing games and various other things! I code in many languages but the one I use the most is python and JS.</p><h2 id="languages-i-know">Languages I know</h2><p><a href="https://skillicons.dev"><img src="https://skillicons.dev/icons?i=py,cs,js,ts,html,tailwind,vite,lua,rust" alt="My Skills"></a></p><p>While I am more profcient in python and JS, I still can code at near the same level as all the other languages listed above (perhaps not rust as of now because I haven&#39;t had too much experience), most of the times I use python for creating short prototypes or quick applications and javascript for websites... Obviously. The main language I use now is gdscript which is used for godot and is it like python and C#.</p><h1 id="studios-i-use">Studios I use</h1><p><a href="https://skillicons.dev"><img src="https://skillicons.dev/icons?i=androidstudio,vscode,godot" alt="My Skills"></a></p><p>I haven&#39;t used android studio in a long time but the other two studios I use almost every day from creating games with godot to writing simple python files in vscode. I enjoy godot for its simple use and its very easy learning curve that is has and I love vscode because it is very customisable even if it is just a glorifed text editor. I have dabbled in other studios but these are the main 3 that I use.</p>', true)}
        ]
    ],
    "./Downloads" : [
        ["Maxwell.png", () => {changeConsole("<p>Maxwell.png</p><img src='/assets/portfolio/Maxwell.jpg'>", true)}],
        ["Placeholder.png", () => {changeConsole("<p>File not found.png</p><img class='max-h-1/2' src='/assets/portfolio/missing.jpg'><p>Get it?</p>", true)}],
        ["Nuclear launch codes.txt", () => {changeConsole("<p class='text-center'>You will never get the nuclear launch codes!</p>")}]
    ],
    "./Images" : [
        ["Bailey fun.png", () => {changeConsole("<p>Bailey fun.png</p><img class='max-h-1/2' src='/assets/portfolio/Blil fears for his life.jpg'><p>I think Phil in the seat behind me wants me dead...</p>", true)}],
        ["Salt.png", () => {changeConsole("<p>Salt.png</p><img class='max-h-1/2' src='/assets/portfolio/Salt.jpg'>", true)}]
    ],
    "./Videos" : [
        ["FurnessCollege.webm", () => {changeConsole('<p>FurnessCollege.webm</p><video src="/assets/portfolio/FurnessCollege.webm" controls>', true)}],
    ]
}

function removeConsoleContents(): void {
    if (!consoleContents){
        return;
    }

    var items: Element[] = Array.from(consoleContents.children)
    for (let item of items){
        item.remove()
    }
}

function appendConsoleContents(items: string, useFlexCol: boolean): void{
    if (!consoleContents){
        return;
    }

    if (useFlexCol){
        if (!consoleContents.classList.contains('flex-col')){
            consoleContents.classList.remove("justify-start")
            consoleContents.classList.add("justify-center")
            consoleContents.classList.add("flex-col")
        }
    }
    else{
        if (consoleContents.classList.contains('flex-col')){
            consoleContents.classList.add("justify-start")
            consoleContents.classList.remove("justify-center")
            consoleContents.classList.remove('flex-col')
        }
    }
    consoleContents.innerHTML += items
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
        spanChild.classList.add("pl-12", "mt-3", "text-3xl")
        spanChild.appendChild(pChild)
        currentDir.appendChild(spanChild)
    })
}

function changeDir(path: String, shouldReturn: Boolean = false): void {
    if (!pathElement){
        return
    }
    
    let currentPath: string = pathElement.innerText

    if (shouldReturn){
        if (currentPath.trim() !== "./"){
            removeDirContents()
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
        //Means we are at root
        //changeConsole('<img class="h-[35%]" src="/assets/portfolio/Arch.png"><div class="flex-col"><p class="text-[#0dcdcd]">baile@baile</p><p>- - - - - -</p><p><data class="text-[#0dcdcd]">OS</data>: Arch Linux x86_64</p><p><data class="text-[rgb(13,205,205)]">HOST</data>: B760 Pro RS/D4</p><p><data class="text-[rgb(13,205,205)]">KRNL</data>: Linux 6.15.7-arch1-1</p><p><data class="text-[#0dcdcd]">CPU</data>: i5-12400F (12) @ 5.60 GHz</p><p><data class="text-[#0dcdcd]">GPU</data>: NVIDIA GeForce RTX 3060</p><p><data class="text-[#0dcdcd]">Disk</data>: (/): 916 GiB</p><p><data class="text-[#0dcdcd]">Disk</data>: (/mnt/games): 3.1 TiB</p><p><data class="text-[#0dcdcd]">Memory</data>: 31.06 GiB</p></div>')
        return;
    }
    removeDirContents()
    let newPath: string = currentPath + "" + path
    pathElement.innerText = newPath
    appendDirContents(newPath)

    return;
}

function changeConsole(item: string, useFlexCol: boolean = false): void {
    removeConsoleContents()

    appendConsoleContents(item, useFlexCol)
}

document.addEventListener("DOMContentLoaded", () => {
    changeDir("", false)
});

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