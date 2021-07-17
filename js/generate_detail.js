'use strict';

const API_URL = {
    PRODUCT_DETAIL: '/api/v1/products/',
    PRODUCT_FLASH_SALE: '/flash-sales/',
    VARIANT_PRICING: '/variant/pricing'
};

const EnumLandingBlockElementName = {
    // Landing All Products
    LANDING_PRODUCT_DETAIL: 'OMP_PRODUCT_DETAIL'
};

const DefaultVNLocale = {
    VN_ICU_LOCALE: 'vi-VN',
    VN_CURRENCY_CODE: 'VND'
};

const ELocaleByCurrencyCode = {
    VND: 'vi-VN',
    USD: 'en-US',
    THB: 'th-TH',
    IDR: 'id-ID',
    PHP: 'en-PH',
    MYR: 'my-MM',
    CNY: 'bo-CN'
};

const LocalStorageTitle = {
    CART_LOCAL_STORAGE_TITLE: 'omp_cart',
    CART_ID_STORAGE_TITLE: 'omp_cart_id',
    ACCESS_TOKEN_STORAGE_TITLE: 'omp_key',
    LANDING_STORAGE_TITLE: 'omp_title',
    USER_SETTING_STORAGE_TITLE: 'omp_setting',
    UTM_TAG_STORAGE_TITLE: 'utm_tag',
    REFERRAL_HOST_STORAGE_TITLE: 'referral_host',
    REFERRAL_URL_STORAGE_TITLE: 'referral_url'
};

const EnumElementAttributeName = {
    DATA_OMP_ELEMENT: 'data-omp-element',
    DATA_ACTION: 'data-action',
    DATA_SKU: 'data-sku',
    DATA_PRODUCT_ID: 'data-product-id',
    DATA_QUANTITY: 'data-quantity',
    DATA_NAME: 'data-name',
    DATA_PRICE: 'data-price',
    DATA_DISCOUNTED_PRICE: 'data-discounted-price',
    DATA_IMAGE: 'data-image',
    DATA_BUY_NOW: 'data-buy-now'
};

