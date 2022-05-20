const fs = require('fs')
const easyinvoice = require('easyinvoice')

const createBuyerObject = (buyer) => {
  const buyerObj = {}
  if (buyer.name) {
    if (buyer.phone) buyerObj.company = `${buyer.name} (${buyer.phone})`
    else buyerObj.company = buyer.name
  }
  buyerObj.address = buyer.address || '(  Address  )'
  buyerObj.zip = buyer.zip || '(  ZIP  )'
  buyerObj.city = buyer.city || '(  City  )'
  buyerObj.country = buyer.country || '(  Country  )'
  return buyerObj
}

module.exports = async (data = {}) => {
  const { buyer, items, transactionId } = data

  const now = new Date()

  const invoiceNumber = `${now
    .toLocaleDateString('id-ID')
    .split('/')
    .join('')}${transactionId}`
  const date = now.toLocaleDateString('id-ID')
  const client = createBuyerObject(buyer)
  // migrate product objects
  const products = items.map((item) => {
    const migratedProduct = {
      quantity: item.quantity,
      description: item.name,
      'tax-rate': item.tax,
      price: item.price,
    }
    return migratedProduct
  })

  const invoiceData = {
    // "images": {
    //   "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
    //   "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
    // },
    sender: {
      company: 'Bandana Irmal Corp',
      address: 'Somewhere Over The Rainbow',
      zip: '1234 AB',
      city: 'Cimahi',
      country: 'Indonesia',
    },
    client,
    information: {
      number: invoiceNumber,
      date,
      'due-date': date,
    },
    products,
    'bottom-notice': 'Terima kasih atas pembeliannya!',
    settings: {
      locale: 'id-ID',
      currency: 'IDR',
      'tax-notation': 'vat',
      'margin-top': 25,
      'margin-right': 25,
      'margin-left': 25,
      'margin-bottom': 25,
    },
  }

  const result = await easyinvoice.createInvoice(invoiceData)

  const fileName = `invoices/${invoiceNumber}.pdf`

  fs.writeFileSync(fileName, result.pdf, 'base64')

  return fileName
}
