'use strict';

const API_URL = {
    PRODUCT_DETAIL: '/api/v1/products/',
};

const EnumLandingBlockElementName = {
    // Landing All Products
    LANDING_PRODUCT_DETAIL: 'OMP_PRODUCT_DETAIL'
};

const DefaultVNLocale = {
    VN_ICU_LOCALE: 'vi-VN',
    VN_CURRENCY_CODE: 'VND'
}

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

const EnumNotifyType = {
    SELECT_PRODUCT: 1,
    ADDED_TO_CART: 2
};

(function (window) {
    class GlobalEvent {
        current_carousel_index = 0;

        constructor() {
        }

        _handleMoveToNextCarousel = (carousel_item_el, prev_btn, next_btn) => {
            if (this.current_carousel_index === carousel_item_el.length - 2) next_btn.classList.remove('show');
            if (this.current_carousel_index === 0) prev_btn.classList.add('show');

            carousel_item_el[this.current_carousel_index].classList.add('prev');
            carousel_item_el[this.current_carousel_index].classList.remove('active');

            this.current_carousel_index++;

            carousel_item_el[this.current_carousel_index].classList.add('active');
            carousel_item_el[this.current_carousel_index].classList.remove('next');

            if (this.current_carousel_index < carousel_item_el.length - 1) {
                carousel_item_el[this.current_carousel_index + 1].classList.add('next');
            }
        }

        _handleMoveToPrevCarousel = (carousel_item_el, prev_btn, next_btn) => {
            if (this.current_carousel_index === 1) prev_btn.classList.remove('show');
            if (this.current_carousel_index === carousel_item_el.length - 1) next_btn.classList.add('show');

            carousel_item_el[this.current_carousel_index].classList.add('prev');
            carousel_item_el[this.current_carousel_index].classList.remove('active');

            this.current_carousel_index--;

            carousel_item_el[this.current_carousel_index].classList.add('active');
            carousel_item_el[this.current_carousel_index].classList.remove('next');

            if (this.current_carousel_index === 1) {
                carousel_item_el[0].classList.add('next');
            }
        }

        _addScrollEvent = (scroll_element, call_back) => {
            let _last_scroll_top = 0;
            const _eventHandler = (e) => {
                const _el_scroll = e.target.scrollingElement;
                call_back(e.target.scrollingElement);

                _last_scroll_top = _el_scroll.scrollTop
            }

            scroll_element.addEventListener('scroll', _eventHandler);
        }

        _addCarouselTouchEvent = (carousel_el) => {
            let touch_move_x;
            let touch_start_x;
            const carousel_item_el = carousel_el.querySelectorAll('img[class^="ompi-carousel--image"]');
            const prev_btn = carousel_el.querySelectorAll('div[class^="ompi-carousel--prev-btn"]')[0];
            const next_btn = carousel_el.querySelectorAll('div[class^="ompi-carousel--next-btn"]')[0];

            if (!carousel_item_el.length) return;

            const _touchEndEventHandler = () => {
                const long_move = touch_start_x - touch_move_x;

                if (!touch_move_x || Math.abs(long_move) < 20) return;

                if (long_move > 0 && this.current_carousel_index < carousel_item_el.length - 1) {
                    this._handleMoveToNextCarousel(carousel_item_el, prev_btn, next_btn);
                } else if (long_move < 0 && this.current_carousel_index > 0) {
                    this._handleMoveToPrevCarousel(carousel_item_el, prev_btn, next_btn);
                }

                touch_move_x = 0;
            };

            carousel_el.addEventListener('touchstart', (e) => touch_start_x = e.touches[0].pageX);
            carousel_el.addEventListener('touchmove', (e) => touch_move_x = e.touches[0].pageX);
            carousel_el.addEventListener('touchend', _touchEndEventHandler);
            this._addCarouselClickEvent(carousel_el, carousel_item_el, prev_btn, next_btn);
        }

        _addCarouselClickEvent = (carousel_el, carousel_item_el, prev_btn, next_btn) => {
            const _prevBtnEventHandler = () => {
                if (this.current_carousel_index === 0) return;


                this._handleMoveToPrevCarousel(carousel_item_el, prev_btn, next_btn);
            }

            const _nextBtnEventHandler = () => {
                if (this.current_carousel_index === carousel_item_el.length - 1) return;

                this._handleMoveToNextCarousel(carousel_item_el, prev_btn, next_btn);
            }

            prev_btn.addEventListener('click', _prevBtnEventHandler);
            next_btn.addEventListener('click', _nextBtnEventHandler);
        }
    }

    class DataService {
        landing_token;
        api_domain;

        constructor(landing_token) {
            const _this = this;
            _this.landing_token = `Landing ${landing_token}`;
            _this._getDomain();
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
            const request_url = `${this.api_domain}${API_URL.PRODUCT_DETAIL}${product_id}/`;
            return await this._createGetRequest(request_url);
        }

        _getDomain = () => {
            const _env = document.querySelectorAll('meta[name="environment"]')[0];
            this.api_domain = _env.getAttribute('content') === 'production' ? 'https://omipage.com' : 'https://dev.omipage.com';
        }
    }

    class ElementContentBuilder {
        loading_element = null;
        product_wrapper_el = null;
        notify_backdrop_el = null;
        notify_content_el = null;

        constructor() {
            const _this = this;
            _this.product_wrapper_el = document.getElementById(EnumLandingBlockElementName.LANDING_PRODUCT_DETAIL);
            _this.loading_element = document.getElementsByClassName('omp-loading')[0];
            _this.notify_backdrop_el = document.getElementsByClassName('omp-notify--backdrop')[0];
            _this.notify_content_el = document.getElementsByClassName('omp-notify-content')[0];
        }

        formatCurrency = (country_locale, currency_code, value) => {
            return new Intl.NumberFormat(country_locale, {style: 'currency', currency: currency_code}).format(value);
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

        _openNotify = (notify_type) => {
            let notify_content = '';
            switch (notify_type) {
                case EnumNotifyType.SELECT_PRODUCT:
                    notify_content = `<p><i class="bi bi-info-circle"></i></p><p>Vui lòng chọn mẫu mã.</p>`
                    break;
                case EnumNotifyType.ADDED_TO_CART:
                    notify_content = `<p><i class="bi bi-check2"></i></p><p>Đã thêm vào giỏ hàng.</p>`
                    break;
            }

            this.notify_content_el.innerHTML = notify_content;

            if (!this.notify_backdrop_el.classList.contains('show')) {
                this.notify_backdrop_el.classList.add('show');
            }

            if (!this.notify_content_el.classList.contains('show')) {
                this.notify_content_el.classList.add('show');
            }

            setTimeout(() => {
                if (this.notify_backdrop_el.classList.contains('show')) {
                    this.notify_backdrop_el.classList.remove('show');
                }

                if (this.notify_content_el.classList.contains('show')) {
                    this.notify_content_el.classList.remove('show');
                }
            }, 1200);
        }

        _queryElementsByAttribute = (parent_node, attribute_name, attribute_value) => {
            return parent_node.querySelectorAll(`[${attribute_name}=${attribute_value}]`)[0];
        }

        _queryElementsByClass = (parent_node, class_name, element_tag) => {
            const _tag = element_tag || 'div';
            return parent_node.querySelectorAll(`${_tag}[class=${class_name}]`)[0];
        }

        _queryElementsLikeClassName = (parent_node, class_name) => {
            return parent_node.querySelectorAll(`div[class^=${class_name}]`);
        }

        _productImageCarouselBuilder = (arr_images) => {
            let innerHtml = '';

            arr_images.forEach((img, index) => {
                switch (index) {
                    case 0:
                        innerHtml += `
                            <img class="ompi-carousel--image active" src="${img.url}" alt="${img.url}">
                        `;
                        break;
                    case 1:
                        innerHtml += `
                            <img class="ompi-carousel--image next" src="${img.url}" alt="${img.url}">
                        `;
                        break;
                    default:
                        innerHtml += `
                            <img class="ompi-carousel--image" src="${img.url}" alt="${img.url}">
                        `;
                        break;
                }
            })

            innerHtml += `
                <div class="ompi-carousel--prev-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                </div>
                <div class="ompi-carousel--next-btn show">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </div>
            `;

            return innerHtml;
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
                btn_el.setAttribute(EnumElementAttributeName.DATA_IMAGE, product.images[0]?.url || '');
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
            window.scrollTo({
                top: _el_screen_position.top,
                behavior: 'smooth'
            });
        }

        _addBackToPreviousButtonAction = () => {
            const _back_btn = this._queryElementsByClass(document, 'header-back-icon');

            _back_btn.addEventListener('click', () => {
                if (document.referrer) {
                    window.history.back();
                } else {
                    window.location.href = window.location.origin;
                }
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
        page_configs;

        constructor(product, content_builder, group_quantity, select_product_el, page_configs) {
            const _this = this;
            _this.product_detail = product;
            _this.element_content_builder = content_builder;
            _this.group_quantity_button = group_quantity;
            _this.select_product_el = select_product_el;
            _this.page_configs = page_configs;
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
            const _country_locale = this.page_configs.locale || DefaultVNLocale.VN_ICU_LOCALE;
            const _currency_code = this.page_configs.currency || DefaultVNLocale.VN_CURRENCY_CODE;

            if (variant.images.length) {
                // Update product Image
                const product_image_el = this.element_content_builder._queryElementsByAttribute(
                    document,
                    EnumElementAttributeName.DATA_OMP_ELEMENT,
                    EnumPDElementAttributeValue.PRODUCT_IMAGE
                );
                product_image_el.innerHTML = `<img src="${variant.images[0].url}" alt="ProductImage">`;
            }

            // Update product name
            const product_name_el = this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_NAME
            );
            product_name_el.innerHTML = `${variant.name}`;

            // Update product price
            const product_price_el = this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_PRICE
            );
            product_price_el.innerHTML = `${this.element_content_builder.formatCurrency(_country_locale, _currency_code, variant.price)}`;

            // Update product listed price
            const product_listed_price_el = this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_LISTED_PRICE
            );
            product_listed_price_el.innerHTML = `${this.element_content_builder.formatCurrency(_country_locale, _currency_code, variant.listed_price)}`;

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
            const _this = this;
            _this.element_content_builder = content_builder;
            _this.select_product_el = select_product_el;
            _this.decrease_btn = _this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_QUANTITY_DECREASE
            );
            _this.increase_btn = _this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_QUANTITY_INCREASE
            );
            _this.quantity_element = _this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_QUANTITY_VALUE
            );
            _this.add_to_cart_btn = _this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_ACTION,
                EnumPDElementAttributeValue.ADD_TO_CART
            );
            _this.checkout_btn = _this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_ACTION,
                EnumPDElementAttributeValue.CHECKOUT
            );
        }

        _actionForInvalidProduct = () => {
            this.element_content_builder._openNotify(EnumNotifyType.SELECT_PRODUCT);
            this.element_content_builder._addInvalidClass(this.select_product_el, 'invalid-product');
            this.element_content_builder._scrollToElement(this.select_product_el);
        }

        _addIncreaseProductQuantityEvent = (total_quantity) => {
            const _eventHandler = () => {
                if (!this.add_to_cart_btn.getAttribute(EnumElementAttributeName.DATA_SKU)) {
                    this._actionForInvalidProduct();
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
                    this._actionForInvalidProduct();
                    return;
                }

                const _quantity_v = parseInt(this.quantity_element.innerHTML);

                if (_quantity_v < 2) return;

                this.quantity_element.innerHTML = _quantity_v - 1;
            }

            this.decrease_btn.addEventListener('click', _eventHandler);
        }

        _addProductAddToCartAndCheckoutBtnEvent = () => {
            const _eventHandler = (e) => {
                if (!this.add_to_cart_btn.getAttribute(EnumElementAttributeName.DATA_SKU)) {
                    this._actionForInvalidProduct();
                    return;
                }

                if (e.target.getAttribute(EnumElementAttributeName.DATA_ACTION) === EnumPDElementAttributeValue.ADD_TO_CART) {
                    this.element_content_builder._openNotify(EnumNotifyType.ADDED_TO_CART);
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
        global_event = new GlobalEvent();
        data_service = null;
        content_builder = new ElementContentBuilder();
        select_variant_button = null;
        group_quantity_button = null;
        page_els = null;
        page_configs = null;

        constructor() {
            const _this = this;
            _this.page_els = window.page_elements;
            _this.page_configs = window.page_configs;
            _this.data_service = new DataService(_this.page_configs?.access_token || '');
        }

        _listenScrollEvent = () => {
            window.scrollTo({top: 0, behavior: 'smooth'});

            const _header_el = this.content_builder._queryElementsByClass(document, 'omp-landing-detail--header');
            const _back_icon_el = this.content_builder._queryElementsByClass(_header_el, 'header-back-icon');
            const _cart_icon_el = this.content_builder._queryElementsByClass(_header_el, 'header-cart-icon');
            const _header_title = this.content_builder._queryElementsByClass(_header_el, 'header-title', 'p');

            if (_header_el?.style) _header_el.removeAttribute('style');
            if (_back_icon_el?.style) _header_el.removeAttribute('style');
            if (_cart_icon_el?.style) _header_el.removeAttribute('style');
            if (_header_title?.style) _header_el.removeAttribute('style');

            const _handleEvent = (e) => {
                if (e.scrollTop < 350) {
                    _header_el.style.backgroundColor = `rgba(255, 255, 255, ${e.scrollTop / 240})`;
                    _header_el.style.boxShadow = `0 3px 8px 0 rgba(159, 168, 184, ${e.scrollTop / 1000})`;
                    _header_title.style.opacity = `${e.scrollTop / 240}`;

                    if (e.scrollTop < 120) {
                        _back_icon_el.style.backgroundColor = `rgba(0, 0, 0, ${0.25 - (e.scrollTop / 1000)})`;
                        _back_icon_el.style.color = '#ffffff';
                        _cart_icon_el.style.backgroundColor = `rgba(0, 0, 0, ${0.25 - (e.scrollTop / 1000)})`;
                        _cart_icon_el.style.color = '#ffffff';
                    } else {
                        _back_icon_el.style.backgroundColor = `rgba(255, 255, 255, ${e.scrollTop / 240})`;
                        _back_icon_el.style.color = `rgba(253, 126, 20, ${e.scrollTop / 240})`;
                        _cart_icon_el.style.backgroundColor = `rgba(255, 255, 255, ${e.scrollTop / 240})`;
                        _cart_icon_el.style.color = `rgba(253, 126, 20, ${e.scrollTop / 240})`;
                    }
                }

            }

            this.global_event._addScrollEvent(document, _handleEvent);
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

        _generateProductImageCarousel = (arr_images) => {
            const product_image_el = this.content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_IMAGE
            );

            product_image_el.innerHTML = this.content_builder._productImageCarouselBuilder(arr_images);
            this.global_event._addCarouselTouchEvent(product_image_el);
        }

        _generateProductSelectVariant = (product_detail) => {
            const select_product_el = this.content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_SELECT_VARIANT
            );

            if (product_detail.options && product_detail.options.length) {
                select_product_el.innerHTML = this.content_builder._productSelectProductBuilder(product_detail.options);
            } else {
                select_product_el.remove();
            }

            // Handle select variant event
            this.group_quantity_button = new GroupQuantityButtonAction(this.content_builder, select_product_el);

            if (product_detail.options && product_detail.options.length) {
                this.select_variant_button = new SelectVariantButton(
                    product_detail,
                    this.content_builder,
                    this.group_quantity_button,
                    select_product_el,
                    this.page_configs
                );
                this.select_variant_button.handleSelectEvent();
            } else {
                this.content_builder._updateGroupButtonAttribute(product_detail);
            }
        }

        _getProductDetailById = async (product_id) => {
            const response = await this.data_service.getProductDetailById(product_id);
            const product_detail = this._addVariantAttributesId(JSON.parse(response));

            if (!product_detail) {
                return;
            }

            // Generate product detail element content
            this._generateProductSelectVariant(product_detail);

            // Generate product image carousel
            this._generateProductImageCarousel(product_detail.images);

            this.group_quantity_button.addGroupProductQuantityEvent(product_detail.fulfillable);
            this.content_builder._addBackToPreviousButtonAction();
            this._listenScrollEvent();
            this.content_builder._hideLoading();
        }

        initPage = () => {
            this.content_builder._showLoading();
            const _arr_url_split = window.location.href.split('.');
            const _product_id = _arr_url_split[_arr_url_split.length - 1];
            this._getProductDetailById(327).then();
        }
    }

    window.ProductDetail = ProductDetail;
}(window))

const product_detail_el = new ProductDetail();
product_detail_el.initPage();
