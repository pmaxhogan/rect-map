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

const set = (username, handle, pfp, time, text) => {
    $("#tweet-username").innerText = username;
    $("#tweet-at").innerText = handle;
    $("#tweet-pfp").style.backgroundImage = `url(${pfp})`;
    $("#tweet-time").innerText = time;
    $("#tweet-text").innerText = text;
};

const randomize = () => {
    const username = randomAlphaNumericSpecialAllCase(Math.floor(Math.random() * 30) + 1, true);
    const handle = "@" + randomAlphaNumericSpecialAllCase(Math.floor(Math.random() * 15) + 1, false);
    const pfp = "https://picsum.photos/200";
    const time = Math.floor(Math.random() * 10) + "h";
    const text = randomAlphaNumericSpecialAllCase(Math.floor(Math.random() * 300) + 1, true, false).trim();

    set(username, handle, pfp, time, text);
};

randomize();
