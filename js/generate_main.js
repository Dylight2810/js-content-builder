'use strict';

const API_URL = {
    COLLECTION_PRODUCTS: '/api/v1/products/simple/',
    FLASH_SALES: '/api/v1/flash-sales/'
};

const API_LIST_PAGE_SIZE = 10;

const DefaultVNLocale = {
    VN_ICU_LOCALE: 'vi-VN',
    VN_CURRENCY_CODE: 'VND'
}

const LocalStorageTitle = {
    CART_LOCAL_STORAGE_TITLE: 'omp_cart',
    CART_ID_STORAGE_TITLE: 'omp_cart_id',
    ACCESS_TOKEN_STORAGE_TITLE: 'omp_key',
    LANDING_STORAGE_TITLE: 'omp_title',
    USER_SETTING_STORAGE_TITLE: 'omp_setting',
    UTM_TAG_STORAGE_TITLE: 'utm_tag',
    REFERRAL_HOST_STORAGE_TITLE: 'referral_host',
    REFERRAL_URL_STORAGE_TITLE: 'referral_url'
}

const EnumLandingBlockElementName = {
    NONE: '',
    // Landing Header
    LANDING_HEADER: 'OMP_HEADER',

    // Landing Menu Footer
    LANDING_MENU_FOOTER: 'OMP_MENU_FOOTER',

    // Landing All Products
    LANDING_PRODUCT_DETAIL: 'OMP_PRODUCT_DETAIL',

    // Landing All Products
    LANDING_ALL_PRODUCTS: 'OMP_ALL_PRODUCTS',

    // Banner Design
    DESIGN_CAROUSEL: 'OMP_CAROUSEL',
    DESIGN_ONE_IMAGE: 'OMP_ONE_IMAGE',
    DESIGN_TWO_IMAGE: 'OMP_TWO_IMAGE',
    DESIGN_VIDEO: 'OMP_VIDEO',

    // Product Design
    DESIGN_OUTSTANDING_PRODUCT: 'OMP_OUTSTANDING_PRODUCT',
    DESIGN_BEST_SELLING_PRODUCT: 'OMP_BEST_SELLING_PRODUCT',
    DESIGN_NEW_PRODUCT: 'OMP_NEW_PRODUCT',
    DESIGN_RELATED_PRODUCT: 'OMP_RELATED_PRODUCT',

    // Promotion Design
    DESIGN_FLASH_SALE: 'OMP_FLASH_SALE'
};

const EBannerImgReferenceLinkType = {
    PRODUCT_DETAIL: 1,
    COLLECTION_DETAIL: 2,
    HARD_LINK: 3
};

const ECarouselDirection = {
    RIGHT_TO_LEFT: 'right-to-left',
    LEFT_TO_RIGHT: 'left-to-right'
}

