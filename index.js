const { chromium } = require('playwright')


async function main() {

    const  browser = await chromium.launch({
        headless:true,
    });

    const page = await browser.newPage();

    let bool = true;
    let pageCounter = 1
    let data = []

    while(bool) {
        nextPage = await page.goto(`https://defendhawaii.com/collections/kane?page=${pageCounter}`)

        const noProductsFound = await page.locator('//h2[@class="title title--primary"]')
        const footerToScrollTo = await page.locator('//footer')
        if( footerToScrollTo.isVisible ) {
            await new Promise(r => setTimeout(r, 2000));
            footerToScrollTo.scrollIntoViewIfNeeded()
        }
        if( await noProductsFound.isVisible()) {
            await new Promise(r => setTimeout(r, 2000));

            const text = await noProductsFound.innerText()
            if ( text.includes('No products found')){
                bool = false
            }
        } else {
            await new Promise(r => setTimeout(r, 2000));

            let productNames = await page.locator('//a[@class="card-information__text h4"]').all()
            let images = await page.locator('//use-animate//lazy-image/img[1]').all()
            let prices = await page.locator('//dd//span[@class="price-item price-item--regular pric"]//price-money//bdi//span[@class="money"][1]').all()
            let productLink = await page.locator('//div[@class="card-wrapper"]//a[@class="full-unstyled-link"]').all()
        
            await new Promise(r => setTimeout(r, 2000));
        
        
                for (let i = 0; i < images.length; i++) {
                    let src = await images[i].getAttribute('src')
                    let name = await productNames[i].innerText()
                    let price = await prices[i].innerText()
                    let link = await productLink[i].getAttribute('href')
                    
                    data.push({
                        "product_name": name,
                        "product_price": price,
                        "product_image": src,
                        "product_url": link
                    })
                }
                pageCounter += 1;
        }

        }

    console.log(JSON.stringify(data))
    browser.close()
}



main()