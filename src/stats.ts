let interval1: ReturnType<typeof setInterval>;
let interval2: ReturnType<typeof setInterval>;
let interval3: ReturnType<typeof setInterval>;
let interval4: ReturnType<typeof setInterval>;
let interval5: ReturnType<typeof setInterval>;
let interval6: ReturnType<typeof setInterval>;
let interval7: ReturnType<typeof setInterval>;
let interval8: ReturnType<typeof setInterval>;

let canExpose: boolean = true
let areAllExposed: boolean = false

const epochYear: number = 31536000;
const epochMonth: number = 2629743;
const epochDay: number = 86400;
const epochHour: number = 3600;
const epochMinute: number = 60;
const birthdayEpoch: number = 1203379200;
const aliveEpoch: number = 1298073600;
const codingEpoch: number = 1663059600;
const websiteEpoch: number = 1753624800;

let frames: number = 0

let visitors: string = "0"

let latestGamePlayed: string | null = null;
let latestGameTime: number;
let latestGameIcon: string;
let latestGameID: string;

let steamUsername: string | null = null;
let steamPfp: string;
let steamCreated: number;
let steamLastOnline: number;

let currentComment: string | null = null;
let currentCommentAuthor: string | null = null;

let steamAPIKey: string = "1D1BB7F908BA094BE964A0ED410E0017";

function checkBrowser(): string {

    let browser: string

    // @ts-ignore
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // @ts-ignore
    var isFirefox = typeof InstallTrigger !== 'undefined';
    // @ts-ignore
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
    // @ts-ignore
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // @ts-ignore
    var isEdge = !isIE && !!window.StyleMedia;
    // @ts-ignore
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    // @ts-ignore
    var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
    // @ts-ignore
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    if (isOpera) {
        browser = "Opera - Chinese spywere 👍"
    } else if (isFirefox) {
        browser = "Firefox - The best"
    } else if (isSafari) {
        browser = "Safari - EWWWWW"
    } else if (isIE) {
        browser = "Internet Explorer - Old ahh"
    } else if (isEdgeChromium) {
        browser = "Edge (Chromium)"
    } else if (isEdge) {
        browser = "Edge"
    } else if (isChrome) {
        browser = "Chrome - In the big 25..."
    } else if (isBlink) {
        browser = "Blink"
    } else {
        browser = "I have no idea..."
    }

    return browser;
}

function exposeStat(wrapper: string): void {
    const wrapperElement: HTMLElement | null = document.getElementById(wrapper)
    
    if (wrapperElement) {
        if (wrapperElement.classList.contains('hidden')){
            wrapperElement.classList.remove('hidden')
        } else {
            wrapperElement.classList.add('hidden')
        }
    }
}

function exposeAllStats(): void {
    if (canExpose) {
        canExpose = false
    }

    const app = document.getElementById('app')

    if (app) {
        const elements = app.querySelectorAll('div[data-wrapper]');
        elements.forEach(el => {
            if (areAllExposed) {
                el.classList.add('hidden');
            } else {
                el.classList.remove('hidden');
            }
        });
    }



    areAllExposed = !areAllExposed
    canExpose = true
}

function formatPlaytime(time: number): string {

	let hours = Math.floor(time / 60)
	let remainingMinutes = time % 60
	let minutes = Math.floor(remainingMinutes)
	let seconds = Math.round((remainingMinutes - minutes) * 60)

    let finalString: string = `${hours}hr ${minutes}m ${seconds}s`

    return finalString;
}

async function fetchSteamProfile(): Promise<void> {
    //TODO: Fetch steam stats and display
    const url = `https://corsproxy.io/?url=https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamAPIKey}&steamids=76561198352376830`
    
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response}`)
        }

        const result = await response.json()
        const player = result.response.players[0]

        steamUsername = player.personaname
        steamPfp = player.avatar
        steamCreated = player.timecreated
        steamLastOnline = player.lastlogoff

    } catch (error){
        console.log(error)
    }
}

async function fetchSteamStats(): Promise<void> {
    const url = `https://corsproxy.io/?url=https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${steamAPIKey}&steamid=76561198352376830&format=json`

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const result = await response.json()
        latestGamePlayed = result.response.games[0].name
        latestGameIcon = result.response.games[0].img_icon_url
        latestGameTime = result.response.games[0].playtime_forever
        latestGameID = result.response.games[0].appid

        latestGameIcon = `https://cdn.steamstatic.com/steamcommunity/public/images/apps/${latestGameID}/${latestGameIcon}.jpg`

    } catch (error) {
        console.log(error)
    }
}

async function fetchVisitors(): Promise<boolean> {
    try {
        const response = await fetch('https://api.flik.host/unique_site_visitiors.php?site=baileygamesand.codes');
        const data = await response.json();

        let unique_visitors: string = data.total_unique_visitors;

        visitors = unique_visitors

        return true

    } catch (error) {
        console.error(error);
        return false
    }
}

