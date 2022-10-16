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

const COLOR_THEMES = {
    LIGHT: 0,
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

const randomize = () => {
    const username = randomAlphaNumericSpecialAllCase(randomRange(1, 30), true);
    const handle = "@" + randomAlphaNumericSpecialAllCase(randomRange(1, 15), false);
    const pfp = "https://picsum.photos/200";
    const time = randomRange(1, 24) + "h";
    const text = randomAlphaNumericSpecialAllCase(randomRange(1, 300), true, false).trim();

    setContent(username, handle, pfp, time, text);

    setPadding(randomRange(300, 600), randomRange(0, 50), randomRange(0, 50), randomRange(0, 50), randomRange(0, 50));

    setColorTheme(COLOR_THEMES.DARK);
};


// randomize();
