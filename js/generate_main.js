'use strict';

const API_URL = {
    COLLECTION_PRODUCTS: '/api/v1/products/simple/'
};

const API_LIST_PAGE_SIZE = 10;

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

        _queryElementsByClass = (parent_node, class_name) => {
            return parent_node.querySelectorAll(`div[class=${class_name}]`)[0]
        }

        _queryElementsById = (parent_node, id_name) => {
            return parent_node.getElementById(`${id_name}`)
        }

        _queryElementsLikeClassName = (parent_node, class_name) => {
            return parent_node.querySelectorAll(`div[class^=${class_name}]`)
        }

        _headerElementBuilder = (landing_name, image_url) => {
            return `<div class="omp-header-block--content">
                        <img  alt="Landing Logo" src="${image_url}">
                        <div  class="omp-header--landing-name">${landing_name}</div>
                        <div  class="omp-header--space"></div>
                    </div>`
        }

        _footerElementBuilder = () => {
            return `<div class="omp-header-block--content">
                        <div  class="omp-menu-wrapper">
                            <div  class="omp-menu-item ng-star-inserted">
                                <div  class="omp-menu-item--content active">
                                    <p>
                                        <i class="bi bi-house"></i>
                                    </p>
                                    <span>Trang chủ</span>
                                </div>
                            </div>
                            <div  class="omp-menu-item ng-star-inserted">
                                <div class="omp-menu-item--content" onclick="omipage.open_cart_popup()">
                                    <p>
                                        <i class="bi bi-cart4"></i>
                                    </p>
                                    <span>Giỏ hàng</span>
                                </div>
                            </div>
                            <div  class="omp-menu-item ng-star-inserted">
                                <div  class="omp-menu-item--content">
                                    <p>
                                        <i class="bi bi-heart"></i>
                                    </p>
                                    <span>Yêu thích</span>
                                </div>
                            </div>
                        </div>
                    </div>`
        }

        _renderListProduct = (arr_product) => {
            let innerHtml = '';

            arr_product.forEach(p => {
                innerHtml += `<div class="omp-product-col omp-product-wrapper">
                                <a class="omp-product-card" href="${this.landing_domain}${p.link}">
                                    <div class="omp-product-card__top">
                                        <span class="product-card--premium">Hot</span>
                                        <img alt="${p.avatar_image}" class="mb-2" src="${p.avatar_image}">
                                    </div>
                                    <div class="omp-product-card__bottom">
                                        <div class="omp-product-card--name">${p.name}</div>
                                        <div class="product--rating-stars">
                                            <i class="bi bi-star-fill"></i>
                                            <i class="bi bi-star-fill"></i>
                                            <i class="bi bi-star-fill"></i>
                                            <i class="bi bi-star-fill"></i>
                                            <i class="bi bi-star-fill"></i>
                                        </div>
                                        <div class="omp-product-card--price">
                                            <span class="mr-1">${p.listed_price} ${p.currency}</span>
                                            <small>
                                                <del>${p.price} ${p.currency}</del>
                                            </small>
                                        </div>
                                    </div>
                                </a>
                            </div>`
            });

            return innerHtml;
        }

        _allProductContentBuilder = (arr_product) => {
            if (!arr_product.length) {
                return '';
            }

            const innerHtml = this._renderListProduct(arr_product);

            return `<div class="omp-landing-block--title">TẤT CẢ SẢN PHẨM</div>
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__all-products">
                            <div class="omp-row">${innerHtml}</div>
                        </div>
                    </div>`
        }

        _outstandingProductContentBuilder = (title, arr_product) => {
            if (!arr_product.length) {
                return '';
            }

            const innerHtml = this._renderListProduct(arr_product);

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

        _flashSaleProductContentBuilder = (title, arr_product) => {
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

        _bannerImageProductContentBuilder = (title, arr_product) => {
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

        _renderAllProductBlock = async (page) => {
            const response = await this.data_service.getLandingProductAsync(page);
            const response_obj = JSON.parse(response);
            this.total_product_in_landing = response_obj.count;
            const _products = response_obj.results;

            if (_products && _products.length) {
                this.all_product_current_page++;
                const _all_product_element = this.content_builder._queryElementsById(document, EnumLandingBlockElementName.LANDING_ALL_PRODUCTS);
                _all_product_element.innerHTML = this.content_builder._allProductContentBuilder(_products);
            }
        }

        _renderMoreProductOfLanding = async (page) => {
            const response = await this.data_service.getLandingProductAsync(page);
            const response_obj = JSON.parse(response);
            const _products = response_obj.results;

            if (_products && _products.length) {
                this.all_product_current_page++;
                const _all_product_element = this.content_builder._queryElementsById(document, EnumLandingBlockElementName.LANDING_ALL_PRODUCTS);
                const _product_wrapper = this.content_builder._queryElementsByClass(_all_product_element, 'omp-row');
                _product_wrapper.innerHTML += this.content_builder._renderListProduct(_products);
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

        _renderProductElement = async (element_config, is_last_dynamic_element) => {
            const _el = document.getElementById(element_config.element_id);

            if (element_config.config && element_config.config.collection) {
                const response = await this.data_service.getCollectionDataAsync(element_config.config.collection.id);
                const products_of_collection = JSON.parse(response).results;

                switch (element_config.element_name) {
                    case EnumLandingBlockElementName.DESIGN_OUTSTANDING_PRODUCT:
                        _el.innerHTML = this.content_builder._outstandingProductContentBuilder(
                            element_config.element_title,
                            products_of_collection
                        );
                        break;
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
        }
    }

    window.LandingElementConfig = LandingElementConfig;
})(window);

const landing_element_config = new LandingElementConfig();
landing_element_config.initialMainPage();