async function fetchWebsiteVersion(): Promise<string> {
    try {
        const res = await fetch("version.txt");
        const text = await res.text();
        return text;
    } catch (e) {
        console.log(e);
        return "Failed to retrieve version";
    }
}

async function fetchComment(): Promise<void> {
    const response = await fetch(`https://api.flik.host/single_comment.php?site=${encodeURIComponent("https://baileygamesand.codes")}`);
  
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    currentComment = data.comment
    currentCommentAuthor = data.author

    if (!data.success) {
        throw new Error(data.error || 'Failed to fetch comment');
    }
    
    return
}

async function saveComment(comment: string, author: string | null = 'Anon'): Promise<boolean> {
    const url = 'https://api.flik.host/single_comment.php'
    
    if (author === null) {
        author = "Anon"
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            site: "https://baileygamesand.codes",
            comment,
            author
        })
    });
    
    if (!response.ok) {
        return false
    }
    
    const data = await response.json();
    
    if (!data.success) {
        return false
    }
    
    return true
}

function formatBreaths(): string {
    let sinceBirth = Date.now() / 1000 - birthdayEpoch

    let takenBreaths = String(Math.floor(sinceBirth / 4.333))

    return takenBreaths
}

function updateFrames(frameStat: HTMLElement): void {
    frames ++;
    frameStat.innerText = String(frames) + " refreshes";
    requestAnimationFrame(() => updateFrames(frameStat));
}

function formatEpoch(toFormat: number): string {
    //Idk math this is prolly really unoptimised
    let epoch = Date.now() / 1000 - toFormat
    let yearsString: string = ""
    let monthString: string = ""
    let dayString: string = ""
    let hourString: string = ""
    let minuteString: string = ""
    let secondString: string = "0s"
    let years = Math.floor(epoch / epochYear)
    if (years) {
        yearsString = years + "yr "
        epoch -= years * epochYear
    }
    let months = Math.floor(epoch / epochMonth)
    if (months) {
        monthString = months + "mth "
        epoch -= epochMonth * months
    }
    let days = Math.floor(epoch / epochDay)
    if (days) {
        dayString = days + "d "
        epoch -= epochDay * days
    }
    let hours = Math.floor(epoch / epochHour)
    if (hours) {
        hourString = hours + "hr "
        epoch -= epochHour * hours
    }
    let minutes = Math.floor(epoch / epochMinute)
    if (minutes) {
        minuteString = minutes + "m "
        epoch -= epochMinute * minutes
    }
    let seconds = Math.floor(epoch / 1)
    if (seconds) {
        secondString = seconds + "s "
        epoch -= 1 * seconds
    }
    let finalString = yearsString + monthString + dayString + hourString + minuteString + secondString
    return finalString
}

