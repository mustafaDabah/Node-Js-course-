module.exports = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%PRODUCTIMAGE%}/g, product.image);
    output = output.replace(/{%PRODUCTPRICE%}/g, product.price);
    output = output.replace(/{%PRODUCTFORM%}/g, product.from);
    output = output.replace(/{%PRODUCTTAGLINE%}/g, product.nutrients);
    output = output.replace(/{%PRODUCTQUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRODUCTDESCRIPTION%}/g, product.description);
    output = output.replace(/{%PRODUCTId%}/g, product.id);
    
    if(!product.organic) output = output.replace(/{%PRODUCTNOTORGAINC%}/g, 'not-organic');
    return output;
  }