(function (window) {
    class GlobalEvent {
        carousel_interval;
        current_carousel_index = 0;

        content_builder = new ElementContentBuilder();

        constructor() {
        }

        addCountDownEvent = (countable_time) => {
            const _day_by_seconds = 24 * 60 * 60 * 1000;
            const _hour_by_seconds = 60 * 60 * 1000;
            const _minute_by_seconds = 60 * 1000;
            let _interval;

            const _hourEl = this.content_builder._queryElementsById('fsCountdownHours');
            const _minuteEl = this.content_builder._queryElementsById('fsCountdownMinutes');
            const _secondEl = this.content_builder._queryElementsById('fsCountdownSeconds');

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

        addScrollEvent = (scroll_element, call_back) => {
            let _last_scroll_top = 0;
            const _eventHandler = (e) => {
                const _el_scroll = e.target.scrollingElement;
                if ((_el_scroll.scrollTop + _el_scroll.clientHeight) === _el_scroll.scrollHeight) {
                    if (_el_scroll.scrollTop > _last_scroll_top) {
                        call_back(e.target.scrollingElement);
                    }
                }

                _last_scroll_top = _el_scroll.scrollTop;
            }

            scroll_element.addEventListener('scroll', _eventHandler);
        }

        _addWindowResizeEvent = (callback) => {
            const _eventHandler = () => {
                callback();
            };

            window.addEventListener('resize', _eventHandler);
        }

        _clearIntervalBeforeDoEvent = () => {
            // Stop Auto Carousel
            if (this.carousel_interval) {
                clearInterval(this.carousel_interval);
            }
        }

        _setIntervalForAutoCarousel = (carousel_item_els) => {
            this.carousel_interval = setInterval(() => {
                this._handleMoveToNextCarousel(carousel_item_els, true);
            }, 8000);
        }

        addAutoCarouselEvent = (block_element) => {
            const carousel_item_els = block_element.querySelectorAll('div[class^="ompi-carousel--image"]');

            if (!carousel_item_els.length) return;

            this._setIntervalForAutoCarousel(carousel_item_els);
        }

        _removePrevAndNextBeforeMove = (carousel_item_els) => {
            let _left_id = this.current_carousel_index - 1;
            let _right_id = this.current_carousel_index + 1;

            if (_left_id === -1) _left_id = carousel_item_els.length - 1;
            if (_right_id === carousel_item_els.length) _right_id = 0;

            carousel_item_els[_left_id].classList.remove('prev');
            carousel_item_els[_left_id].classList.remove('next');

            carousel_item_els[_right_id].classList.remove('prev');
            carousel_item_els[_right_id].classList.remove('next');
        }

        _handleMoveToNextCarousel = (carousel_item_els, is_auto_event = false) => {
            let next_index;

            this._removePrevAndNextBeforeMove(carousel_item_els);

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

            if (!is_auto_event) {
                this._setIntervalForAutoCarousel(carousel_item_els);
            }
        }

        _handleMoveToPrevCarousel = (carousel_item_els) => {
            let next_index;

            this._removePrevAndNextBeforeMove(carousel_item_els);

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

            this._setIntervalForAutoCarousel(carousel_item_els);
        }

        _addCarouselClickEvent = (carousel_el, carousel_item_el, prev_btn, next_btn) => {
            const _prevBtnEventHandler = () => {
                this._clearIntervalBeforeDoEvent();
                this._handleMoveToPrevCarousel(carousel_item_el);
            }

            const _nextBtnEventHandler = () => {
                this._clearIntervalBeforeDoEvent();
                this._handleMoveToNextCarousel(carousel_item_el);
            }

            prev_btn.addEventListener('click', _prevBtnEventHandler);
            next_btn.addEventListener('click', _nextBtnEventHandler);
        }

        addCarouselTouchEvent = (carousel_el) => {
            let touch_move_x;
            let touch_start_x;
            const carousel_item_els = carousel_el.querySelectorAll('div[class^="ompi-carousel--image"]');
            const prev_btn = carousel_el.querySelectorAll('div[class^="ompi-carousel--prev-btn"]')[0];
            const next_btn = carousel_el.querySelectorAll('div[class^="ompi-carousel--next-btn"]')[0];

            if (!carousel_item_els.length) return;

            const _touchEndEventHandler = () => {
                this._clearIntervalBeforeDoEvent();

                const long_move = touch_start_x - touch_move_x;

                if (!touch_move_x || Math.abs(long_move) < 20) return;

                if (long_move > 0) {
                    this._handleMoveToNextCarousel(carousel_item_els);
                } else {
                    this._handleMoveToPrevCarousel(carousel_item_els);
                }

                touch_move_x = 0;
            };

            carousel_el.addEventListener('touchstart', (e) => touch_start_x = e.touches[0].pageX);
            carousel_el.addEventListener('touchmove', (e) => touch_move_x = e.touches[0].pageX);
            carousel_el.addEventListener('touchend', _touchEndEventHandler);
            this._addCarouselClickEvent(carousel_el, carousel_item_els, prev_btn, next_btn);
        }
    }

    class DataService {
        landing_token;
        landing_id;

        constructor(landing_token, landing_id) {
            const _this = this;
            _this.landing_token = `Landing ${landing_token}`;
            _this.landing_id = landing_id
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

        getFlashSaleDataAsync = async () => {
            const request_url = `${this.api_domain}${API_URL.FLASH_SALES}?landing_id=${this.landing_id}&is_valid=1`;
            return await this._createGetRequest(request_url);
        }

        getCollectionDataAsync = async (collection_id) => {
            const request_url = `${this.api_domain}${API_URL.COLLECTION_PRODUCTS}?landing_id=${this.landing_id}&collection_id=${collection_id}&is_parent=true`;
            return await this._createGetRequest(request_url);
        }

        getLandingProductAsync = async (page) => {
            const request_url = `${this.api_domain}${API_URL.COLLECTION_PRODUCTS}?page=${page}&page_size=${API_LIST_PAGE_SIZE}&landing_id=${this.landing_id}&is_parent=true`;
            return await this._createGetRequest(request_url);
        }

        _getDomain = () => {
            const _env = document.querySelectorAll('meta[name="environment"]')[0];
            this.api_domain = _env.getAttribute('content') === 'production' ? 'https://s.omisocial.com' : 'https://dev.omisocial.com';
        }
    }

    class ElementContentBuilder {
        landing_domain = document.location.origin;
        loading_element = null

        constructor() {
            const _this = this;
            _this.loading_element = document.getElementsByClassName('omp-loading')[0];
        }

        _formatCurrency = (country_locale, currency_code, value) => {
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

        _queryElementsByClass = (wrapper_tag, class_name, parent_node) => {
            const _parent_node = parent_node || document;
            return _parent_node.querySelectorAll(`${wrapper_tag}[class=${class_name}]`)[0];
        }

        _queryAllElementsByClass = (wrapper_tag, class_name, parent_node) => {
            const _parent_node = parent_node || document;
            return _parent_node.querySelectorAll(`${wrapper_tag}[class=${class_name}]`);
        }

        _queryElementsById = (id_name, parent_node) => {
            const _parent_node = parent_node || document;
            return _parent_node.getElementById(`${id_name}`);
        }

        _queryAllElementsLikeClassName = (wrapper_tag, class_name, parent_node) => {
            const _parent_node = parent_node || document;
            return _parent_node.querySelectorAll(`${wrapper_tag}[class^=${class_name}]`);
        }

        _convertImageLink = (image_config) => {
            let _image_link = '#';

            switch (image_config.reference_type) {
                case EBannerImgReferenceLinkType.COLLECTION_DETAIL:
                    _image_link = `${image_config.reference_data.link}`;
                    break;
                case EBannerImgReferenceLinkType.PRODUCT_DETAIL:
                    _image_link = `${image_config.reference_data.link}`;
                    break;
                case EBannerImgReferenceLinkType.HARD_LINK:
                    _image_link = `${image_config.reference_link}`;
                    break;
            }

            return _image_link;
        }

        _countCartItems = () => {
            const _local_cart = localStorage.getItem(LocalStorageTitle.CART_LOCAL_STORAGE_TITLE)

            if (!_local_cart) return 0
            return JSON.parse(_local_cart).length
        }

        _headerElementBuilder = (landing_domain, image_url) => {
            const _landing_name = landing_domain?.split('.')[0] || '';
            const _landing_logo = image_url ? `<img  alt="Landing Logo" src="${image_url}">` : `<div class="omp-header--landing-name">${_landing_name}</div>`
            return `<div class="omp-header-block--content">
                        <div class="omp-header--space"></div>
                        ${_landing_logo}
                        <div class="omp-cart" onclick="omipage.open_cart_popup()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                            </svg>
                            <span class="cart-item-count">${this._countCartItems()}</span>
                        </div>
                    </div>`
        }

        _footerElementBuilder = () => {
            return `<div class="omp-header-block--content">
                        <div  class="omp-menu-wrapper">
                            <div  class="omp-menu-item ng-star-inserted">
                                <div  class="omp-menu-item--content active">
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
                                            <path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
                                        </svg>
                                    </p>
                                    <span>Trang chủ</span>
                                </div>
                            </div>
                            <div  class="omp-menu-item ng-star-inserted">
                                <div class="omp-menu-item--content" onclick="omipage.open_cart_popup()">
                                    <p class="omp-cart">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                        </svg>
                                        <span class="cart-item-count">${this._countCartItems()}</span>
                                    </p>
                                    <span>Giỏ hàng</span>
                                </div>
                            </div>
                            <div  class="omp-menu-item ng-star-inserted">
                                <div  class="omp-menu-item--content">
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                                        </svg>
                                    </p>
                                    <span>Yêu thích</span>
                                </div>
                            </div>
                        </div>
                    </div>`
        }

        _renderListProduct = (arr_product, country, currency, class_wrapper, product_tag) => {
            if (!arr_product.length) return '';
            let innerHtml = '';

            arr_product.forEach(p => {
                const sale_price = this._formatCurrency(country, currency, p.listed_price);
                const price = this._formatCurrency(country, currency, p.price);
                const cart_premium_content = product_tag ? `<span class="product-card--premium">${product_tag}</span>` : '';
                const image = p.avatar_image ? p.avatar_image : p.images.length ? p.images[0] : '';
                innerHtml += `<div class="${class_wrapper}">
                                <a class="omp-product-card" href="${this.landing_domain}${p.link}">
                                    <div class="omp-product-card__top">
                                        ${cart_premium_content}
                                        <img alt="${image}" class="mb-2" src="${image}">
                                    </div>
                                    <div class="omp-product-card__bottom">
                                        <div class="omp-product-card--name">${p.name}</div>
                                        <div class="omp-product-card--price">
                                            <p class="omp-mr-1 omp-mb-0">${sale_price}</p>
                                            <small>
                                                <del>${price}</del>
                                            </small>
                                        </div>
                                        <div class="omp-product-card--sold">Đã bán 0</div>
                                    </div>
                                </a>
                              </div>`
            });

            return innerHtml;
        }

        _allProductContentBuilder = (arr_product, country, currency) => {
            if (!arr_product.length) return '';

            const innerHtml = this._renderListProduct(arr_product, country, currency, 'omp-product-col omp-product-wrapper');

            return `<div class="omp-landing-block--title">
                        <div class="block-name">Tất cả sản phẩm</div>
                    </div>
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__all-products">
                            <div class="omp-row">${innerHtml}</div>
                        </div>
                    </div>`
        }

        _outstandingProductContentBuilder = (title, arr_product, country, currency) => {
            if (!arr_product.length) return '';

            const innerHtml = this._renderListProduct(
                arr_product,
                country,
                currency,
                'omp-product-col omp-product-wrapper',
                'Hot'
            );

            return `<div class="omp-landing-block--title">
                        <div class="block-name">${title}</div>
                    </div>
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__outstanding-product">
                            <div class="omp-row">${innerHtml}</div>
                        </div>
                    </div>`
        }

        _bestSellingProductContentBuilder = (title, arr_product, country, currency) => {
            if (!arr_product.length) return '';

            const innerHtml = this._renderListProduct(
                arr_product,
                country,
                currency,
                'omp-product-wrapper',
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg>`
            );

            return `<div class="omp-landing-block--title">
                        <div class="block-name">${title}</div>
                    </div>
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__best-selling-product">${innerHtml}</div>
                    </div>`
        }

        _newProductContentBuilder = (title, arr_product, country, currency) => {
            if (!arr_product.length) return '';

            const innerHtml = this._renderListProduct(
                arr_product,
                country,
                currency,
                'omp-product-wrapper',
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-patch-check" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z"/>
                            </svg>`
            );

            return `<div class="omp-landing-block--title">
                        <div class="block-name">${title}</div>
                    </div>
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__new-product">${innerHtml}</div>
                    </div>`
        }

        _renderListProductOfFlashSale = (arr_product, country, currency, class_wrapper, product_tag) => {
            if (!arr_product.length) return '';
            let innerHtml = '';

            arr_product.forEach(p => {
                const price = this._formatCurrency(country, currency, p.price);
                const discounted_price = this._formatCurrency(country, currency, p.discounted_amount);
                const range_discounted_start = this._formatCurrency(country, currency, p.range_discounted_start);
                const range_discounted_end = this._formatCurrency(country, currency, p.range_discounted_end);

                const cart_premium_content = product_tag ? `<span class="product-card--premium">${product_tag}</span>` : '';
                const image = p.avatar_image ? p.avatar_image : p.images.length ? p.images[0] : '';

                const card_price_html = p.is_single
                    ? `<p class="omp-mr-1 omp-mb-0">${discounted_price}</p>
                          <small>
                              <del>${price}</del>
                          </small>`
                    : `<p class="omp-mr-1 omp-mb-0">${range_discounted_start} - ${range_discounted_end}</p>`;

                innerHtml += `<div class="${class_wrapper}">
                                <a class="omp-product-card omp-flash-sale-card" href="${this.landing_domain}${p.link}">
                                    <div class="omp-product-card__top">
                                        ${cart_premium_content}
                                        <img alt="${image}" class="mb-2" src="${image}">
                                        <div class="product-card--sale">
                                            <div class="sale-text">
                                                <p>10%</p>
                                                <p>Giảm</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="omp-product-card__bottom">
                                        <div class="omp-product-card--name">${p.name}</div>
                                        <div class="omp-product-card--price">${card_price_html}</div>
                                        <div class="omp-product-card--selling-status">
                                            <span>Đã bán 0</span>
                                            <div class="number-product-sold" style="width: 0; background-color: #fd7e14"></div>
                                        </div>
                                    </div>
                                </a>
                              </div>`
            });

            return innerHtml;
        }

        _flashSaleProductContentBuilder = (title, flash_sale, arr_products, country, currency) => {
            if (!arr_products.length) return '';

            const innerHtml = this._renderListProductOfFlashSale(
                arr_products,
                country,
                currency,
                'omp-product-wrapper',
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-fill" viewBox="0 0 16 16">
                              <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z"/>
                            </svg>`
            );

            const _now = (new Date()).getTime() / 1000;
            const _statusText = flash_sale.start_time < _now && flash_sale.end_time > _now ? 'Kết thúc trong' : flash_sale.start_time > _now ? 'Bắt đầu trong' : '';

            return `<div class="omp-landing-block--title">
                        <div class="block-name">${title}</div>
                        <div class="block-countdown">
                            <span id="fsStatusText">${_statusText}</span>
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
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__flash-sale">${innerHtml}</div>
                    </div>`
        }

        _bannerCarouselContentBuilder = (images_config) => {
            if (!images_config || !images_config.length) return '';

            let innerHtml = '';

            images_config.forEach((img, index) => {
                const _img_link = this._convertImageLink(img);
                switch (index) {
                    case 0:
                        innerHtml += `
                            <div class="ompi-carousel--image active">
                                <a href="${_img_link}">
                                    <img src="${img.url}" alt="${img.url}">
                                </a>
                            </div>
                        `;
                        break;
                    case 1:
                        innerHtml += `
                           <div class="ompi-carousel--image next">
                                <a href="${_img_link}">
                                    <img src="${img.url}" alt="${img.url}">
                                </a>
                            </div>
                        `;
                        break;
                    default:
                        innerHtml += `
                            <div class="ompi-carousel--image">
                                <a href="${_img_link}">
                                    <img src="${img.url}" alt="${img.url}">
                                </a>
                            </div>
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

            return `
                <div class="omp-banner-carousel ompi-carousel--wrapper">
                    <div class="ompi-carousel">
                        ${innerHtml}
                    </div>
                </div>
            `
        }

        _bannerOneImageContentBuilder = (image_config) => {
            if (!image_config || !image_config.length) return '';

            const _img_link = this._convertImageLink(image_config[0]);

            return `<div class="omp-wp__one-image">
                        <img src="${image_config[0].url}" alt="${image_config[0].url}">
                        <a href="${_img_link}"></a>
                    </div>`
        }

        _bannerTwoImageProductContentBuilder = (images_config) => {
            if (!images_config || !images_config.length) {
                return '';
            }

            let innerHtml = '';

            images_config.forEach((img) => {
                const _img_link = this._convertImageLink(img);
                innerHtml += `
                    <a href="${_img_link}">
                        <img src="${img.url}" alt="${img.url}">
                    </a>
                `;
            })

            return `<div class="omp-wp__two-image">
                        ${innerHtml}
                    </div>`
        }

        _bannerVideoProductContentBuilder = (title, arr_product) => {
            if (!arr_product.length) {
                return '';
            }

            let innerHtml = '';

            return `<div class="omp-landing-block--title">
                        <div class="block-name">${title}</div>
                    </div>
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__outstanding-product">
                            <div class="omp-row">${innerHtml}</div>
                        </div>
                    </div>`
        }
    }

    class LandingElementConfig {
        total_product_in_landing = 0;
        all_product_current_page = 1;
        data_service = null;
        content_builder = new ElementContentBuilder();
        global_event = new GlobalEvent();
        page_els = null;
        page_configs = null;

        constructor() {
            const _this = this;
            _this.page_els = window.page_elements;
            _this.page_configs = window.page_configs;
            _this.data_service = new DataService(_this.page_configs?.access_token || '', _this.page_configs?.id || 0);
        }

        initialMainPage = () => {
            this._getElementConfigs().then();
        }

        _resizeProductImage = (wrapper_el) => {
            const _product_price_els = this.content_builder._queryAllElementsByClass('div', 'omp-product-card--price', wrapper_el);
            if (window.innerWidth > 576) {
                _product_price_els.forEach(e => e.setAttribute('style', 'display: flex;'))
            } else {
                _product_price_els.forEach(e => e.removeAttribute('style'))
            }
            const _product_cart_els = this.content_builder._queryAllElementsLikeClassName('a', 'omp-product-card', wrapper_el);
            let max_cart_bottom_height = 0;

            _product_cart_els.forEach(e => {
                const _cart_bottom_height = this.content_builder._queryElementsByClass('div', 'omp-product-card__bottom', e)?.offsetHeight;
                max_cart_bottom_height = _cart_bottom_height > max_cart_bottom_height ? _cart_bottom_height : max_cart_bottom_height;
            })

            _product_cart_els.forEach(e => {
                const _product_cart_top_els = this.content_builder._queryElementsByClass('div', 'omp-product-card__top', e);
                _product_cart_top_els.setAttribute('style', `height: ${_product_cart_top_els.offsetWidth}px`);
                e.setAttribute('style', `height: ${_product_cart_top_els.offsetWidth + max_cart_bottom_height}px`)
            })
        }

        _renderAllProductBlock = async (page) => {
            const response_obj = await this.data_service.getLandingProductAsync(page);
            this.total_product_in_landing = response_obj.count;
            const _products = response_obj.results;

            if (_products && _products.length) {
                this.all_product_current_page++;
                const _all_product_element = this.content_builder._queryElementsById(EnumLandingBlockElementName.LANDING_ALL_PRODUCTS);
                _all_product_element.innerHTML = this.content_builder._allProductContentBuilder(
                    _products,
                    this.page_configs.locale || DefaultVNLocale.VN_ICU_LOCALE,
                    this.page_configs.currency || DefaultVNLocale.VN_CURRENCY_CODE
                );
                this._resizeProductImage(_all_product_element);
            }
        }

        _renderMoreProductOfLanding = async (page) => {
            const response_obj = await this.data_service.getLandingProductAsync(page);
            const _products = response_obj.results;

            if (_products && _products.length) {
                this.all_product_current_page++;
                const _all_product_element = this.content_builder._queryElementsById(EnumLandingBlockElementName.LANDING_ALL_PRODUCTS);
                const _product_wrapper = this.content_builder._queryElementsByClass('div', 'omp-row', _all_product_element);
                _product_wrapper.innerHTML += this.content_builder._renderListProduct(
                    _products,
                    this.page_configs.locale || DefaultVNLocale.VN_ICU_LOCALE,
                    this.page_configs.currency || DefaultVNLocale.VN_CURRENCY_CODE,
                    'omp-product-col omp-product-wrapper'
                );
                this._resizeProductImage(_all_product_element);
            }

            return new Promise((resolve, reject) => resolve(true));
        }

        _handleGetPageElementConfig = async () => {
            if (!this.page_configs || !this.page_configs.id || !this.page_configs.access_token) {
                return;
            }

            if (!this.page_els || !this.page_els.page_elements?.dynamic_elements?.length || !this.page_els.page_elements?.statics_elements?.length) {
                return;
            }

            await this._renderElement(this.page_configs, this.page_els.page_elements).then();
        }

        _renderElement = async (landing_config, el_config) => {
            const dynamic_elements = el_config.dynamic_elements;
            const statics_elements = el_config.statics_elements;

            await dynamic_elements.forEach((e, index) => {
                const _is_last_dynamic_element = index === dynamic_elements.length - 1;
                this._renderProductElement(e, _is_last_dynamic_element).then();
            });

            statics_elements.forEach(e => {
                switch (e.element_id) {
                    case EnumLandingBlockElementName.LANDING_HEADER:
                        const _header = document.getElementById(e.element_id)
                        const _headerLogo = e.config?.images[0]?.url || landing_config?.config?.logo || '';
                        _header.innerHTML = this.content_builder._headerElementBuilder(landing_config?.domain, _headerLogo);
                        break
                    case EnumLandingBlockElementName.LANDING_MENU_FOOTER:
                        const _footer = document.getElementById(e.element_id)
                        _footer.innerHTML = this.content_builder._footerElementBuilder();
                        break
                }
            });
        }

        _appendProductElementInnerHtml = (element, config, arr_products) => {
            switch (config.element_name) {
                case EnumLandingBlockElementName.DESIGN_OUTSTANDING_PRODUCT:
                    element.innerHTML = this.content_builder._outstandingProductContentBuilder(
                        config.element_title,
                        arr_products,
                        this.page_configs.locale || DefaultVNLocale.VN_ICU_LOCALE,
                        this.page_configs.currency || DefaultVNLocale.VN_CURRENCY_CODE
                    );
                    break;

                case EnumLandingBlockElementName.DESIGN_NEW_PRODUCT:
                    element.innerHTML = this.content_builder._newProductContentBuilder(
                        config.element_title,
                        arr_products,
                        this.page_configs.locale || DefaultVNLocale.VN_ICU_LOCALE,
                        this.page_configs.currency || DefaultVNLocale.VN_CURRENCY_CODE
                    )
                    break;

                case EnumLandingBlockElementName.DESIGN_BEST_SELLING_PRODUCT:
                    element.innerHTML = this.content_builder._bestSellingProductContentBuilder(
                        config.element_title,
                        arr_products,
                        this.page_configs.locale || DefaultVNLocale.VN_ICU_LOCALE,
                        this.page_configs.currency || DefaultVNLocale.VN_CURRENCY_CODE
                    )
                    break;
            }

            this._resizeProductImage(element);
        }

        _takeProductsFromFlashSale = (flash_sale) => {
            if (!flash_sale?.products?.length) return [];

            const arr_products = [];
            flash_sale.products.forEach(p => {
                if (p.product.is_single || !p.variants?.length) {
                    p.product.is_single = true;
                    p.product.discounted_amount = p.discounted_amount;
                    p.product.discounted_percent = Math.round((p.amount / p.product.price) * 100);
                } else {
                    p.product.range_discounted_start = p.product.price_range[0];
                    p.product.range_discounted_end = p.product.price_range[1];
                }

                arr_products.push(p.product);
            })

            return arr_products;
        }

        _appendFlashSaleInnerHtml = (element, config, arr_flash_sales) => {
            const arr_products = this._takeProductsFromFlashSale(arr_flash_sales[0]);
            element.innerHTML = this.content_builder._flashSaleProductContentBuilder(
                config.element_title,
                arr_flash_sales[0],
                arr_products,
                this.page_configs.locale || DefaultVNLocale.VN_ICU_LOCALE,
                this.page_configs.currency || DefaultVNLocale.VN_CURRENCY_CODE
            )
        }

        _resizeCarouselImage = () => {
            if (!this.page_els || !this.page_els.page_elements || !this.page_els.page_elements.dynamic_elements) {
                return;
            }

            const carousel_el_data = this.page_els.page_elements.dynamic_elements
                .find(e => e.element_name === EnumLandingBlockElementName.DESIGN_CAROUSEL)

            if (!carousel_el_data || !carousel_el_data.config || !carousel_el_data.element_id) return;

            const carousel_el = document.getElementById(carousel_el_data.element_id);

            if (carousel_el_data.config.intrinsic_width && carousel_el_data.config.intrinsic_height) {
                const _omp_wrapper = document.getElementById('omp_wrapper');
                carousel_el.setAttribute(
                    'style',
                    `height: ${_omp_wrapper.offsetWidth * carousel_el_data.config.intrinsic_height / carousel_el_data.config.intrinsic_width}px`
                )
            }
        }

        _appendImageElementInnerHtml = (element, config) => {
            if (!config || !config.config) return;

            const _el_config = config?.config
            switch (config.element_name) {
                case EnumLandingBlockElementName.DESIGN_CAROUSEL:
                    element.innerHTML = this.content_builder._bannerCarouselContentBuilder(_el_config.images);
                    if (_el_config.intrinsic_width && _el_config.intrinsic_height) {
                        const _omp_wrapper = document.getElementById('omp_wrapper');
                        element.setAttribute(
                            'style',
                            `height: ${_omp_wrapper.offsetWidth * _el_config.intrinsic_height / _el_config.intrinsic_width}px`
                        )
                    }
                    this.global_event.addAutoCarouselEvent(element);
                    this.global_event.addCarouselTouchEvent(element);
                    this.global_event._addWindowResizeEvent(this._resizeCarouselImage);
                    break;
                case EnumLandingBlockElementName.DESIGN_ONE_IMAGE:
                    element.innerHTML = this.content_builder._bannerOneImageContentBuilder(_el_config.images);
                    break;
                case EnumLandingBlockElementName.DESIGN_TWO_IMAGE:
                    element.innerHTML = this.content_builder._bannerTwoImageProductContentBuilder(_el_config.images);
                    break;
            }
        }

        _renderProductElement = async (element_config, is_last_dynamic_element) => {
            const _el = document.getElementById(element_config.element_id);

            switch (element_config.element_name) {
                case EnumLandingBlockElementName.DESIGN_FLASH_SALE:
                    const response = await this.data_service.getFlashSaleDataAsync();
                    let arr_flash_sales = response.results;
                    const _timeNow = (new Date()).getTime() / 1000
                    arr_flash_sales = arr_flash_sales.filter(fs => !!fs.products.length && fs.end_time > _timeNow);

                    this._appendFlashSaleInnerHtml(_el, element_config, arr_flash_sales);
                    if (arr_flash_sales.length > 0) {
                        if (arr_flash_sales[0].start_time > _timeNow) {
                            this.global_event.addCountDownEvent(arr_flash_sales[0]?.start_time);
                        } else {
                            this.global_event.addCountDownEvent(arr_flash_sales[0]?.end_time);
                        }
                    }
                    break;
                default:
                    if (element_config.config) {
                        if (element_config.config.collection) {
                            const response = await this.data_service.getCollectionDataAsync(element_config.config.collection.id);
                            const products_of_collection = response.results;

                            this._appendProductElementInnerHtml(_el, element_config, products_of_collection);
                        } else if (element_config.config.products) {
                            this._appendProductElementInnerHtml(_el, element_config, element_config.config.products);
                        } else if (element_config.config.images) {
                            this._appendImageElementInnerHtml(_el, element_config);
                        }
                    }
                    break;
            }

            if (is_last_dynamic_element) {
                this._renderAllProductBlock(this.all_product_current_page).then();
            }
        }

        _getElementConfigs = async () => {
            await this._handleGetPageElementConfig();

            const _loadMoreProduct = async () => {
                if (this.all_product_current_page * API_LIST_PAGE_SIZE > this.total_product_in_landing) {
                    return;
                }

                this.content_builder._showLoading();
                await this._renderMoreProductOfLanding(this.all_product_current_page);
                this.content_builder._hideLoading();
            }

            this.global_event.addScrollEvent(
                document,
                _loadMoreProduct
            );
        }
    }

    window.LandingElementConfig = LandingElementConfig;
})(window);

const landing_element_config = new LandingElementConfig();
landing_element_config.initialMainPage();