const EnumPDElementAttributeValue = {
    PRODUCT_FLASH_SALE: 'product-flash-sale',
    PRODUCT_FS_UPCOMING: 'product-fs-upcoming',
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

const EnumFlashSaleType = {
    ALL: 'all',
    PROCESSING: 'processing',
    UPCOMING: 'upcoming'
};

(function (window) {
    class GlobalEvent {
        current_carousel_index = 0;
        content_builder

        constructor(_content_builder) {
            const _this = this;
            _this.content_builder = _content_builder;
        }

        addCountDownEvent = (countable_time) => {
            const _day_by_seconds = 24 * 60 * 60 * 1000;
            const _hour_by_seconds = 60 * 60 * 1000;
            const _minute_by_seconds = 60 * 1000;
            let _interval;

            const _hourEl = document.getElementById('fsCountdownHours');
            const _minuteEl = document.getElementById('fsCountdownMinutes');
            const _secondEl = document.getElementById('fsCountdownSeconds');

            const _timerRunning = () => {
                const _now_time = (new Date()).getTime();
                const _different_time = countable_time * 1000 - _now_time;

                if (_different_time < 0) {
                    clearInterval(_interval);
                    const _block_countdown_el = this.content_builder._queryElementsByClass('div', 'block-countdown');
                    _block_countdown_el.innerHTML = '';
                    return
                }

                const hours = Math.floor((_different_time % _day_by_seconds) / _hour_by_seconds);
                const minutes = Math.floor((_different_time % _hour_by_seconds) / _minute_by_seconds);
                const seconds = Math.round(_different_time % _minute_by_seconds / 1000);

                _hourEl.innerHTML = hours >= 10 ? hours.toString() : `0${hours.toString()}`;
                _minuteEl.innerHTML = minutes >= 10 ? minutes.toString() : `0${minutes.toString()}`;
                _secondEl.innerHTML = seconds >= 10 ? seconds.toString() : `0${seconds.toString()}`;
            }

            _timerRunning();
            _interval = setInterval(_timerRunning, 1000);
        }

        _handleMoveToNextCarousel = (carousel_item_els) => {
            let next_index;

            if (this.current_carousel_index !== 0) {
                carousel_item_els[this.current_carousel_index - 1].classList.remove('prev');
            } else {
                carousel_item_els[carousel_item_els.length - 1].classList.remove('prev');
            }

            carousel_item_els[this.current_carousel_index].classList.add('prev');
            carousel_item_els[this.current_carousel_index].classList.remove('active');

            if (this.current_carousel_index === carousel_item_els.length - 1) {
                this.current_carousel_index = 0;
            } else {
                this.current_carousel_index++;
            }

            next_index = this.current_carousel_index === carousel_item_els.length - 1 ? 0 : this.current_carousel_index + 1;

            carousel_item_els[this.current_carousel_index].classList.add('active');
            carousel_item_els[this.current_carousel_index].classList.remove('next');
            carousel_item_els[next_index].classList.add('next');
        }

        _handleMoveToPrevCarousel = (carousel_item_els) => {
            let next_index;

            if (this.current_carousel_index !== carousel_item_els.length - 1) {
                carousel_item_els[this.current_carousel_index + 1].classList.remove('prev');
            } else {
                carousel_item_els[0].classList.remove('prev');
            }

            carousel_item_els[this.current_carousel_index].classList.add('prev');
            carousel_item_els[this.current_carousel_index].classList.remove('active');

            if (this.current_carousel_index === 0) {
                this.current_carousel_index = carousel_item_els.length - 1;
            } else {
                this.current_carousel_index--;
            }

            next_index = this.current_carousel_index === 0 ? carousel_item_els.length - 1 : this.current_carousel_index - 1;

            carousel_item_els[this.current_carousel_index].classList.add('active');
            carousel_item_els[this.current_carousel_index].classList.remove('next');
            carousel_item_els[next_index].classList.add('next');
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

                if (long_move > 0) {
                    this._handleMoveToNextCarousel(carousel_item_el);
                } else {
                    this._handleMoveToPrevCarousel(carousel_item_el);
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
                this._handleMoveToPrevCarousel(carousel_item_el);
            }

            const _nextBtnEventHandler = () => {
                this._handleMoveToNextCarousel(carousel_item_el);
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

        _createGetRequest = async (url) => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': this.landing_token
                    }
                });

                return response.json();
            } catch (error) {
                return error.json();
            }
        }

        _createMultiRequest = async (urls) => {
            try {
                return Promise.all(urls.map(url => fetch(
                    url,
                    {
                        method: 'GET',
                        headers: {'Authorization': this.landing_token}
                    }
                ).then(res => res.json(), error => error.json())));
            } catch (error) {
                return error.json();
            }
        }

        getProductDetailById = async (product_id) => {
            const request_urls = [
                `${this.api_domain}${API_URL.PRODUCT_DETAIL}${product_id}/`,
                `${this.api_domain}${API_URL.PRODUCT_DETAIL}${product_id}${API_URL.PRODUCT_FLASH_SALE}`
            ];
            return await this._createMultiRequest(request_urls);
        }

        getVariantPricingById = async (variant_id) => {
            return await this._createGetRequest(`${this.api_domain}${API_URL.PRODUCT_DETAIL}${variant_id}${API_URL.VARIANT_PRICING}`)
        }

        _getDomain = () => {
            const _env = document.querySelectorAll('meta[name="environment"]')[0];
            this.api_domain = _env.getAttribute('content') === 'production' ? 'https://s.omisocial.com' : 'https://dev.omisocial.com';
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

        _generateFlashSaleCountdown = (fs_text) => {
            return `
                <div class="flash-sale--countdown">
                    <span id="fsStatusText">${fs_text}</span>
                    <div class="block-countdown">
                        <div id="fsCountdownHours">
                            00
                        </div>
                        <div class="colon-space">:</div>
                        <div id="fsCountdownMinutes">
                            00
                        </div>
                        <div class="colon-space">:</div>
                        <div id="fsCountdownSeconds">
                            00
                        </div>
                    </div>
                </div>
            `
        }

        _updateFlashSaleInformation = (new_info, country_locale, currency_code) => {
            const flash_sale_el = this._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                EnumPDElementAttributeValue.PRODUCT_FLASH_SALE
            );

            const flash_sale_price_el = this._queryElementsByClass(flash_sale_el, 'flash-sale--price');
            flash_sale_price_el.innerHTML = this._generateFlashSalePrice(
                this.formatCurrency(country_locale, currency_code, new_info.discounted_amount),
                this.formatCurrency(country_locale, currency_code, new_info.before_discount_amount)
            );

            const flash_sale_sold_el = this._queryElementsByClass(flash_sale_el, 'flash-sale--sold');
            flash_sale_sold_el.innerHTML = `Đã bán ${new_info.flash_sale.sold_count}/${new_info.flash_sale.max_sellable}`
        }

        _generateFlashSalePrice = (discounted_price, origin_price) => {
            return `${discounted_price} <small style="margin-left: 5px;text-decoration: line-through;">${origin_price}</small>`
        }

        _productFlashSaleBuilder = (product_flash_sale, page_configs) => {
            const _country_locale = page_configs.locale;
            const _currency_code = page_configs.currency;
            const _origin_price = this.formatCurrency(_country_locale, _currency_code, product_flash_sale.before_discount_amount);
            const _flash_sale_price = this.formatCurrency(_country_locale, _currency_code, product_flash_sale.discounted_amount);
            return `
                <div class="omp-container">
                    <div class="flash-sale--banner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-lightning-fill" viewBox="0 0 16 16">
                            <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z"/>
                        </svg>
                        <span>Flash Sale</span>
                    </div>
                    <div class="flash-sale--sold">
                        Đã bán 0
                    </div>
                </div>
                <div class="omp-container">
                    <div class="flash-sale--price">
                        ${this._generateFlashSalePrice(_flash_sale_price, _origin_price)}
                    </div>
                    ${this._generateFlashSaleCountdown('Kết thúc trong')}
                </div>
            `
        }

        _productFlashSaleUpcomingBuilder = () => {
            return `
                <div class="omp-container">
                    <div class="flash-sale--banner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-lightning-fill" viewBox="0 0 16 16">
                            <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z"/>
                        </svg>
                        <span>Flash Sale</span>
                    </div>
                    ${this._generateFlashSaleCountdown('Bắt đầu trong')}
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </div>
                </div>
            `
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
                <div class="ompi-carousel--prev-btn show">
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
                btn_el.setAttribute(EnumElementAttributeName.DATA_PRODUCT_ID, product.id);
                btn_el.setAttribute(EnumElementAttributeName.DATA_SKU, product.sku);
                btn_el.setAttribute(EnumElementAttributeName.DATA_QUANTITY, 1);
                btn_el.setAttribute(EnumElementAttributeName.DATA_NAME, product.name);
                btn_el.setAttribute(EnumElementAttributeName.DATA_PRICE, product.listed_price);
                btn_el.setAttribute(EnumElementAttributeName.DATA_DISCOUNTED_PRICE, product.discounted_price || product.price);
                btn_el.setAttribute(EnumElementAttributeName.DATA_IMAGE, product.images[0]?.url || '');
            }

            const _add_to_cart_btn = this._queryElementsByAttribute(document, EnumElementAttributeName.DATA_ACTION, EnumPDElementAttributeValue.ADD_TO_CART);
            _updateAttributeValue(_add_to_cart_btn);

            const _buy_now_btn = this._queryElementsByAttribute(document, EnumElementAttributeName.DATA_ACTION, EnumPDElementAttributeValue.CHECKOUT);
            _updateAttributeValue(_buy_now_btn);
        }

        _removeGroupButtonAttribute = () => {
            const _removeAttribute = (btn_el) => {
                btn_el.removeAttribute(EnumElementAttributeName.DATA_PRODUCT_ID);
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
        data_service;

        constructor(product, content_builder, group_quantity, select_product_el, page_configs, data_service) {
            const _this = this;
            _this.product_detail = product;
            _this.element_content_builder = content_builder;
            _this.group_quantity_button = group_quantity;
            _this.select_product_el = select_product_el;
            _this.page_configs = page_configs;
            _this.data_service = data_service;
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

        _updateOMPElementInnerHTML = (element_attribute_value, inner_content) => {
            const _element = this.element_content_builder._queryElementsByAttribute(
                document,
                EnumElementAttributeName.DATA_OMP_ELEMENT,
                element_attribute_value
            );
            _element.innerHTML = inner_content;
        }

        _updateProductInfoFollowVariantSelected = async (variant) => {
            if (!variant) return;
            const _country_locale = this.page_configs.locale;
            const _currency_code = this.page_configs.currency;

            const variant_pricing = await this.data_service.getVariantPricingById(variant.id);
            if (variant_pricing.flash_sale) {
                this.element_content_builder._updateFlashSaleInformation(
                    variant_pricing,
                    _country_locale,
                    _currency_code
                );
                variant.discounted_price = variant_pricing.discounted_amount
            } else {
                // Update product price
                this._updateOMPElementInnerHTML(
                    EnumPDElementAttributeValue.PRODUCT_PRICE,
                    `${this.element_content_builder.formatCurrency(_country_locale, _currency_code, variant.price)}`
                );
            }

            // Update product name
            this._updateOMPElementInnerHTML(EnumPDElementAttributeValue.PRODUCT_NAME, `${variant.name}`);

            // Update product listed price
            this._updateOMPElementInnerHTML(
                EnumPDElementAttributeValue.PRODUCT_LISTED_PRICE,
                `${this.element_content_builder.formatCurrency(_country_locale, _currency_code, variant.listed_price)}`
            );

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
                void this._updateProductInfoFollowVariantSelected(this._findSelectedVariant());
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
        data_service;
        increase_btn;
        decrease_btn;
        add_to_cart_btn;
        checkout_btn;
        quantity_element;
        select_product_el;

        constructor(content_builder, data_service, select_product_el) {
            const _this = this;
            _this.element_content_builder = content_builder;
            _this.data_service = data_service;
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
            const _quantity_warning_el = document.getElementById('quantityWarning');

            const _eventHandler = async () => {
                if (!this.add_to_cart_btn.getAttribute(EnumElementAttributeName.DATA_SKU)) {
                    this._actionForInvalidProduct();
                    return;
                }

                const _product_id = this.add_to_cart_btn.getAttribute(EnumElementAttributeName.DATA_PRODUCT_ID);
                const _variant_pricing = await this.data_service.getVariantPricingById(_product_id);

                const _quantity_v = parseInt(this.quantity_element.innerHTML);

                if (_variant_pricing?.flash_sale?.purchase_limit) {
                    if (_quantity_v === _variant_pricing?.flash_sale?.purchase_limit) {
                        _quantity_warning_el.innerHTML = `Số sản phẩm được áp dụng khuyến mại hiện tại đã đạt tới giới hạn. Nếu mua nhiều hơn, giá sản phẩm có thể sẽ thay đổi`;
                    }

                    if (_quantity_v > _variant_pricing?.flash_sale?.purchase_limit) {
                        _quantity_warning_el.innerHTML = `Giá sản phẩm đã thay đổi vì số lượng mua đã vượt quá tổng số sản phẩm được khuyến mại`;
                    }
                }

                if (_quantity_v >= total_quantity) return;

                this.quantity_element.innerHTML = _quantity_v + 1;
            }

            this.increase_btn.addEventListener('click', _eventHandler);
        }

        _addDecreaseProductQuantityEvent = () => {
            const _quantity_warning_el = document.getElementById('quantityWarning');

            const _eventHandler = async () => {
                if (!this.add_to_cart_btn.getAttribute(EnumElementAttributeName.DATA_SKU)) {
                    this._actionForInvalidProduct();
                    return;
                }

                const _product_id = this.add_to_cart_btn.getAttribute(EnumElementAttributeName.DATA_PRODUCT_ID);
                const _variant_pricing = await this.data_service.getVariantPricingById(_product_id);

                const _quantity_v = parseInt(this.quantity_element.innerHTML);

                if (_variant_pricing?.flash_sale?.purchase_limit) {
                    if (_quantity_v === _variant_pricing?.flash_sale?.purchase_limit) {
                        _quantity_warning_el.innerHTML = `Số sản phẩm được áp dụng khuyến mại hiện tại đã đạt tới giới hạn. Nếu mua nhiều hơn, giá sản phẩm có thể sẽ thay đổi`;
                    }

                    if (_quantity_v < _variant_pricing?.flash_sale?.purchase_limit) {
                        _quantity_warning_el.innerHTML = '';
                    }
                }

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
        data_service = null;
        content_builder = new ElementContentBuilder();
        global_event = new GlobalEvent(this.content_builder);
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
            this.group_quantity_button = new GroupQuantityButtonAction(this.content_builder, this.data_service, select_product_el);

            if (product_detail.options && product_detail.options.length) {
                this.select_variant_button = new SelectVariantButton(
                    product_detail,
                    this.content_builder,
                    this.group_quantity_button,
                    select_product_el,
                    this.page_configs,
                    this.data_service
                );
                this.select_variant_button.handleSelectEvent();
            } else {
                this.content_builder._updateGroupButtonAttribute(product_detail);
            }
        }

        _handleGenerateFlashSaleForSingleProduct = (product_flash_sale) => {
            if (product_flash_sale.flash_sale) {
                const flash_sale_el = this.content_builder._queryElementsByAttribute(
                    document,
                    EnumElementAttributeName.DATA_OMP_ELEMENT,
                    EnumPDElementAttributeValue.PRODUCT_FLASH_SALE
                );

                if (!flash_sale_el) return;

                flash_sale_el.innerHTML = this.content_builder._productFlashSaleBuilder(product_flash_sale, this.page_configs);
                flash_sale_el.setAttribute('style', 'display: block');
                this.content_builder._queryElementsByClass(document, 'price-sale', 'h5')?.setAttribute('style', 'display: none');
                this.global_event.addCountDownEvent(product_flash_sale.flash_sale.end_time);
                return;
            }

            if (product_flash_sale.upcoming_flash_sale) {
                const fs_upcoming_el = this.content_builder._queryElementsByAttribute(
                    document,
                    EnumElementAttributeName.DATA_OMP_ELEMENT,
                    EnumPDElementAttributeValue.PRODUCT_FS_UPCOMING
                );

                if (!fs_upcoming_el) return;

                fs_upcoming_el.innerHTML = this.content_builder._productFlashSaleUpcomingBuilder();
                fs_upcoming_el.setAttribute('style', 'display: block');
                this.global_event.addCountDownEvent(product_flash_sale.upcoming_flash_sale.start_time);
            }
        }

        _generateProductFlashSale = (product_flash_sale) => {
            if (!product_flash_sale.flash_sale && !product_flash_sale.upcoming_flash_sale) return;

            this._handleGenerateFlashSaleForSingleProduct(product_flash_sale);
        }

        _updateCartCount = () => {
            const _cart_el = this.content_builder._queryElementsByClass(document, 'cart-item-count', 'span');
            const _local_cart = localStorage.getItem(LocalStorageTitle.CART_LOCAL_STORAGE_TITLE)

            _cart_el.innerHTML = _local_cart ? JSON.parse(_local_cart).length : 0;
        }

        _getProductDetailById = async (product_id) => {
            const responses = await this.data_service.getProductDetailById(product_id);
            let product_detail;
            let product_flash_sale;

            if (responses.length) {
                product_detail = this._addVariantAttributesId(responses[0]);
                product_flash_sale = responses[1];
            }

            if (!product_detail) {
                return;
            }

            // Update cart items number
            this._updateCartCount();

            // Generate product Flash Sale
            this._generateProductFlashSale(product_flash_sale);

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
            this.page_configs.currency = this.page_configs.currency || DefaultVNLocale.VN_CURRENCY_CODE
            this.page_configs.locale = this.page_configs.locale || ELocaleByCurrencyCode[this.page_configs.currency.toUpperCase()]
            this.content_builder._showLoading();
            const _arr_url_split = window.location.href.split('.');
            const _product_id = _arr_url_split[_arr_url_split.length - 1];
            this._getProductDetailById(_product_id).then();
        }
    }

    window.ProductDetail = ProductDetail;
}(window));

const product_detail_el = new ProductDetail();
product_detail_el.initPage();
