'use strict';

const API_URL = {
    PRODUCT_DETAIL: 'https://dev.omipage.com/api/v1/products/',
};

const EnumLandingBlockElementName = {
    // Landing All Products
    LANDING_PRODUCT_DETAIL: 'OMP_PRODUCT_DETAIL'
};

const EnumElementAttributeName = {
    DATA_OMP_ELEMENT: 'data-omp-element',
    DATA_ACTION: 'data-action',
    DATA_SKU: 'data-sku',
    DATA_QUANTITY: 'data-quantity',
    DATA_NAME: 'data-name',
    DATA_PRICE: 'data-price',
    DATA_DISCOUNTED_PRICE: 'data-discounted-price',
    DATA_IMAGE: 'data-image',
    DATA_BUY_NOW: 'data-buy-now'
};

const EnumPDElementAttributeValue = {
    PRODUCT_IMAGE: 'product-image',
    PRODUCT_NAME: 'product-name',
    PRODUCT_LISTED_PRICE: 'product-listed-price',
    PRODUCT_PRICE: 'product-price',
    PRODUCT_SELECT_VARIANT: 'variant-select',
    PRODUCT_QUANTITY: 'select-quantity',
    PRODUCT_DESCRIPTION: 'product-description',
    PRODUCT_GROUP_BUTTON_ACTION: 'group-button-action',
    PRODUCT_QUANTITY_INCREASE: 'increase-quantity',
    PRODUCT_QUANTITY_DECREASE: 'decrease-quantity',
    PRODUCT_QUANTITY_VALUE: 'quantity-value',
    ADD_TO_CART: 'add_to_cart',
    CHECKOUT: 'checkout'
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
                    if (xmlHttp.readyState === 4) {
                        if (xmlHttp.status === 200) {
                            return resolve(xmlHttp.responseText);
                        } else {
                            return resolve(null);
                        }
                    }
                }
                xmlHttp.open('GET', url, true); // true for asynchronous
                xmlHttp.setRequestHeader('Authorization', this.landing_token);
                xmlHttp.send();
            })
        }

        getProductDetailById = async (product_id) => {
            const request_url = `${API_URL.PRODUCT_DETAIL}${product_id}/`;
            return await this._createGetRequest(request_url);
        }

        _getLandingToken = () => {
            const _meta_el = document.querySelectorAll('meta[name="omp_key"]')[0];
            this.landing_token = `Landing ${_meta_el.getAttribute('content')}`;
        }
    }

    class ElementContentBuilder {
        loading_element = null;
        page_wrapper_el = null;
        product_wrapper_el = null;

        constructor() {
            const self = this;
            self.page_wrapper_el = document.getElementById('omp_wrapper');
            self.product_wrapper_el = document.getElementById(EnumLandingBlockElementName.LANDING_PRODUCT_DETAIL);
            self.loading_element = document.getElementsByClassName('omp-loading')[0];
        }

        _showLoading = () => {
            if (!this.loading_element.classList.contains('show')) {
                this.loading_element.classList.add('show');
            }
        }

        _hideLoading = () => {
            if (this.loading_element.classList.contains('show')) {
                this.loading_element.classList.remove('show');
            }
        }

        _queryElementsByAttribute = (parent_node, attribute_name, attribute_value) => {
            return parent_node.querySelectorAll(`[${attribute_name}=${attribute_value}]`)[0];
        }

        _queryElementsByClass = (parent_node, class_name) => {
            return parent_node.querySelectorAll(`div[class=${class_name}]`)[0];
        }

        _queryElementsLikeClassName = (parent_node, class_name) => {
            return parent_node.querySelectorAll(`div[class^=${class_name}]`);
        }

        _productSkeletonLoadingBuilder = () => {
            return `<div class="omp-landing-detail--header">
                        <div class="header-container">
                            <div class="skeleton-item"></div>
                            <div class="skeleton-item"></div>
                            <div class="header-space"></div>
                        </div>
                    </div>
                    <div class="omp-landing-block--content">
                        <div class="omp-product-detail--image">
                            <div class="product-image--wrapper">
                                <div class="skeleton-item"></div>
                            </div>
                        </div>
                        <div class="omp-product-detail--information">
                            <div class="product-detail--meta-data">
                                <div class="omp-container">
                                    <div class="p-name-price">
                                        <div class="skeleton-item"></div>
                                    </div>
                                </div>
                                <div class="omp-container">
                                    <div class="product--rating-stars">
                                        <div class="skeleton-item"></div>
                                    </div>
                                    
                                    <div class="product--rating-results">
                                        <div class="skeleton-item"></div>
                                        <div class="skeleton-item"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="product-detail--select-product">
                                <div class="omp-container">
                                    <div class="skeleton-item"></div>
                                    <div class="skeleton-item"></div>
                                </div>
                            </div>
                            <div class="product-detail--description">
                                <div class="omp-container display-flex omp-mb-3">
                                    <div class="skeleton-item"></div>
                                    <div class="skeleton-item"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="omp-landing-detail--footer">
                        <div class="product-detail--select-quantity">
                            <div class="omp-container display-flex omp-mb-3">
                                <div class="skeleton-item"></div>
                                <div class="p-quantity">
                                    <div class="skeleton-item"></div>
                                </div>
                            </div>
            
                            <div class="omp-container display-flex">
                                <div class="skeleton-item"></div>
                                <div class="skeleton-item"></div>
                            </div>
                        </div>
                    </div>`
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

            return `${select_variant_tpl}`;
        }

        _addInvalidClass = (el, invalid_class_name) => {
            if (!el.classList.contains(invalid_class_name)) {
                el.classList.add(invalid_class_name);
            }
        }

        _removeInvalidClass = (el, invalid_class_name) => {
            if (el.classList.contains(invalid_class_name)) {
                el.classList.remove(invalid_class_name);
            }
        }

        _updateGroupButtonAttribute = (product) => {
            if (!product) return;

            const _updateAttributeValue = (btn_el) => {
                btn_el.setAttribute(EnumElementAttributeName.DATA_SKU, product.sku);
                btn_el.setAttribute(EnumElementAttributeName.DATA_QUANTITY, 1);
                btn_el.setAttribute(EnumElementAttributeName.DATA_NAME, product.name);
                btn_el.setAttribute(EnumElementAttributeName.DATA_PRICE, product.listed_price);
                btn_el.setAttribute(EnumElementAttributeName.DATA_DISCOUNTED_PRICE, product.price);
                btn_el.setAttribute(EnumElementAttributeName.DATA_IMAGE, product.images[0]);
            }

            const _add_to_cart_btn = this._queryElementsByAttribute(document, EnumElementAttributeName.DATA_ACTION, EnumPDElementAttributeValue.ADD_TO_CART);
            _updateAttributeValue(_add_to_cart_btn);

            const _buy_now_btn = this._queryElementsByAttribute(document, EnumElementAttributeName.DATA_ACTION, EnumPDElementAttributeValue.CHECKOUT);
            _updateAttributeValue(_buy_now_btn);
        }

        _removeGroupButtonAttribute = () => {
            const _removeAttribute = (btn_el) => {
                btn_el.removeAttribute(EnumElementAttributeName.DATA_SKU);
                btn_el.removeAttribute(EnumElementAttributeName.DATA_QUANTITY);
                btn_el.removeAttribute(EnumElementAttributeName.DATA_NAME);
                btn_el.removeAttribute(EnumElementAttributeName.DATA_PRICE);
                btn_el.removeAttribute(EnumElementAttributeName.DATA_DISCOUNTED_PRICE);
                btn_el.removeAttribute(EnumElementAttributeName.DATA_IMAGE);
            }

            const _add_to_cart_btn = this._queryElementsByAttribute(document, EnumElementAttributeName.DATA_ACTION, EnumPDElementAttributeValue.ADD_TO_CART);
            _removeAttribute(_add_to_cart_btn);

            const _buy_now_btn = this._queryElementsByAttribute(document, EnumElementAttributeName.DATA_ACTION, EnumPDElementAttributeValue.CHECKOUT);
            _removeAttribute(_buy_now_btn);
        }

        _scrollToElement = (el) => {
            const _el_screen_position = el.getBoundingClientRect();
            this.page_wrapper_el.scrollTo({
                top: _el_screen_position.top,
                behavior: 'smooth'
            });
        }

        _addBackToPreviousButtonAction = () => {
            const _back_btn = this._queryElementsByClass(document, 'header-back-icon');

            _back_btn.addEventListener('click', () => {
                window.history.back();
            })
        }
    }

    class SelectVariantButton {
        element_content_builder;
        group_quantity_button;
        product_detail = null;
        store_group_selected_id = [];
        store_variant_group = [];
        select_product_el;

        constructor(product, content_builder, group_quantity, select_product_el) {
            const self = this;
            self.product_detail = product;
            self.element_content_builder = content_builder;
            self.group_quantity_button = group_quantity;
            self.select_product_el = select_product_el;
        }

        _queryProductVariantGroupElements = () => {
            return this.element_content_builder._queryElementsLikeClassName(document, 'product-variant');
        }

        _queryProductVariantOptionElements = (group_el) => {
            return this.element_content_builder._queryElementsLikeClassName(group_el, 'p-variant-item');
        }

        _verifyIncludesArr = (parent_arr, child_arr) => {
            if (!parent_arr || !parent_arr.length || !child_arr || !child_arr.length) return false;

            return child_arr.reduce((_v, e) => _v && parent_arr.includes(e), true);
        }

        _findSelectedVariant = () => {
            let _variant_selected = null;
            const _arr_variant_selected = this.store_variant_group.reduce((_v, group) => [..._v, `${group.variant_group_id}-${group.variant_value_selected}`], [])
            this.product_detail.variants.forEach(v => {
                if (v.variant_attributes_id) {
                    if (this._verifyIncludesArr(v.variant_attributes_id, _arr_variant_selected)) {
                        _variant_selected = v;
                    }
                }
            });

            return _variant_selected;
        }

        _findVariantOutOfStock = (_arr_group_selected, group_need_find) => {
            const _arr_variant_out_of_stock = [];
            const _arr_variant_selected = [];

            _arr_group_selected.forEach(group => _arr_variant_selected.push(`${group.variant_group_id}-${group.variant_value_selected}`));

            this.product_detail.variants.forEach(v => {
                if (v.fulfillable) return;

                let _is_variant_include_selected_attr = false;

                if (v.variant_attributes_id) {
                    _is_variant_include_selected_attr = this._verifyIncludesArr(v.variant_attributes_id, _arr_variant_selected);
                }

                if (_is_variant_include_selected_attr) {
                    _arr_variant_out_of_stock.push(v.attributes.find(attr => attr.id === group_need_find.variant_group_id)?.value?.id);
                }
            })

            return _arr_variant_out_of_stock;
        }

        _addDisabledClassForVariantOption = (_arr_group_selected, variant_group) => {
            const _arr_variant_out_of_stock = this._findVariantOutOfStock(_arr_group_selected, variant_group);
            if (!_arr_variant_out_of_stock.length) return;

            const _group_not_select_option = this._queryProductVariantOptionElements(variant_group.group_element);
            this.store_variant_group.forEach(group => {
                if (group.variant_group_id === variant_group.variant_group_id) {
                    group.has_child_disabled = true;
                }
            });
            const _option_must_disable = Array.from(_group_not_select_option).filter(e => _arr_variant_out_of_stock.includes(parseInt(e.getAttribute('data-variant-value'))));
            _option_must_disable.forEach(e => e.classList.add('disabled'));
        }

        _updateProductInfoFollowVariantSelected = (variant) => {
            if (!variant) return;

            // Update product Image
            const product_image_el = this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_IMAGE
            );
            product_image_el.innerHTML = `<img src="${variant.images[0]}" alt="ProductImage">`;

            // Update product name
            const product_name_el = this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_NAME
            );
            product_name_el.innerHTML = `${variant.full_name}`;

            // Update product price
            const product_price_el = this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_PRICE
            );
            product_price_el.innerHTML = `${variant.price}`;

            // Update product listed price
            const product_listed_price_el = this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_LISTED_PRICE
            );
            product_listed_price_el.innerHTML = `${variant.listed_price}`;

            // Update product description
            const product_description_el = this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_DESCRIPTION
            );
            product_description_el.innerHTML = `${variant.description}`;

            // Rerender product button action
            this.element_content_builder._removeInvalidClass(this.select_product_el, 'invalid-product');
            this.element_content_builder._updateGroupButtonAttribute(variant);
        }

        _updateDisableSelectStatus = () => {
            let _arr_group_selected = [];
            let _group_not_select;

            this.store_variant_group.forEach(group => {
                if (group.variant_value_selected !== null) {
                    _arr_group_selected.push(group);
                } else {
                    _group_not_select = group;
                }
            });

            if (_arr_group_selected.length === this.store_variant_group.length - 1) {
                this._addDisabledClassForVariantOption(_arr_group_selected, _group_not_select);
            }

            if (_arr_group_selected.length === this.store_variant_group.length) {
                this.store_variant_group.forEach(group => {
                    _arr_group_selected = this.store_variant_group.filter(g => g.variant_group_id !== group.variant_group_id);
                    this._addDisabledClassForVariantOption(_arr_group_selected, group);
                });
                this._updateProductInfoFollowVariantSelected(this._findSelectedVariant());
            } else {
                this.element_content_builder._removeGroupButtonAttribute();
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

        _updateVariantSelectedValue = (group_variant_id, value_selected) => {
            this.store_variant_group.forEach(v => {
                if (v.variant_group_id === group_variant_id) {
                    v.variant_value_selected = value_selected;
                }
            });

            if (value_selected && !this.store_group_selected_id.includes(group_variant_id)) {
                this.store_group_selected_id.push(group_variant_id);
            }

            if (!value_selected) {
                this.store_group_selected_id = this.store_group_selected_id.filter(id => id !== group_variant_id);
            }

            if (this.store_group_selected_id.length >= this.store_variant_group.length - 1) {
                const _group_not_select = this.store_variant_group.find(group => group.variant_value_selected === null)?.group_element;
                const _group_has_child_disabled = this.store_variant_group.filter(group => group.has_child_disabled === true);

                if (_group_has_child_disabled.length) {
                    _group_has_child_disabled.forEach(group => {
                        this._removeElementClass(
                            Array.from(this._queryProductVariantOptionElements(group.group_element)),
                            'disabled'
                        )
                    })
                } else if (_group_not_select) {
                    this._removeElementClass(
                        Array.from(this._queryProductVariantOptionElements(_group_not_select)),
                        'disabled'
                    )
                }
            }
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

        handleSelectEvent = () => {
            const arr_group_variant = this._queryProductVariantGroupElements();

            arr_group_variant.forEach(group_el => {
                const _group_id = parseInt(group_el.getAttribute('data-variant'))
                this._addSelectVariantEvent(group_el, _group_id);
                this.store_variant_group.push({
                    group_element: group_el,
                    variant_group_id: _group_id,
                    variant_value_selected: null,
                    has_child_disabled: false
                });
            })
        }
    }

    class GroupQuantityButtonAction {
        element_content_builder;
        increase_btn;
        decrease_btn;
        add_to_cart_btn;
        checkout_btn;
        quantity_element;
        select_product_el;

        constructor(content_builder, select_product_el) {
            const self = this;
            self.element_content_builder = content_builder;
            self.select_product_el = select_product_el;
            self.decrease_btn = self.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_QUANTITY_DECREASE
            );
            self.increase_btn = self.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_QUANTITY_INCREASE
            );
            self.quantity_element = self.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_QUANTITY_VALUE
            );
            self.add_to_cart_btn = self.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_ACTION,
                EnumPDElementAttributeValue.ADD_TO_CART
            );
            self.checkout_btn = self.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_ACTION,
                EnumPDElementAttributeValue.CHECKOUT
            );
        }

        _addIncreaseProductQuantityEvent = (total_quantity) => {
            const _eventHandler = () => {
                if (!this.add_to_cart_btn.getAttribute(EnumElementAttributeName.DATA_SKU)) {
                    this.element_content_builder._addInvalidClass(this.select_product_el, 'invalid-product');
                    this.element_content_builder._scrollToElement(this.select_product_el);
                    return;
                }

                const _quantity_v = parseInt(this.quantity_element.innerHTML);

                if (_quantity_v >= total_quantity) return;

                this.quantity_element.innerHTML = _quantity_v + 1;
            }

            this.increase_btn.addEventListener('click', _eventHandler);
        }

        _addDecreaseProductQuantityEvent = () => {
            const _eventHandler = () => {
                if (!this.add_to_cart_btn.getAttribute(EnumElementAttributeName.DATA_SKU)) {
                    this.element_content_builder._addInvalidClass(this.select_product_el, 'invalid-product');
                    this.element_content_builder._scrollToElement(this.select_product_el);
                    return;
                }

                const _quantity_v = parseInt(this.quantity_element.innerHTML);

                if (_quantity_v < 2) return;

                this.quantity_element.innerHTML = _quantity_v - 1;
            }

            this.decrease_btn.addEventListener('click', _eventHandler);
        }

        _addProductAddToCartAndCheckoutBtnEvent = () => {
            const _eventHandler = () => {
                if (!this.add_to_cart_btn.getAttribute(EnumElementAttributeName.DATA_SKU)) {
                    this.element_content_builder._addInvalidClass(this.select_product_el, 'invalid-product');
                    this.element_content_builder._scrollToElement(this.select_product_el);
                }
            }

            this.add_to_cart_btn.addEventListener('click', _eventHandler);
            this.checkout_btn.addEventListener('click', _eventHandler);
        }

        addGroupProductQuantityEvent = (total_quantity) => {
            this._addIncreaseProductQuantityEvent(total_quantity);
            this._addDecreaseProductQuantityEvent();
            this._addProductAddToCartAndCheckoutBtnEvent();
        }
    }

    class ProductDetail {
        data_service = new DataService();
        content_builder = new ElementContentBuilder();
        select_variant_button = null;
        group_quantity_button = null;
        product_wrapper_innerHtml = '';

        constructor() {
        }

        _addSkeletonLoading = () => {
            this.product_wrapper_innerHtml = this.content_builder.product_wrapper_el.innerHTML;
            this.content_builder.product_wrapper_el.innerHTML = this.content_builder._productSkeletonLoadingBuilder();
        }

        _addVariantAttributesId = (product) => {
            if (!product || !product.variants || !product.variants.length) {
                return product;
            }

            product.variants.forEach(v => {
                let _attr_id = [];
                if (v.attributes && v.attributes.length) {
                    v.attributes.forEach(attr => {
                        _attr_id.push(`${attr.id}-${attr.value.id}`);
                    })
                }
                v.variant_attributes_id = _attr_id;
            })

            return product;
        }

        _getProductDetailById = async (product_id) => {
            const response = await this.data_service.getProductDetailById(product_id);
            const product_detail = this._addVariantAttributesId(JSON.parse(response));

            if (!product_detail) {
                return;
            }

            this.content_builder.product_wrapper_el.innerHTML = this.product_wrapper_innerHtml;

            // Generate product detail element content
            const select_product_el = this.content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_SELECT_VARIANT
            );

            if (product_detail.options && product_detail.options.length) {
                select_product_el.innerHTML = this.content_builder._productSelectProductBuilder(product_detail.options);
            }

            // Handle select variant event
            this.group_quantity_button = new GroupQuantityButtonAction(this.content_builder, select_product_el);

            if (product_detail.options && product_detail.options.length) {
                this.select_variant_button = new SelectVariantButton(
                    product_detail,
                    this.content_builder,
                    this.group_quantity_button,
                    select_product_el
                );
                this.select_variant_button.handleSelectEvent();
            }
            this.group_quantity_button.addGroupProductQuantityEvent(product_detail.fulfillable);
            this.content_builder._addBackToPreviousButtonAction();
        }

        initPage = () => {
            this._addSkeletonLoading();
            const _arr_url_split = window.location.href.split('.');
            const _product_id = _arr_url_split[_arr_url_split.length - 1];
            this._getProductDetailById(215).then();
        }
    }

    window.ProductDetail = ProductDetail;
}(window))

const product_detail_el = new ProductDetail();
product_detail_el.initPage();
