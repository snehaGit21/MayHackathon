const puppy = require("puppeteer");
const id = "thatsHow_I_stipple";
const password = "Hackathon2021";
let searchTags = ["#stippling", "#inkart", "#dotwork", "#art", "#artist", "#drawing"];
let numOfPosts = process.argv[2];

async function main() {
    let browser = await puppy.launch({
        headless: false,
        slowMo: 50,
        defaultViewport: false
    });
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto("https://www.instagram.com/accounts/login");
    await page.waitForSelector('input[name="username"]', {visible: true});
    await page.type('input[name="username"]',id);
    await page.type('input[name="password"]',password);
    await page.click('button[type="submit"]');
    
    await page.waitForSelector("._6q-tv", {visible: true});
    await page.click("._6q-tv");
    await page.waitForSelector('a[tabindex="0"]', {visible: true});
    let gotoProfileUrl = await page.$$('a[tabindex="0"]');
    let gotoProfileUrls = [];
    for(let k = 0; k < gotoProfileUrl.length; k++) {
        let url = await page.evaluate(function(ele) {
            return ele.getAttribute("href");
        }, gotoProfileUrl[k]);
        gotoProfileUrls.push(url);
    }
    await page.goto("https://www.instagram.com" + gotoProfileUrls[4]);
    let caption = [];
    
    //to obtain the top 3 hashtags present on insta for the given content in searchTag
    for(let i = 0; i < searchTags.length; i++){
        await page.type('input[placeholder="Search"]', searchTags[i]);
        await page.waitForNavigation({waituntil: "networkidle2"});
        let hashTags = await page.$$("._7UhW9.xLCgt.qyrsm.KV-D4.uL8Hv");
        
        for(let j = 0; j < 3; j++){
            let hashTag = await page.evaluate(function(ele) {
                return ele.innerText;
            }, hashTags[j]);
            caption.push(hashTag + " ");
        }
    await page.keyboard.down("Control");
    await page.keyboard.press("A");
    await page.keyboard.up("Control");
    await page.keyboard.press("Backspace");
    }
    
    //entering the hashTags obtained previously in the comment section of the desired number of posts.
    await page.click(".aIYm8.coreSpriteSearchClear");
    let lists = await page.$$(".v1Nh3.kIKUG._bz0w");
    await lists[0].click();
    for(let i = 1; i <= numOfPosts; i++){
        await page.waitForSelector('textarea[placeholder="Add a comment…"]', {visible : true});
        // await page.click('textarea[placeholder="Add a comment…"]');
        await page.type('textarea[placeholder="Add a comment…"]', caption);
        await page.waitForSelector(".sqdOP.yWX7d.y3zKF", {visible: true});
        await page.click(".sqdOP.yWX7d.y3zKF");
        await page.waitForSelector("._65Bje.coreSpriteRightPaginationArrow", {visible: true});
        await page.click("._65Bje.coreSpriteRightPaginationArrow");
    }

    await page.click(".Igw0E.IwRSH.eGOV_._4EzTm.BI4qX.qJPeX.fm1AK.TxciK.yiMZG");
    await browser.close();
}

main();
