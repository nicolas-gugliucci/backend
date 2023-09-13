import { Faker, en, es } from '@faker-js/faker'

export const mockProducts = () => {
    const customFaker = new Faker({ locale: [en] })
    return {
        id: customFaker.database.mongodbObjectId(),
        title: customFaker.commerce.productName(),
        description: customFaker.commerce.productDescription(),
        code: customFaker.string.alphanumeric(10),
        price: customFaker.commerce.price({symbol: 'U$S'}),
        sataus: customFaker.datatype.boolean(),
        stock: customFaker.number.int({ min: 0, max: 100 }),
        dategory: customFaker.commerce.department(),
        thumbnails: customFaker.helpers.multiple(customFaker.image.urlLoremFlickr({ category: 'product'}), { max: 5, min: 0 })
    }
}