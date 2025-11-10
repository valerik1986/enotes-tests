export const basketLocators = {
    navBar: `xpath=//a[normalize-space()='OK-Notes']`,
    basketDropdownMenu: `xpath=//div[@class='dropdown-menu dropdown-menu-right show']`,
    deleteProductIconDropdownMenu: `xpath=//i[@class='actionDeleteProduct fa fa-trash fa-lg mr-4']`,
    basketItemPosterDropdownMenu: `xpath=//img[@class='basket-item-poster mr-2']`,
    basketItemTitleDropdownMenu: `xpath=//*[@id="basketContainer"]/div[2]/ul/li/span[1]`,
    basketItemPriceDropdownMenu: (index: number) => `xpath=//*[@id="basketContainer"]/div[2]/ul/li[${index}]/span[2]`,
    basketCountIconDropdownMenu: (index: number) => `xpath=//*[@id="basketContainer"]/div[2]/ul/li[${index}]/span[3]`,
    basketFullPriceText: `xpath=//*[@id="basketContainer"]/div[2]/div[1]`,
    basketFullPrice: `xpath=//*[@id="basketContainer"]/div[2]/div[1]/span`,
    goToCartButton: `xpath=//a[contains(text(),'Перейти в корзину')]`,
    clearBasketButton: `xpath=//a[contains(text(),'Очистить корзину')]`,
    error500Header: `xpath=//h1[normalize-space()='Server Error (#500)']`,
    errorAlertBox: `xpath=//div[@class='alert alert-danger']`,
    }
    