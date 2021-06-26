'use strict';

const API_URL = {
    COLLECTION_PRODUCTS: '/api/v1/products/simple/'
};

const API_LIST_PAGE_SIZE = 10;

const DefaultVNLocale = {
    VN_ICU_LOCALE: 'vi-VN',
    VN_CURRENCY_CODE: 'VND'
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

const EnumPageType = {
    HOME: 'home',
    PRODUCT_DETAIL: 'product_detail',
    POLICY: 'policy_page'
};

(function (window) {
    class GlobalEvent {
        constructor() {
        }

        _addScrollEvent = (scroll_element, call_back) => {
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
    }

    class DataService {
        landing_token;

        constructor(landing_token) {
            const _this = this;
            _this.landing_token = `Landing ${landing_token}`;
            _this._getDomain();
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

        getCollectionDataAsync = async (collection_id) => {
            const request_url = `${this.api_domain}${API_URL.COLLECTION_PRODUCTS}?collection_id=${collection_id}&is_parent=true`;
            return await this._createGetRequest(request_url);
        }

        getLandingProductAsync = async (page) => {
            const request_url = `${this.api_domain}${API_URL.COLLECTION_PRODUCTS}?page=${page}&page_size=${API_LIST_PAGE_SIZE}&is_parent=true`;
            return await this._createGetRequest(request_url);
        }

        _getDomain = () => {
            const _env = document.querySelectorAll('meta[name="environment"]')[0];
            this.api_domain = _env.getAttribute('content') === 'production' ? 'https://omipage.com' : 'https://dev.omipage.com';
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
            return new Intl.NumberFormat(country_locale, { style: 'currency', currency: currency_code }).format(value);
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

        _queryElementsByClass = (class_name, parent_node) => {
            const _parent_node = parent_node || document;
            return _parent_node.querySelectorAll(`div[class=${class_name}]`)[0];
        }

        _queryAllElementsByClass = (wrapper_tag, class_name, parent_node) => {
            const _parent_node = parent_node || document;
            return _parent_node.querySelectorAll(`${wrapper_tag}[class=${class_name}]`);
        }

        _queryElementsById = (id_name, parent_node) => {
            const _parent_node = parent_node || document;
            return _parent_node.getElementById(`${id_name}`);
        }

        _queryElementsLikeClassName = (class_name, parent_node) => {
            const _parent_node = parent_node || document;
            return _parent_node.querySelectorAll(`div[class^=${class_name}]`);
        }

        _headerElementBuilder = (landing_name, image_url) => {
            return `<div class="omp-header-block--content">
                        <div class="omp-header--space"></div>
                        <img  alt="Landing Logo" src="${image_url}">
                        <div class="omp-header--cart">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                            </svg>
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
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                        </svg>
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
                                        <div class="product--rating-stars">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                            </svg>
                                        </div>
                                        <div class="omp-product-card--price">
                                            <p class="omp-mr-1 omp-mb-0">${sale_price}</p>
                                            <small>
                                                <del>${price}</del>
                                            </small>
                                        </div>
                                    </div>
                                </a>
                              </div>`
            });

            return innerHtml;
        }

        _allProductContentBuilder = (arr_product, country, currency) => {
            if (!arr_product.length) return '';

            const innerHtml = this._renderListProduct(arr_product, country, currency, 'omp-product-col omp-product-wrapper');

            return `<div class="omp-landing-block--title">TẤT CẢ SẢN PHẨM</div>
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

            return `<div class="omp-landing-block--title">${title}</div>
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__outstanding-product">
                            <div class="omp-row">${innerHtml}</div>
                        </div>
                    </div>`
        }

        _bestSellingProductContentBuilder = (title, arr_product) => {
            if (!arr_product.length) {
                return '';
            }

            let innerHtml = '';

            arr_product.forEach(p => {
                innerHtml += ``
            });

            return `<div class="omp-landing-block--title">${title}</div>
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__outstanding-product">
                            <div class="omp-row">${innerHtml}</div>
                        </div>
                    </div>`
        }

        _newProductContentBuilder = (title, arr_product) => {
            if (!arr_product.length) return '';

            let innerHtml = '';

            arr_product.forEach(p => {
                innerHtml += ``
            });

            return `<div class="omp-landing-block--title">${title}</div>
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__outstanding-product">
                            <div class="omp-row">${innerHtml}</div>
                        </div>
                    </div>`
        }

        _flashSaleProductContentBuilder = (title, arr_product, country, currency) => {
            if (!arr_product.length) return '';

            const innerHtml = this._renderListProduct(
                arr_product,
                country,
                currency,
                'omp-product-wrapper',
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-fill" viewBox="0 0 16 16">
                              <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z"/>
                            </svg>`
            );

            return `<div class="omp-landing-block--title">${title}</div>
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__flash-sale">${innerHtml}</div>
                    </div>`
        }

        _bannerCarouselContentBuilder = (images) => {
            if (!images.length) return '';
        }

        _bannerOneImageContentBuilder = (image_url) => {
            if (!image_url) return '';

            return `<div class="omp-banner__one-image--content">
                        <img src="${image_url}" alt="${image_url}">
                    </div>`
        }

        _bannerTwoImageProductContentBuilder = (title, arr_product) => {
            if (!arr_product.length) {
                return '';
            }

            let innerHtml = '';

            return `<div class="omp-landing-block--title">${title}</div>
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__outstanding-product">
                            <div class="omp-row">${innerHtml}</div>
                        </div>
                    </div>`
        }

        _bannerVideoProductContentBuilder = (title, arr_product) => {
            if (!arr_product.length) {
                return '';
            }

            let innerHtml = '';

            return `<div class="omp-landing-block--title">${title}</div>
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
            _this.data_service = new DataService(_this.page_configs?.access_token || '');
        }

        initialMainPage = () => {
            this._getElementConfigs().then();
        }

        _resizeProductImage = () => {
            const _product_price_els = this.content_builder._queryAllElementsByClass('div', 'omp-product-card--price');
            if (window.innerWidth > 576) {
                _product_price_els.forEach(e => e.setAttribute('style', 'display: flex;'))
            } else {
                _product_price_els.forEach(e => e.removeAttribute('style'))
            }

            const _product_cart_top_els = this.content_builder._queryAllElementsByClass('div', 'omp-product-card__top');
            const _product_cart_top_el_height = _product_cart_top_els[0]?.offsetWidth || 0;
            _product_cart_top_els.forEach(e => e.style.height = `${e.offsetWidth}`);

            const _product_cart_els = this.content_builder._queryAllElementsByClass('a','omp-product-card');
            _product_cart_els.forEach(e => e.setAttribute('style', `height: ${_product_cart_top_el_height + 125}px`))
        }

        _renderAllProductBlock = async (page) => {
            const response = await this.data_service.getLandingProductAsync(page);
            const response_obj = JSON.parse(response);
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
            }

            this._resizeProductImage();
        }

        _renderMoreProductOfLanding = async (page) => {
            const response = await this.data_service.getLandingProductAsync(page);
            const response_obj = JSON.parse(response);
            const _products = response_obj.results;

            if (_products && _products.length) {
                this.all_product_current_page++;
                const _all_product_element = this.content_builder._queryElementsById(EnumLandingBlockElementName.LANDING_ALL_PRODUCTS);
                const _product_wrapper = this.content_builder._queryElementsByClass('omp-row', _all_product_element);
                _product_wrapper.innerHTML += this.content_builder._renderListProduct(
                    _products,
                    this.page_configs.locale || DefaultVNLocale.VN_ICU_LOCALE,
                    this.page_configs.currency || DefaultVNLocale.VN_CURRENCY_CODE
                );
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
                        _header.innerHTML = this.content_builder._headerElementBuilder(landing_config?.name, landing_config?.config?.logo);
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

                case EnumLandingBlockElementName.DESIGN_FLASH_SALE:
                    element.innerHTML = this.content_builder._flashSaleProductContentBuilder(
                        config.element_title,
                        arr_products,
                        this.page_configs.locale || DefaultVNLocale.VN_ICU_LOCALE,
                        this.page_configs.currency || DefaultVNLocale.VN_CURRENCY_CODE
                    )
                    break;

                case EnumLandingBlockElementName.DESIGN_TWO_IMAGE:
                    element.innerHTML = this.content_builder._flashSaleProductContentBuilder(
                        config.element_title,
                        arr_products,
                        this.page_configs.locale || DefaultVNLocale.VN_ICU_LOCALE,
                        this.page_configs.currency || DefaultVNLocale.VN_CURRENCY_CODE
                    )
                    break;
            }
        }

        _appendImageElementInnerHtml = (element, config) => {
            if (!config || !config.config) return;

            const _el_config = config?.config
            switch (config.element_name) {
                case EnumLandingBlockElementName.DESIGN_CAROUSEL:
                    element.innerHTML = this.content_builder._bannerOneImageContentBuilder(_el_config.images);
                    break;
                case EnumLandingBlockElementName.DESIGN_ONE_IMAGE:
                    const _image = _el_config.images && _el_config.images.length ? _el_config.images[0] : '';
                    element.innerHTML = this.content_builder._bannerOneImageContentBuilder(_image);
                    break;
                case EnumLandingBlockElementName.DESIGN_TWO_IMAGE:
                    element.innerHTML = this.content_builder._bannerOneImageContentBuilder(_el_config.images);
                    break;
            }
        }

        _renderProductElement = async (element_config, is_last_dynamic_element) => {
            const _el = document.getElementById(element_config.element_id);

            if (element_config.config) {
                if (element_config.config.collection) {
                    const response = await this.data_service.getCollectionDataAsync(element_config.config.collection.id);
                    const products_of_collection = JSON.parse(response).results;

                    this._appendProductElementInnerHtml(_el, element_config, products_of_collection);
                } else if (element_config.config.products) {
                    this._appendProductElementInnerHtml(_el, element_config, element_config.config.products);
                } else if (element_config.config.images) {
                    this._appendImageElementInnerHtml(_el, element_config);
                }
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

            this.global_event._addScrollEvent(
                document,
                _loadMoreProduct
            );

            this.global_event._addWindowResizeEvent(this._resizeProductImage);
        }
    }

    window.LandingElementConfig = LandingElementConfig;
})(window);

const landing_element_config = new LandingElementConfig();
landing_element_config.initialMainPage();
