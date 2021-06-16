'use strict';

const API_URL = {
    ELEMENT_CONFIG: 'http://dev.omipage.com/api/v1/landings/',
    COLLECTION_PRODUCTS: 'http://dev.omipage.com/api/v1/products/simple/'
};

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
    HOME: 'HOME_PAGE',
    PRODUCT_DETAIL: 'PRODUCT_DETAIL_PAGE',
    POLICY: 'POLICY_PAGE'
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

        getPageElementsConfigAsync = async (landing_id) => {
            const request_url = `${API_URL.ELEMENT_CONFIG}${landing_id}/elements/`;
            return await this._createGetRequest(request_url);
        }

        getCollectionDataAsync = async (collection_id) => {
            const request_url = `${API_URL.COLLECTION_PRODUCTS}?collection_id=${collection_id}&is_parent=true`;
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

        _headerElementBuilder = (landing_name, image_url) => {
            return `<div  id="OMP_HEADER">
                        <div  class="omp-header-block--content">
                            <img  alt="Landing Logo" src="${image_url}">
                            <div  class="omp-header--landing-name">${landing_name}</div>
                            <div  class="omp-header--space"></div>
                        </div>
                    </div>`
        }

        _footerElementBuilder = () => {
            return `<div  id="OMP_MENU_FOOTER">
                        <div  class="omp-header-block--content">
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
                                    <div class="omp-menu-item--content">
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
                        </div>
                    </div>`
        }

        _outstandingProductContentBuilder = (title, arr_product) => {
            if (!arr_product.length) {
                return '';
            }

            let innerHtml = '';

            arr_product.forEach(p => {
                innerHtml += `<div class="omp-col-6 omp-product-wrapper">
                                <div class="omp-product-card">
                                    <div class="omp-product-card__top">
                                    <span class="product-card--premium">Hot</span>
                                    <img alt="" class="mb-2" src="${p.avatar_image}">
                                    </div>
                                    <div class="omp-product-card__bottom">
                                        <div class="omp-product-card--category">${p.sku}</div>
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
                                </div>
                            </div>`
            });

            return `<div class="omp-landing-block--title">${title}</div>
                    <div class="omp-landing-block--content">
                        <div class="omp-wp__outstanding-product">
                            <div class="omp-row">${innerHtml}</div>
                        </div>
                    </div>`
        }
    }

    class LandingElementConfig {
        data_service = new DataService();
        content_builder = new ElementContentBuilder();

        constructor() {
        }

        initialMainPage = () => {
            this._getElementConfigs().then();
        }

        _getElementConfigs = async () => {
            const configs = await this.data_service.getPageElementsConfigAsync(35);
            const obj_configs = JSON.parse(configs);
            this._handleGetPageElementConfig(obj_configs);
        }

        _handleGetPageElementConfig = (configs) => {
            if (!configs || !configs.elements || !configs.elements.length) {
                return;
            }
            const elements_config = configs.elements.find(e => e.page_id === EnumPageType.HOME);

            if (!elements_config && !elements_config.page_elements) {
                return;
            }

            this._renderElement(elements_config.page_elements);
        }

        _renderElement = (el_config) => {
            const dynamic_elements = el_config.dynamic_elements;
            const statics_elements = el_config.statics_elements;

            statics_elements.forEach(e => {
               switch (e.element_id) {
                   case EnumLandingBlockElementName.LANDING_HEADER:
                       const _header = document.getElementById(e.element_id)
                       _header.innerHTML = this.content_builder._headerElementBuilder('My Shop', 'https://storage.googleapis.com/omisell-cloud/omipage/logoulashop.png');
                       break
                   case EnumLandingBlockElementName.LANDING_MENU_FOOTER:
                       const _footer = document.getElementById(e.element_id)
                       _footer.innerHTML = this.content_builder._footerElementBuilder();
                       break
               }
            });

            dynamic_elements.forEach(e => {
                this._renderProductElement(e).then();
            });
        }

        _renderProductElement = async (element_config) => {
            const _el = document.getElementById(element_config.element_id);

            if (element_config.config && element_config.config.collection) {
                const response = await this.data_service.getCollectionDataAsync(element_config.config.collection.id);
                const products_of_collection = JSON.parse(response).results;
                _el.innerHTML = this.content_builder._outstandingProductContentBuilder(element_config.element_title, products_of_collection);
            }
        }
    }

    window.LandingElementConfig = LandingElementConfig;
})(window);

const landing_element_config = new LandingElementConfig();
landing_element_config.initialMainPage();