export async function reloadReferencesStats(): Promise<void> {

    const livingStat = document.getElementById('living-stat') as HTMLElement | null;
    const aliveStat = document.getElementById('alive-stat') as HTMLElement | null;
    const codingStat = document.getElementById('coding-stat') as HTMLElement | null;
    const gameIcon = document.getElementById('game-icon') as HTMLImageElement | null;
    const gameNameStat = document.getElementById('recent-game') as HTMLElement | null;
    const gameTimeStat = document.getElementById('recent-game-time') as HTMLElement | null;
    const steamAgeStats = document.getElementById('steam-age') as HTMLElement | null;
    const steamIcon = document.getElementById('steam-icon') as HTMLImageElement | null;
    const steamNameStat = document.getElementById('steam-profile') as HTMLElement | null;
    const steamLastOnlineStat = document.getElementById('steam-last-online') as HTMLElement | null;
    const breathStat = document.getElementById('breaths-stat') as HTMLElement | null;
    const frameStat = document.getElementById('frame-stat') as HTMLElement | null;
    const visitorStat = document.getElementById('visitor-stat') as HTMLElement | null;
    const commentStat = document.getElementById('comment-stat') as HTMLElement | null;
    const submitComment = document.getElementById('submit-comment') as HTMLButtonElement | null;
    const username = document.getElementById('username') as HTMLInputElement | null;
    const comment = document.getElementById('comment') as HTMLTextAreaElement | null;
    const browserStat = document.getElementById('browser-stat') as HTMLElement | null;
    const OsStat = document.getElementById('OS-stat') as HTMLElement | null;
    const threadStat = document.getElementById('threads-stat') as HTMLElement | null;
    const connectionStat = document.getElementById('connection-stat') as HTMLElement | null;
    const websiteStat = document.getElementById('website-stat') as HTMLElement | null;
    const versionStat = document.getElementById('version-stat') as HTMLElement | null;

    clearInterval(interval1)
    clearInterval(interval2)
    clearInterval(interval3)
    clearInterval(interval4)
    clearInterval(interval5)
    clearInterval(interval6)
    clearInterval(interval7)
    clearInterval(interval8)

    // Time stat

    if (livingStat) {
        let newDate = formatEpoch(birthdayEpoch)
        livingStat.innerText = newDate
        interval1 = setInterval(() => {
            let newDate = formatEpoch(birthdayEpoch)
            livingStat.innerText = newDate
        }, 1000)

    }

    if (aliveStat) {
        let newDate = formatEpoch(aliveEpoch)
        aliveStat.innerText = newDate
        interval2 = setInterval(() => {
            let newDate = formatEpoch(aliveEpoch)
            aliveStat.innerText = newDate
        }, 1000)
    }

    if (codingStat) {
        let newDate = formatEpoch(codingEpoch)
        codingStat.innerText = newDate
        
        interval3 = setInterval(() => {
            let newDate = formatEpoch(codingEpoch)
            codingStat.innerText = newDate
        }, 1000)
    }

    if (websiteStat) {
        let newDate = formatEpoch(websiteEpoch)
        websiteStat.innerHTML = newDate
        interval8 = setInterval(() => {
            let newDate = formatEpoch(websiteEpoch)
            websiteStat.innerText = newDate
        }, 1000)
    }

    // Steam stat


    if (!latestGamePlayed) {
        await fetchSteamStats()
    }

    if (!steamUsername) {
        await fetchSteamProfile()
    }

    if (gameNameStat && latestGamePlayed) {
        gameNameStat.innerText = latestGamePlayed
    }

    if (gameTimeStat) {
        gameTimeStat.innerText = formatPlaytime(latestGameTime)
    }

    if (gameIcon) {
        gameIcon.src = latestGameIcon
    }

    if (steamAgeStats) {
        steamAgeStats.innerText = formatEpoch(steamCreated)
        interval4 = setInterval(() => {
            steamCreated -= 1.0/60.0
            steamAgeStats.innerText = formatEpoch(steamCreated)
        },1000)
    }

    if (steamIcon && steamNameStat && steamUsername) {
        steamIcon.src = steamPfp
        steamNameStat.innerText = steamUsername
    }

    if (steamLastOnlineStat) {
        steamLastOnlineStat.innerText = formatEpoch(steamLastOnline).replace("0yr 0mth", "") + " ago"
        interval5 = setInterval(() => {
            steamCreated -= 1.0/60.0
            steamLastOnlineStat.innerText = formatEpoch(steamLastOnline).replace("0yr 0mth", "") + " ago"
        },1000)
    }


    // Incremental stats


    if (breathStat) {
        breathStat.innerText = formatBreaths() + " Breaths taken"
        interval6 = setInterval(() => {
            breathStat.innerText = formatBreaths() + " Breaths taken"
        },4.333)
    }

    if (frameStat) {
        requestAnimationFrame(() => updateFrames(frameStat));
    }

    if (visitors === "0") {
        await fetchVisitors()
    }

    if (visitorStat) {
        visitorStat.innerText = visitors
    }

    if (versionStat) {
        let version = await fetchWebsiteVersion()
        versionStat.innerText = version
    }

    // Comment stat

    await fetchComment()

    if (commentStat) {
        commentStat.innerText = currentCommentAuthor + ": " + currentComment
        if (submitComment && username && comment) {
            submitComment.addEventListener('click', async () => {
                if (comment.value){
                    let parsedUsername = username.value ? username.value : "Anon"
                    let uploaded: boolean = await saveComment(comment.value, parsedUsername)
                    if (uploaded) {
                        commentStat.innerText = parsedUsername + ": " + comment.value
                    }
                }
                
            })
        }
    }

    // Personal stats

    if (browserStat) {
        browserStat.innerText = checkBrowser()
    }

    if (OsStat) {
        if (window.navigator.platform){ //Truthy should help with obsolete
            let Os = window.navigator.platform
            if (Os.includes("Linux")){
                Os = Os + " - Love to see it!"
            }
            OsStat.innerText = Os
            // @ts-ignore
        } else if (navigator.userAgentData.platform) { //Fallback to newer version if supported
            // @ts-ignore
            let Os =  navigator.userAgentData.platform + " - Love to see it!"
            // @ts-ignore
            OsStat.innerText = navigator.userAgentData.platform
        } else {
            OsStat.innerText = "Idk your browser ain't sayin much"
        }
    }

    if (threadStat) {
        threadStat.innerText = String(navigator.hardwareConcurrency) + " threads"
    }

    if (connectionStat) {
        if (navigator.onLine) {
            connectionStat.innerText = "Online"
        } else {
            connectionStat.innerText = "Offline"
        }

        interval7 = setInterval(() => {
            if (navigator.onLine) {
                connectionStat.innerText = "Online"
            } else {
                connectionStat.innerText = "Offline"
            }
        }, 100)
    }
}

(window as any).exposeStat = exposeStat;
(window as any).exposeAllStats = exposeAllStats;