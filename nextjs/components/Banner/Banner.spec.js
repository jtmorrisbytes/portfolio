const webdriver = require("selenium-webdriver")

let capabilities = {
    "browserName":"Chrome"
}



let chromeDriver = new webdriver.Builder().withCapabilities(capabilities).build()
