import { WebDriver, Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import { driver } from 'mocha-webdriver';

const mainPath = 'http://localhost:3000/';

async function log_in(login: string, haslo: string) {
  await driver.find('#login').doClear().doSendKeys(login);
  await driver.find('#haslo').doClear().doSendKeys(haslo);
  await driver.find('input[type=submit]').doClick();
}

async function logout() {
  await driver.findContent('a', /logout/).doClick();
}

async function assert_logged_in() {
  expect(await driver.find("body").getText()).to.contain("Wpisy");
}

async function assert_logged_out() {
  expect(await driver.find("body").getText()).to.contain("Logowanie");
}

async function assert_wrong_log() {
  expect(await driver.find("body").getText()).to.contain("niepoprawne");
}


describe('test01', async () => {

  it("checks if 5 entries are displayed", async function() {
    this.timeout(20000);
    await driver.get(mainPath);
    await driver.sleep(2000);
    expect((await driver.findAll('li')).length).to.equal(5);
  });

  it("tries to log in incorrectly and corretly", async function() {
    this.timeout(20000);
    await driver.get(mainPath);
    await log_in("uczen_1", "bledne haslo");
    await assert_wrong_log();
    await log_in("uczen_1", "haslo_1");
    await assert_logged_in();
    await logout();
    await assert_logged_out();
  });

})
