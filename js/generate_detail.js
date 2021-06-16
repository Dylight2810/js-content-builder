'use strict';

const API_URL = {
    PRODUCT_DETAIL: 'http://dev.omipage.com/api/v1/products/',
};

const EnumLandingBlockElementName = {
    // Landing All Products
    LANDING_PRODUCT_DETAIL: 'OMP_PRODUCT_DETAIL'
};

(function (window) {
    class DataService {
        landing_token;

        constructor() {
            this._getLandingToken();
        }

        _createGetRequest = (url) => {
            return new Promise((resolve, reject) => {
                const xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = () => {
                    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                        return resolve(xmlHttp.responseText);
                    }
                }
                xmlHttp.open('GET', url, true); // true for asynchronous
                xmlHttp.setRequestHeader('Authorization', this.landing_token);
                xmlHttp.send();
            })
        }

        getProductDetailById = async (product_sku) => {
            const request_url = `${API_URL.PRODUCT_DETAIL}${product_sku}/`;
            return await this._createGetRequest(request_url);
        }

        _getLandingToken = () => {
            const _meta_el = document.querySelectorAll('meta[name="omp-key"]')[0];
            this.landing_token = `Landing ${_meta_el.getAttribute('content')}`;
        }
    }

    class ElementContentBuilder {
        constructor() {
        }

        _detailPageHeaderBuilder = () => {
            return `<div class="omp-landing-detail--header">
                        <div class="header-container">
                            <div class="back-icon">
                                <i class="bi bi-arrow-left"></i>
                            </div>
                            <div class="header-title">Chi tiết sản phẩm</div>
                            <div class="header-space"></div>
                        </div>
                    </div>`;
        }

        _productImageContentBuilder = (image_url) => {
            return `<div class="omp-product-detail--image">
                        <div class="product-image--wrapper">
                            <img src="${image_url}" alt="Product image">
                        </div>
                    </div>`;
        }

        _productMetaDataBuilder = (product_name, price, price_sale, currency) => {
            return `<div class="product-detail--meta-data">
                        <div class="omp-container">
                            <div class="p-name-price">
                                <h5>${product_name}</h5>
                                <h5 class="price-sale">
                                    ${price_sale} ${currency}
                                    <span class="normal-price">${price} ${currency}</span>
                                </h5>
                            </div>
                            <div class="p-favorite-action">
                                <i class="bi bi-heart"></i>
                            </div>
                        </div>
                        <div class="omp-container">
                            <div class="product--rating-stars">
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                            </div>
    
                            <div class="product--rating-results">
                                <span class="rating-result--number">5.0</span>
                                <span class="rating-result--text">Đánh giá tốt</span>
                            </div>
                        </div>
                    </div>`;
        }

        _productSelectProductBuilder = (variant_option) => {
            if (!variant_option || !variant_option.length) {
                return '';
            }

            let select_variant_tpl = '';

            variant_option.forEach(v => {
                let op_tpl = '';
                if (v.values && v.values.length) {
                    v.values.forEach(o => {
                        op_tpl += `<div class="p-variant-item" data-variant-value="${o.id}">
                                        ${o.name}
                                    </div>`;
                    });
                }

                select_variant_tpl += `<div class="omp-container">
                                           <p class="omp-mb-0">${v.name}</p>
                                           <div class="product-variant" data-variant="${v.id}">
                                                ${op_tpl}
                                           </div>
                                       </div>`;
            });

            return `<div class="product-detail--select-product">
                        ${select_variant_tpl}
                    </div>`;
        }

        _productSelectQuantityBuilder = () => {
            return `<div class="product-detail--select-quantity">
                        <div class="omp-container display-flex omp-mb-3">
                            <p class="omp-mb-0">Chọn số lượng</p>
                            <div class="p-quantity">
                                <div class="p-quantity-button">-</div>
                                <div class="p-quantity-button p-quantity-number">1</div>
                                <div class="p-quantity-button">+</div>
                            </div>
                        </div>
    
                        <div class="omp-container display-flex omp-mb-2">
                            <button class="btn btn-primary">
                                Thêm vào giỏ hàng
                            </button>
                            <button class="btn btn-danger">
                                Mua ngay
                            </button>
                        </div>
                    </div>`;
        }

        _productDescriptionBuilder = () => {
            const a = 'Mô tả sản phẩm';
            return `<div class="product-detail--description">
                        <div class="omp-container display-flex omp-mb-3">
                            <p class="omp-mb-0">${a}</p>
                            <div class="p-description">
                                Hiển thị nội dung mô tả sản phẩm mà bạn đã nhập khi tạo hoặc đồng bộ sản phẩm từ Omisell
                            </div>
                        </div>
                    </div>`;
        }

        _productInformationBuilder = (product) => {
            return `<div class="omp-product-detail--information">
                        ${this._productMetaDataBuilder(product.name, product.price, product.listed_price, product.currency)}
                        ${this._productSelectProductBuilder(product.options)}
                        ${this._productSelectQuantityBuilder()}
                        ${this._productDescriptionBuilder()}
                    </div>`;
        }

        _productBlockContentBuilder = (product) => {
            return `<div class="omp-landing-block--content">
                        ${this._productImageContentBuilder(product.avatar_image)}
                        ${this._productInformationBuilder(product)}
                    </div>`;
        }
    }

    class SelectVariantButton {
        store_group_selected_id = [];
        store_variant_group = [];
        product_detail = null;

        constructor(product) {
            const self = this;
            self.product_detail = product;
        }

        _queryProductVariantGroupElements = () => {
            return document.querySelectorAll('div[class=product-variant]')
        }

        _queryProductVariantOptionElements = (group_el) => {
            return group_el.querySelectorAll('div[class^=p-variant-item]')
        }

        handleSelectEvent = () => {
            const arr_group_variant = this._queryProductVariantGroupElements();

            arr_group_variant.forEach(group_el => {
                const _group_id = parseInt(group_el.getAttribute('data-variant'))
                this._addSelectVariantEvent(group_el, _group_id);
                this.store_variant_group.push({
                    group_element: group_el,
                    variant_group: _group_id,
                    variant_value_selected: null,
					has_child_disabled: false
                });
            })
        }

        _addSelectVariantEvent = (group_variant_el, group_variant_id) => {
            const arr_select_variant_btn = this._queryProductVariantOptionElements(group_variant_el);

            const _eventHandler = (e) => {
                if (!e || !e.target) return;

                const _el = e.target;

                if (_el.classList.contains('disabled')) return;

                let _selected_value = null;
                if (_el.classList.contains('active')) {
                    _el.classList.remove('active');
                } else {
                    _selected_value = parseInt(e.target.getAttribute('data-variant-value'));
                    this._removeElementClass(Array.from(arr_select_variant_btn), 'active');
                    _el.classList.add('active');
                }

                this._updateVariantSelectedValue(group_variant_id, _selected_value);

                this._updateDisableSelectStatus();
            };

            arr_select_variant_btn.forEach(e => {
                e.addEventListener('click', _eventHandler);
            })
        }

        _updateDisableSelectStatus = () => {
            let _arr_variant_out_of_stock = [];
            let _arr_group_selected = [];
            let _group_not_select;

            this.store_variant_group.forEach(group => {
                if (group.variant_value_selected !== null) {
                    _arr_group_selected.push(group);
                } else {
                    _group_not_select = group;
                }
            });

            if (_arr_group_selected.length < this.store_variant_group.length - 1) return

            this.product_detail.variants.forEach(v => {
                if (v.fulfillable) {
                    console.log(v.variant_attributes_id);
                    return
                }

                let _is_variant_include_selected_attr = false;

                if (v && v.variant_attributes_id) {
                    _is_variant_include_selected_attr = _arr_group_selected.reduce((_v, group) => {
                        return v.variant_attributes_id.includes(`${group.variant_group}-${group.variant_value_selected}`)
                    }, false);
                }

                if (_is_variant_include_selected_attr) {
                    _arr_variant_out_of_stock.push(v.attributes.find(attr => this.store_group_selected_id.indexOf(attr.id) === -1)?.value?.id);
                }
            })
			
			if (!_arr_variant_out_of_stock.length) return;

            const _group_not_select_option = this._queryProductVariantOptionElements(_group_not_select.group_element);
			this.store_variant_group.forEach(group => group.has_child_disabled = group.variant_group === _group_not_select.variant_group);
            const _option_must_disable = Array.from(_group_not_select_option).filter(e => _arr_variant_out_of_stock.includes(parseInt(e.getAttribute('data-variant-value'))));
            _option_must_disable.forEach(e => e.classList.add('disabled'))
        }

        _updateVariantSelectedValue = (group_variant_id, value_selected) => {
            this.store_variant_group.forEach(v => {
                if (v.variant_group === group_variant_id) {
                    v.variant_value_selected = value_selected;
                }
            });

            if (value_selected && !this.store_group_selected_id.includes(group_variant_id)) {
                this.store_group_selected_id.push(group_variant_id);
            }

            if (!value_selected) {
                this.store_group_selected_id = this.store_group_selected_id.filter(id => id !== group_variant_id);
            }

            if (this.store_group_selected_id.length === this.store_variant_group.length - 1) {
				const _group_not_select = this.store_variant_group.find(group => group.variant_value_selected === null)?.group_element;
				const _group_has_child_disabled = this.store_variant_group.find(group => group.has_child_disabled === true)?.group_element;
                
                this._removeElementClass(
                    Array.from(this._queryProductVariantOptionElements(_group_has_child_disabled || _group_not_select)),
                    'disabled'
                )
            }
        }

        _removeElementClass = (arr_element, class_name) => {
            if (!arr_element || !arr_element.length) {
                return
            }

            arr_element.forEach(e => {
                if (e.classList.contains(class_name)) {
                    e.classList.remove(class_name)
                }
            });
        }
    }


    class ProductDetail {
        data_service = new DataService();
        content_builder = new ElementContentBuilder();
        select_variant_button = null;

        constructor() {
        }

        initPage = () => {
            const product_sku = 'SHIS-D2';
            this._getProductDetailById(product_sku).then();
        }

        _getProductDetailById = async (product_sku) => {
            const response = await this.data_service.getProductDetailById(product_sku);
            const product_detail = this._addVariantAttributesId(JSON.parse(response));

            // Generate product detail element content
            const product_detail_el = document.getElementById(EnumLandingBlockElementName.LANDING_PRODUCT_DETAIL);
            product_detail_el.innerHTML = `${this.content_builder._detailPageHeaderBuilder()}${this.content_builder._productBlockContentBuilder(product_detail)}`;

            // Handle select variant event
            this.select_variant_button = new SelectVariantButton(product_detail);
            this.select_variant_button.handleSelectEvent();
        }

        _addVariantAttributesId = (product) => {
            if (!product || !product.variants || !product.variants.length) {
                return null
            }

            product.variants.forEach(v => {
                let _attr_id = '';
                if (v.attributes && v.attributes.length) {
                    v.attributes.forEach((attr, index) => {
                        _attr_id += index === v.attributes.length - 1 ? `${attr.id}-${attr.value.id}` : `${attr.id}-${attr.value.id}_`;
                    })
                }
                v.variant_attributes_id = _attr_id;
            })

            console.log(product)
            return product;
        }
    }

    window.ProductDetail = ProductDetail;
}(window))

const product_detail_el = new ProductDetail();
product_detail_el.initPage();
