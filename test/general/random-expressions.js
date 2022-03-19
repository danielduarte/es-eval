const {describe, it} = require('mocha');
const assert = require('assert');
const esEval = require('../..');

describe('Random cases', function () {
  it('can evaluate expressions', function () {
    assert.deepStrictEqual(esEval('!!customer.customerOf', {customer: {}}), false);
    assert.deepStrictEqual(esEval('!!customer.customerOf', {customer: {customerOf: 4}}), true);
    assert.deepStrictEqual(esEval('!!entities.customerTaxClass && !!entities.customerTaxClass.code', {entities: {}}), false);
    assert.deepStrictEqual(esEval('!!entities.customerTaxClass && !!entities.customerTaxClass.code', {entities: {customerTaxClass: {}}}), false);
    assert.deepStrictEqual(esEval('!!entities.customerTaxClass && !!entities.customerTaxClass.code', {entities: {customerTaxClass: {code: 1}}}), true);
    assert.deepStrictEqual(esEval('!!entities.tax && !!entities.tax.code && !!entities.tax.rate', {entities: {tax: {code: 1, rate: 2}}}), true);
    assert.deepStrictEqual(esEval('!!headerParams["x-user-id"]', {headerParams: {"x-user-id": 1}}), true);
    assert.deepStrictEqual(esEval('!!ownerVerificationResult.customer', {ownerVerificationResult: {customer: 1}}), true);
    assert.deepStrictEqual(esEval('!company.error', {company: {error: ''}}), true);
    assert.deepStrictEqual(esEval('!taxResult.error && !taxZoneResult.error && !customerTaxClassResult.error && !productTaxClassResult.error', {taxResult: {}, taxZoneResult: {}, customerTaxClassResult: {error: false}, productTaxClassResult: {}}), true);
    assert.deepStrictEqual(esEval('!uncheckedPriceList.error && uncheckedPriceList.length === 1', {uncheckedPriceList: ["r"]}), true);
    assert.deepStrictEqual(esEval('$root.headerParams', {$root: {}}), undefined);
    assert.deepStrictEqual(esEval('$root.productImages[$index].url || null', {$root: {productImages: [{}, {}, {}, {url: 98}]}, $index: 3}), 98);
    assert.deepStrictEqual(esEval('$root.queryParams || {}', {$root: {}}), {});
    assert.deepStrictEqual(esEval('($root.queryParams || {}).where || {}', {$root: {}}), {});
    assert.deepStrictEqual(esEval('($root.queryParamsJsonFilter||{}).filter || {}', {$root: {}}), {});
    assert.deepStrictEqual(esEval('(($root.queryParamsJsonFilter||{}).filter || {}).where || {}', {$root: {}}), {});
    assert.deepStrictEqual(esEval('(request_body.items || []).map(item => item.productId)', {request_body: {items: [{productId: 11}, {productId: 22}, {productId: 33}]}}), [11, 22, 33]);
    assert.deepStrictEqual(esEval('body.length > 0', {body: [1]}), true);
    assert.deepStrictEqual(esEval('body[0]', {body: [{}]}), {});
    assert.deepStrictEqual(esEval('cart.owner === customer.id', {cart: {owner: 2}, customer: {id: 2}}), true);
    assert.deepStrictEqual(esEval('cartToPlace.items.map(item => item.productId)', {cartToPlace: {items: [{productId: 11}, {productId: 22}]}}), [11, 22]);
    assert.deepStrictEqual(esEval('cartToPlace.owner === headerParams["x-user-id"]', {cartToPlace: {owner: 8, items: [{productId: 11}, {productId: 22}]}, headerParams: {"x-user-id": 8}}), true);
    assert.deepStrictEqual(esEval('cartVersion.error      ? { error: "Cannot connect to microservice" } : (cartVersion.fullVersion      ? { fullVersion: cartVersion.fullVersion      } : { error: "Cannot get microservice full version" } )', {cartVersion: {error: 0, fullVersion: 99}}), {fullVersion: 99});
    assert.deepStrictEqual(esEval('customer.employeeOf || null', {customer: 11111}), null);
    assert.deepStrictEqual(esEval('orders[0]', {orders: [9]}), 9);
    assert.deepStrictEqual(esEval('headerParams["x-tenant-id"]', {headerParams: {"x-tenant-id": 11111}}), 11111);
    assert.deepStrictEqual(esEval('possibleAppliedTaxes.error.statusCode || 400', {possibleAppliedTaxes: {error: {statusCode: -1}}}), -1);
    assert.deepStrictEqual(esEval('possibleBaseUrlBody !== null && typeof possibleBaseUrlBody.value === "string"', {possibleBaseUrlBody: {value: '11111'}}), true);
    assert.deepStrictEqual(esEval('possibleProducts.length === productIds.length', {possibleProducts: [5, 6], productIds: {length: 2}}), true);
    assert.deepStrictEqual(esEval('prices[0].price', {prices: [{price: 3, id: 4, itemCode: 90}, {price: -5}, {price: 32, itemCode: []}]}), 3);
    assert.deepStrictEqual(esEval('product_info.type !== "virtual"', {product_info: 11111}), true);
    assert.deepStrictEqual(esEval('products.map(p => p.id)', {products: [{id: 55}]}), [55]);
    assert.deepStrictEqual(esEval('request_body.items.map(item => item.productId)', {request_body: {items: [{productId: 'x'}]}}), ['x']);
    assert.deepStrictEqual(esEval('stockItem.status === "in-stock" && ( !stockItem.managed || !!stockItem.backorders || stockItem.qty >= stockItem.minQty )', {stockItem: {minQty: 20, qty: 100, backorders: false, managed: true, status: "in-stock"}}), true);
    assert.deepStrictEqual(esEval('images.map(img => { img.url = ( assetsById[img.id] || {} ).url; return img; })', {images: [{id: 2}], assetsById: {2: {url: 'aaa'}}}), [{id: 2, url: 'aaa'}]);
    assert.deepStrictEqual(esEval('typeof headerParams["x-tenant-id"] === "string"', {headerParams: {"x-tenant-id": ''}}), true);
    assert.deepStrictEqual(esEval('uncheckedPriceList[0]', {uncheckedPriceList: [99]}), 99);
    assert.deepStrictEqual(esEval('typeof request_body.items !== "undefined"', {request_body: {items: 9}}), true);
    assert.deepStrictEqual(esEval('validCompany.isManaged === false && typeof validCompany.dbId === "string"', {validCompany: {isManaged: false, dbId: ''}}), true);
    assert.deepStrictEqual(esEval('this.roles', {}), void 0);
    assert.deepStrictEqual(esEval('productImages.reduce((acc, img) => { img.url=baseUrlBody.value+"/"+img.id; acc[img.id]=img; return acc; }, {})', { productImages: [{id: 1111}, {id: 2222}], baseUrlBody: {value: 'http://hola.com'} }), { '1111': { id: 1111, url: 'http://hola.com/1111' }, '2222': { id: 2222, url: 'http://hola.com/2222' } });
    assert.deepStrictEqual(esEval('prices.length>0 && prices.reduce((min,p) => p.itemCode===11 && p.price<min ? p.price:min, Infinity) || null', { prices: [{id: 'p1',itemCode:11, price:123}, {id: 'p1',itemCode:11, price:120}, {id: 'p1',itemCode:11, price:150}] }), 120);
    assert.deepStrictEqual(esEval('prices.length>0 && prices.reduce((min,p)=>p.price<min?p.price:min,Infinity) || null', { prices: [{price:3}, {price:-5},{price:32}] }), -5);
    assert.deepStrictEqual(esEval('typeof userType === "string" && ["root", "operator", "customer", "guest"].includes(userType)', { userType: 'operator' }), true);
    assert.deepStrictEqual(esEval('typeof headerParams["x-user-type"] === "string" && ["root", "operator", "customer", "guest"].includes(headerParams["x-user-type"])', { headerParams: {"x-user-type": 'guest' }}), true);
    assert.deepStrictEqual(esEval('productsWithPrices.map(p => { p.isAvailable=availableProductIds.includes(p.id); return p; })', { productsWithPrices: [{id:5},{id:6}],availableProductIds:[3,4,5] }), [{id:5,isAvailable:true}, {id:6,isAvailable:false}]);

    // @todo(feat) implement array.filter
    // assert.deepStrictEqual(esEval('productsWithMainStock.map(  p => { p.isAvailable = !!p.isAvailable && (typeof p.children === "undefined" || p.children.filter(child => availableProductIds.includes(child.childId)).length > 0); return p }  )', { productsWithMainStock: [{isAvailable: true,children:[]}] }), [{ isAvailable: true}]);
    // assert.deepStrictEqual(esEval('products.map(p=>p.id).concat(products.filter(p=>p.type=="configurable").reduce((acc, p) => { acc = [...acc, ...p.children.map(ch=>ch.childId)]; return acc; }, []))', { products: [{type:'configurable'},{type:'simple'},{type:'configurable',children: [{childId:'ch1'}, {childId:'ch2'}]}] }), {});
    // assert.deepStrictEqual(esEval('$root.prices.filter(p=>p.itemCode === this.id).map(p => { delete p.id; delete p.itemCode; delete p.priceList; return p; })', { $root: {prices:[{price:3,id:4,itemCode:90}, {price:-5},{price:32,itemCode:[]}]} }), {});
    // assert.deepStrictEqual(esEval('[    { message:"Could not create TaxRule",info:$root.taxRuleResult }     ].filter(result => !!result.info.error)', { $root: 11111 }), {});
    // assert.deepStrictEqual(esEval('[     { message:"Could not create Tax",info:$root.taxResult },     { message:"Could not create TaxZone",info:$root.taxZoneResult },     { message:"Could not create CustomerTaxClass",info:$root.customerTaxClassResult },       { message:"Could not create ProductTaxClass",info:$root.productTaxClassResult }        ].filter(result => !!result.info.error)', { $root: 11111 }), {});

    // @todo(feat) implement spread
    // assert.deepStrictEqual(esEval('[...new Set((request_body.items || []).map(item => item.productId))]', { xxxxx: 11111 }), {});
    // assert.deepStrictEqual(esEval('body.map(asset => ({ ...asset, url: `${baseUrlBody.value}/${asset.id}`}))', { body: [{},{}] }), {});
    // assert.deepStrictEqual(esEval('imageAssets.reduce((acc, elem) => { return [...acc, ...elem.productImage]; }, []).reduce((acc, img) => { img.url=baseUrlBody.value+"/"+img.id; acc[img.id]=img; return acc; }, {})', { imageAssets: [{productImage:{id:'i1'}}, {productImage:{id:'i2'}}], baseUrlBody: {value: 'http://chau.com'} }), 1111);

    // @todo(feat) implement JSON
    // assert.deepStrictEqual(esEval('uncheckedPriceList.error ? uncheckedPriceList.error : {error:"Could not find the price list ("+JSON.stringify(priceListFilter)+")"}', { uncheckedPriceList: 11111 }), {});
    // assert.deepStrictEqual(esEval('{...$root.queryParams, filter: JSON.parse(($root.queryParams||{}).filter || '{}')}', { xxxxx: 11111 }), {});

    // @todo(fix) fix expression
    // assert.deepStrictEqual(esEval('delete stockItem.productId && stockItem', { stockItem: 11111 }), 11111);
    // assert.deepStrictEqual(esEval('prices.map(p => { delete p.id; delete p.itemCode; delete p.priceList; return p; })', { prices: [{price:3,id:4,itemCode:90}, {price:-5},{price:32,itemCode:[]}] } ), [{price:3}, {price:-5},{price:32}]);

    // @todo(feat) implement Object
    // assert.deepStrictEqual(esEval('Object.entries(sanitizationMap).reduce((acc, [sanitizedField, rawField]) => { acc[sanitizedField] = entityData[rawField]; return acc; }, {})', { xxxxx: 11111 }), {});
    // assert.deepStrictEqual(esEval('Object.keys(entityData).map(field => [ field, field.toLowerCase().replace(/[^a-z0-9]/g, "") ]).reduce((acc, item) => { acc[item[1]]=item[0]; return acc; }, {})', { xxxxx: 11111 }), {});

    // @todo(feat) implement string.trim
    // assert.deepStrictEqual(esEval('sanitizedData.ruleenabled && sanitizedData.ruleenabled.trim().toLowerCase() === "yes" ? true : (sanitizedData.ruleenabled && sanitizedData.ruleenabled.trim().toLowerCase() === "no" ? false : true)', { sanitizedData: { ruleenabled: "s"} }), {});

    // @todo(feat) parseFloat
    // assert.deepStrictEqual(esEval('parseFloat(sanitizedData.taxrate)', { xxxxx: 11111 }), {});
  });
});
