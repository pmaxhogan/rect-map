const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const randomAlphaNumericSpecialAllCase = (length, allowSpaces = false, allowSpecial = false) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
        (allowSpecial ? "!@#$%^&*()_+~`|}{[]\:;?><,./-=" : "") +
        (allowSpaces ? " ".repeat(15) : "");
    let result = "";
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomTo = (max) => randomRange(0, max);

const setContent = (username, handle, pfp, time, text) => {
    $("#tweet-username").innerText = username;
    $("#tweet-at").innerText = handle;
    $("#tweet-pfp").style.backgroundImage = `url(${pfp})`;
    $("#tweet-time").innerText = time;
    $("#tweet-text").innerText = text;
};

const setDecoration = (threeDots) => {
    document.documentElement.style.setProperty("--three-dots-display", threeDots ? "block" : "none");
};

const COLOR_THEMES = {
    LIGHT: {
        "--background-color": "#FFF",
        "--accent-color": "#536471",
        "--text-color": "#000",
    },
    DARK: {
        "--background-color": "#15202b",
        "--accent-color": "#8b98a5",
        "--text-color": "#f7f9f9",
    },
    LIGHTS_OUT: {
        "--background-color": "#000",
        "--accent-color": "#71767B",
        "--text-color": "#E7E9EA"
    },
};

const setColorTheme = (theme) => {
    for(const key in theme) {
        document.documentElement.style.setProperty(key, theme[key]);
    }
};

const setPadding = (width, paddingTop, paddingBottom, paddingLeft, paddingRight) => {
    document.documentElement.style.setProperty("--base-width", width + "px");
    document.documentElement.style.setProperty("--top-spacing", paddingTop + "px");
    document.documentElement.style.setProperty("--bottom-spacing", paddingBottom + "px");
    document.documentElement.style.setProperty("--left-spacing", paddingLeft + "px");
    document.documentElement.style.setProperty("--right-spacing", paddingRight + "px");
};

const timeOptions = {
    SECONDS: 0,
    MINUTES: 1,
    HOURS: 2,
    DAYS: 3,
    DAYS_MONTHS: 4,
    DAYS_MONTHS_YEARS: 5,
};

const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const randomize = () => {
    const username = randomAlphaNumericSpecialAllCase(randomRange(1, 30), true);
    const handle = "@" + randomAlphaNumericSpecialAllCase(randomRange(1, 15), false);
    const pfp = `https://picsum.photos/seed/${randomAlphaNumericSpecialAllCase(10, false)}/48/48`;
    const text = randomAlphaNumericSpecialAllCase(randomRange(1, 300), true, false).trim();

    const timeOption = timeOptions[Object.keys(timeOptions)[randomTo(Object.keys(timeOptions).length - 1)]];

    let time;
    switch (timeOption) {
        case timeOptions.SECONDS:
            time = randomRange(1, 60) + "s";
            break;
        case timeOptions.MINUTES:
            time = randomRange(1, 60) + "m";
            break;
        case timeOptions.HOURS:
            time = randomRange(1, 24) + "h";
            break;
        case timeOptions.DAYS:
            time = randomRange(1, 30) + "d";
            break;
        case timeOptions.DAYS_MONTHS:
            time = monthsShort[randomTo(11)] + " " + randomRange(1, 30);
            break;
        case timeOptions.DAYS_MONTHS_YEARS:
            time = monthsShort[randomTo(11)] + " " + randomRange(1, 30) + ", " + randomRange(2000, 2020);
            break;

    }

    setContent(username, handle, pfp, time, text);

    setPadding(randomRange(450, 600), randomRange(0, 50), randomRange(0, 50), randomRange(0, 50), randomRange(0, 50));

    setColorTheme(COLOR_THEMES[Object.keys(COLOR_THEMES)[randomTo(Object.keys(COLOR_THEMES).length - 1)]]);

    setDecoration(randomTo(1) === 1);
};


randomize();


const getBoundingBoxes = () => {
    const pfp = $("#tweet-pfp").getBoundingClientRect();
    const names = $("#tweet-names").getBoundingClientRect();

    return {pfp, names};
}
