// define templates for the Prestige 4.2 theme
var _usfFilterBodyTemplate = /*inc_begin_filter-body*/
`<!-- Range filter -->
<div v-if="isRange" class="usf-facet-values usf-facet-range">
    <!-- Range inputs -->
    <div class="usf-slider-inputs usf-clear">
        <span class="usf-slider-input__from">
            <span class="usf-slider-input__prefix" v-html="facet.sliderPrefix" v-if="facet.showSliderInputPrefixSuffix"></span>
            <input :readonly="!hasRangeInputs" :value="rangeConverter(range[0]).toFixed(rangeDecimals)" @change="e => onRangeInput(e, range[0], 0)">
            <span class="usf-slider-input__suffix" v-html="facet.sliderSuffix" v-if="facet.showSliderInputPrefixSuffix"></span>
        </span>
        <span class="usf-slider-div">-</span>
        <span class="usf-slider-input__to">
            <span class="usf-slider-input__prefix" v-html="facet.sliderPrefix" v-if="facet.showSliderInputPrefixSuffix"></span>
            <input :readonly="!hasRangeInputs" :value="rangeConverter(range[1]).toFixed(rangeDecimals)" @change="e => onRangeInput(e, range[1], 1)">
            <span class="usf-slider-input__suffix" v-html="facet.sliderSuffix" v-if="facet.showSliderInputPrefixSuffix"></span>
        </span>
    </div>
	<!-- See API reference of this component at https://docs.sobooster.com/search/storefront-js-api/slider-component -->
    <usf-slider :color="facet.sliderColor" :symbols="facet.sliderValueSymbols" :prefix="facet.sliderPrefix" :suffix="facet.sliderSuffix" :min="facet.min" :max="facet.max" :pips="facet.range[0]" :step="facet.range[1]" :decimals="rangeDecimals" :value="range" :converter="rangeConverter" @input="onRangeSliderInput" @change="onRangeSliderChange"></usf-slider>
</div>
<!-- List + Swatch filter -->
<div v-else ref="values" :class="'usf-facet-values usf-facet-values--' + facet.display + (facet.navigationCollections ? ' usf-navigation' : '') + (facet.valuesTransformation ? (' usf-' + facet.valuesTransformation.toLowerCase()) : '') + (facet.circleSwatch ? ' usf-facet-values--circle' : '')" :style="!usf.isMobile && facet.maxHeight ? { maxHeight: facet.maxHeight } : null">
    <!-- Filter options -->                
    <usf-filter-option v-for="o in visibleOptions" :facet="facet" :option="o" :key="o.label"></usf-filter-option>
</div>

<!-- More -->
<div v-if="isMoreVisible" class="usf-more" @click="onShowMore" v-html="loc.more"></div>`
/*inc_end_filter-body*/;

var _usfSearchResultsSkeletonItemTpl = `
<div v-if="view === 'grid'" class="Grid__Cell usf-skeleton" :class="['1/' + _usfSettingCollection.mobile_items_per_row + '--phone','1/' + _usfSettingCollection.tablet_items_per_row + '--tablet-and-up','1/' + _usfSettingCollection.desktop_items_per_row + '--desk']">
    <div class="ProductItem grid-view-item" v-if="true">
        <div class="usf-img"></div>
        <div class="usf-meta">
        </div>
    </div>
</div>
<a class="usf-sr-product list-view-item usf-skeleton" v-else>
    <!-- Image column -->
    <div class="list-view-item__image-column" v-if="true">
        <div class="list-view-item__image-wrapper" v-if="true">
            <div class="usf-img"></div>
        </div>
    </div>

    <!-- Title and Vendor column -->
    <div class="list-view-item__title-column" v-if="true">
        <div class="list-view-item__title"></div>
        <div class="list-view-item__vendor medium-up--hide"></div>
    </div>

    <!-- Vendor, for mobile -->
    <div class="list-view-item__vendor-column small--hide" v-if="true">
        <div class="list-view-item__vendor"></div>
    </div>

    <!-- Prices -->
    <div class="list-view-item__price-column" v-if="true">
        <div class="usf-price product-price__price"></div>
    </div>
</a>
`;


var updateSRposition = function (e) {
    var sr = document.getElementById('usf-sr-summary-temp');
    var newSR = document.getElementById('usf_searchTotal');
    if (newSR) {
        newSR.innerHTML = '';
        if (sr)
            newSR.insertAdjacentElement('beforeEnd', sr);
    } else {
        if (sr) {
            sr.parentNode.removeChild(sr);
        }
    }
    return 1
}

usf.templates = {
    app: `
<div id="usf_container" class="usf-zone usf-clear" :class="{'usf-filters-horz': usf.settings.filters.horz}">
    <usf-new-filters-barv2></usf-new-filters-barv2>
    <div>
        <usf-filters v-if="usf.settings.filters.horz"></usf-filters>            
    </div>
    <div class="CollectionInner">
        <block-filter-v2 v-if="!usf.settings.filters.horz"></block-filter-v2>
        <div class="CollectionInner__Products">
            <usf-sr></usf-sr>
        </div>
    </div>
</div>
`,

    searchResults: `
<div class="usf-sr-container ProductListWrapper" :class="{'usf-no-facets': noFacets, 'usf-empty': !loader && !hasResults, 'usf-nosearch': !showSearchBox}">
    <!-- Search form -->
    <div class="ProductList ProductList--grid">
        <form v-if="showSearchBox" action="/search" method="get" role="search" class="usf-sr-inputbox">
            <input name="q" autocomplete="off" ref="searchInput" v-model="termModel">
            <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                    <circle class="usf-path" cx="10.981" cy="10.982" r="9.786"></circle>
                    <line class="usf-path" x1="23.804" y1="23.804" x2="17.902" y2="17.901"></line>
                </svg>
            </button>
            <span v-if="termModel" class="usf-remove" @click="clearSearch"></span>
        </form>
    </div>
    <span class="usf-sr-summary" id="usf-sr-summary-temp" v-html="loader === true ? '&nbsp;' : usf.utils.format(term ? loc.productSearchResultWithTermSummary : loc.productSearchResultSummary, result.total, term)"></span>
    <usf-sr-banner v-if="result && result.extra && result.extra.banner && !result.extra.banner.isBottom" :banner="result.extra.banner"></usf-sr-banner>

    <!-- Load previous -->
    <div class="usf-sr-paging usf-sr-paging--top" v-if="itemsOffset && loader !== true && hasResults && usf.settings.search.more !== 'page'">
        <button class="usf-load-more" :class="{'usf-with-loader': loader === 'prev'}" @click="onLoadPrev"><span v-html="loc.loadPrev"></span></button>        
    </div>

    <div :class="(view === \'grid\' ? \'ProductList ProductList--grid ProductList--removeMargin Grid\' : \'list-view-items\') + \' usf-results prestige-usf-\' + view">
        <template v-if="loader===true">` + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl +
        _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl +
        `</template>
        <template v-else>
            <template v-if="loader === true || hasResults" >
                <template v-if="view === 'grid'">
                    <template v-for="p in result.items">
                        <usf-sr-griditem2 :product="p" :result="result" ></usf-sr-griditem2>
                    </template>
                </template>
                <template v-else>
                    <template v-for="p in result.items">
                        <usf-sr-listitem :product="p" :result="result"></usf-sr-listitem>
                    </template>
                </template>
            </template>
            <template v-else>
                <!-- Empty result -->
                <div class="EmptyState">
                    <div class="Container">
                        <h1 class="EmptyState__Title Heading u-h5">
                            <span v-html="term ? usf.utils.format(loc.productSearchNoResults, term) : loc.productSearchNoResultsEmptyTerm"></span>
                        </h1>
                        <button v-if="facetFilters" class="usf-btn usf-btn-action" v-html="loc.clearAllFilters" @click="usf.queryRewriter.removeAllFacetFilters"></button>
                    </div>
                </div>
            </template>
        </template>
    </div>

    <usf-sr-banner v-if="result && result.extra && result.extra.banner && result.extra.banner.isBottom"
        :banner="result.extra.banner"></usf-sr-banner>

    <!-- Paging & load more -->
    <div class="usf-sr-paging" v-if="loader !== true">
        <div class="usf-sr-loader" v-if="loader === 'more'">
            <div class="usf-spinner"></div>
        </div>

        <div class="usf-sr-more" v-else-if="hasResults && usf.settings.search.more === 'more'">
            <div class="usf-title" v-html="usf.utils.format(loc.youHaveViewed, itemsLoaded, result.total)"></div>
            <div class="usf-progress">
                <div :style="{width: (itemsLoaded * 100 / result.total) + '%'}"></div>
            </div>
            <div v-if="itemsLoaded < result.total" class="usf-load-more" @click="onLoadMore" v-html="loc.loadMore">
            </div>
        </div>
        <usf-sr-pages v-else-if="hasResults && usf.settings.search.more === 'page'" :page="page" :pages-total="pagesTotal" :pages-to-display="4" :side-pages-to-display="1"></usf-sr-pages>
    </div>
</div>
`,

    searchResultsGridViewItem: `
<div class="usf-sr-product Grid__Cell" :class="['1/' + _usfSettingCollection.mobile_items_per_row + '--phone','1/' + _usfSettingCollection.tablet_items_per_row + '--tablet-and-up','1/' + _usfSettingCollection.desktop_items_per_row + '--desk']" :data-usf-pid="product.id" :product-selector="product.id">
    <div class="ProductItem" style="visibility: inherit; opacity: 1; transform: matrix(1, 0, 0, 1, 0, 0);">
        <div class="ProductItem__Wrapper" >
	        <a :href="productUrl" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave" class="ProductItem__ImageWrapper usf-sr-product__image-container" :class="{'ProductItem__ImageWrapper--withAlternateImage':scaledHoverImageUrl}">
                <div :class="'AspectRatio AspectRatio--' + (_usfSettingCollection.use_natural_size ? 'withFallback' :_usfSettingCollection.product_image_size)" :style="'max-width: '+(selectedImage.width ? selectedImage.width : 125)+'px; --aspect-ratio: ' + _usfGetImageRatio(selectedImage)+';' + 100/_usfGetImageRatio(selectedImage) + '%;'">
                    <img key="new_p" v-if="_usfGlobalSettings.show_secondary_image && scaledHoverImageUrl" class="ProductItem__Image ProductItem__Image--alternate Image--lazyLoad Image--fadeIn" :data-widths="'[' + _usfImageWidths + ']'" data-sizes="auto" :data-src="_usfGetScaledImageUrl(scaledHoverImageUrl)">
                    <img class="ProductItem__Image Image--lazyLoad Image--fadeIn" :data-widths="'[' + _usfImageWidths + ']'" data-sizes="auto" :data-src="_usfGetScaledImageUrl(scaledSelectedImageUrl)">

                    <span class="Image__Loader"></span>
                    
                    <!-- product image extra -->
                    <div class="usf-hover-btns">
                        <usf-plugin name="searchResultsProductPreview" :data="pluginData"></usf-plugin>
                        <usf-plugin name="searchResultsProductCart" :data="pluginData"></usf-plugin>
                    </div>
                </div>
            </a>
            
            <!-- Wishlist -->
            <usf-plugin name="searchResultsProductWishList" :data="pluginData"></usf-plugin>
            <!-- Labels -->
            <usf-plugin name="searchResultsProductLabel" :data="pluginData"></usf-plugin>
            <div class="ProductItem__LabelList">
                <span v-if="(_label = product.tags.find(t => t.includes('__label')))"  class="ProductItem__Label Heading Text--subdued" v-html="_usfSplitByText(_label,'__label:',false,'')"></span>
                <span v-if="isSoldOut && usf.settings.search.showSoldOut" class="ProductItem__Label Heading Text--subdued" v-html="loc.soldOut"></span>
                <span v-else-if="hasDiscount && usf.settings.search.showSale" class="ProductItem__Label Heading Text--subdued" v-html="loc.sale"></span>
            </div>

            <div :class="'ProductItem__Info ProductItem__Info--' + _usfGlobalSettings.product_info_alignment" >
                <!-- vendor -->
                <p class="ProductItem__Vendor Heading" v-if="usf.settings.search.showVendor && _usfSettingCollection.show_vendor" v-html="product.vendor"></p>
                <!-- Title -->
                <h2 class="ProductItem__Title Heading">
                    <a :href="productUrl" :attrs="usf.plugins.invoke('getProductTitleAttrs', pluginData)"
                        v-html="product.title"></a>
                </h2>
                
            
                <!-- Product color swatch -->
                <usf-color-swatch :value="product"  :selectedImage="selectedImage" :scaledSelectedImageUrl="scaledSelectedImageUrl" :productUrl="productUrl" v-if="_usfGetSettingColorSwatch() && _usfSettingCollection.show_price_on_hover"></usf-color-swatch>

                <div class="ProductItem__PriceList Heading" :class="{'price--sold-out': isSoldOut,'ProductItem__PriceList--showOnHover':_usfSettingCollection.show_price_on_hover}" >
                    <template v-if="hasDiscount">
                        <span class="ProductItem__Price Price Price--highlight Text--subdued" data-money-convertible v-html="priceVaries && !product.selectedVariantId ? displayMinDiscountedPrice : displayDiscountedPrice"></span>
                        <span class="ProductItem__Price Price Price--compareAt Text--subdued" data-money-convertible v-html="priceVaries && !product.selectedVariantId ? displayMinPrice : displayPrice"></span>
                    </template>
                    <span v-else class="ProductItem__Price Price Text--subdued" v-html="priceVaries && !product.selectedVariantId ? loc.from + ' ' + displayMinDiscountedPrice : displayDiscountedPrice"></span>
                </div>
                <usf-color-swatch :value="product"  :selectedImage="selectedImage" :scaledSelectedImageUrl="scaledSelectedImageUrl" :productUrl="productUrl" v-if="_usfGetSettingColorSwatch() && !_usfSettingCollection.show_price_on_hover"></usf-color-swatch>
                <div v-if="product.tags && product.tags.find(x => x.includes('label_'))" class="New__Badges Product__Item">
                    <template v-for="tag in product.tags">
                        <div v-if="tag.includes('label_01') && window._usf_label_1 != '' " class="Label_01">
                            <span v-html="window._usf_label_1" class="ProductItem__Label Heading Text--subdued">
                            </span>
                        </div>
                        <div v-if="tag.includes('label_02') && window._usf_label_2 && _usf_label_2 != '' " class="Label_02">
                            <span  class="ProductItem__Label Heading Text--subdued" v-html="_usf_label_2">
                            </span>
                        </div>
                        <div v-if="tag.includes('label_03') && window._usf_label_3 && _usf_label_3 != '' " class="Label_03">
                            <span  class="ProductItem__Label Heading Text--subdued" v-html="_usf_label_3">
                            </span>
                        </div>
                        <div v-if="tag.includes('label_04') && window._usf_label_4 && _usf_label_4 != '' " class="Label_04">
                            <span  class="ProductItem__Label Heading Text--subdued" v-html="_usf_label_4">
                            </span>
                        </div>
                        <div v-if="tag.includes('label_05') && window._usf_label_5 && _usf_label_5 != '' " class="Label_05">
                            <span  class="ProductItem__Label Heading Text--subdued" v-html="_usf_label_5">
                            </span>
                        </div>
                        <div v-if="tag.includes('label_06') && window._usf_label_6 && _usf_label_6 != '' " class="Label_06">
                            <span  class="ProductItem__Label Heading Text--subdued" v-html="_usf_label_6">
                            </span>
                        </div>
                    </template>

                </div>
            </div>
        </div>
    </div>
    <div class="_usfErrorCart"></div>
</div>`,

    // Search result pages
    searchResultsPages: `
<center>
<div class="Pagination__Nav">
    <template v-for="e in elements">
        <a v-if="e.type === 'prev'" href="javascript:void(0)" :title="loc.prevPage" @click="onPrev" class="Pagination__NavItem Link Link--primary" rel="prev"><svg class="Icon Icon--select-arrow-left" role="presentation" viewBox="0 0 11 18"><path d="M9.5 1.5L1.5 9l8 7.5" stroke-width="2" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="square"></path></svg></a>
        <span v-else-if="e.type === 'dots'" class="Pagination__NavItem">…</span>
        <span v-else-if="e.type === 'page' && e.current" class="Pagination__NavItem is-active">{{e.page}}</span>
        <a v-else-if="e.type === 'page' && !e.current" class="Pagination__NavItem Link Link--primary" href="javascript:void(0)" @click="ev=>onPage(e.page,ev)" :title="usf.utils.format(loc.gotoPage,e.page)">{{e.page}}</a>
        <a v-if="e.type === 'next'" href="javascript:void(0)" :title="loc.nextPage" @click="onNext" class="Pagination__NavItem Link Link--primary" rel="next"><svg class="Icon Icon--select-arrow-right" role="presentation" viewBox="0 0 11 18"><path d="M1.5 1.5l8 7.5-8 7.5" stroke-width="2" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="square"></path></svg></a>
    </template>
</div>
</center>
`,

    searchResultsListViewItem: `
<a class="usf-sr-product list-view-item" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave" :href="productUrl" :data-usf-pid="product.id">
    <!-- Image column -->
    <div class="list-view-item__image-column">
        <div class="list-view-item__image-wrapper">
            <img class="list-view-item__image" :src="imageUrl">
        </div>
    </div>

    <!-- Title and Vendor column -->
    <div class="list-view-item__title-column">
        <h2 class="ProductItem__Title Heading" v-html="product.title"></h2>
        <div v-if="usf.settings.search.showVendor && _usfSettingCollection.show_vendor" class="ProductItem__Vendor Heading medium-up--hide" v-html="product.vendor"></div>
    </div>

    <!-- Vendor, for mobile -->
    <div class="list-view-item__vendor-column small--hide">
        <div v-if="usf.settings.search.showVendor && _usfSettingCollection.show_vendor" class="list-view-item__vendor" v-html="product.vendor"></div>
    </div>

    <!-- Prices -->
    <div class="list-view-item__price-column">
        <div class="usf-price product-price__price" :class="{'usf-has-discount': hasDiscount}"
            v-html="displayPrice"></div>
        <div class="usf-discount product-price__price product-price__sale" v-if="hasDiscount"
            v-html="displayDiscountedPrice"></div>
    </div>
</a>
`,
    // AddToCart Plugin	
    addToCartPlugin:/*inc_begin_addtocart-plugin*/
`<form class="usf-add-to-cart" method="POST" enctype="multipart/form-data" :action="usf.platform.addToCartUrl">
    <input type="hidden" name="form_type" value="product">
    <input type="hidden" name="utf8" value="✓">
    <input type="hidden" name="quantity" value="1">
    <input type="hidden" name="id" :value="variant.id">
    <button type="submit" name="add" class="usf-add-to-cart-btn usf-hover-btn" :data-product-id="args.product.id" @click="_usfAddToCart">
        <span class="usf-icon usf-icon-cart"></span>
        <span class="usf-label" v-html="loc.addToCart"></span>
    </button>
</form>`
/*inc_end_addtocart-plugin*/
,
    // Preview Plugin
    previewPlugin: /*inc_begin_preview-plugin*/
`<div class="usf-hover-btn usf-sr-preview" @click="onShowModal">
    <span class="usf-icon usf-icon-eye"></span>
    <span class="usf-label" v-html="loc.quickView"></span>
</div>`
/*inc_end_preview-plugin*/,
    previewPluginModal: /*inc_begin_preview-modal*/
`<div><div class="usf-backdrop"></div><div class="usf-preview__wrapper usf-zone"><div class="usf-preview__container">
    <div class="usf-preview">
        <!-- Close button -->
        <div class="usf-remove" @click="onClose"></div>

        <!-- Body content -->
        <div class="usf-preview__body">
            <!-- left - images of product -->
            <div class="usf-preview__content-left">
                <!-- Big image -->
                <div class="usf-preview__image-slider">
                    <div type="button" title="Prev" class="usf-preview__image-slider__btn usf-prev usf-icon usf-icon-up" @click="onPrevImage(0)" v-if="showBigImageNav"></div>

                    <div class="usf-preview__image-slider__track">
                        <div v-for="i in images" class="usf-preview__image-wrapper" :class="{'usf-active': image === i}"">
                            <div class="usf-preview__image" :style="'background-image:url('+usf.platform.getImageUrl(i.url, 1024)+')'"></div>
                        </div>
                    </div>

                    <div type="button" title="Next" class="usf-preview__image-slider__btn usf-next usf-icon usf-icon-up" @click="onNextImage(0)" v-if="showBigImageNav"></div>

                    <ul class="usf-preview__image-slider__dots" v-if="showImageIndices && false">
                        <li :class="{'active':i===image}" v-for="(i,index) in images"  @click="onThumbClick(i)"><button type="button">{{index+1}}</button></li>
                    </ul>
                </div>

                <!-- Thumbnails -->
                <div class="usf-preview__thumbs" v-if="showThumbs">
                    <div class="usf-preview__thumbs-inner">
                        <span v-for="i in images" class="usf-preview__thumb" :class="{'usf-active': image === i}" @click="onThumbClick(i)"></span>
                    </div>
                </div>

                <!-- Badges -->
                <div class="usf-preview__badge usf-preview__badge-sale" v-if="hasDiscount" v-html="loc.sale"></div>
            </div>

            <!-- right - info of the product -->
            <div class="usf-preview__content-right usf-scrollbar">
                <div class="usf-preview__content-summary">
                    <!-- Product title -->
                    <h1 class="usf-preview__title"><a :href="productUrl" v-html="product.title"></a></h1>

                    <!-- Vendor -->
                    <div class="usf-preview__vendor" v-html="product.vendor" v-if="usf.settings.search.showVendor"></div>

                    <!--Prices -->
                    <div class="usf-preview__price-wrapper price" :class="{'price--sold-out': isSoldOut}">
                        <span class="usf-price product-price__price" :class="{'usf-has-discount': hasDiscount}" v-html="usf.utils.getDisplayPrice(selectedVariant.compareAtPrice || selectedVariant.price)"></span>
                        <span v-if="hasDiscount" class="usf-discount product-price__price product-price__sale" v-html="usf.utils.getDisplayPrice(selectedVariant.price)"></span>

                        <div v-if="false" class="price__badges price__badges--listing">
                            <span class="price__badge price__badge--sale" aria-hidden="true" v-if="hasDiscount && usf.settings.search.showSale">
                                <span v-html="loc.sale"></span>
                            </span>
                            <span class="price__badge price__badge--sold-out" v-if="isSoldOut && usf.settings.search.showSoldOut">
                                <span v-html="loc.soldOut"></span>
                            </span>
                        </div>
                    </div>

                    <!-- Description -->
                    <p class="usf-preview__description" :class="{'usf-with-loader':description===undefined}" v-html="description"></p>

                    <!-- Add to cart form -->
                    <form method="post" enctype="multipart/form-data" :action="usf.platform.addToCartUrl" @submit="_usfAddToCart">
                        <!-- variant ID -->
                        <input type="hidden" name="id" :value="selectedVariant.id" />

                        <!-- Options -->
                        <template v-for="(o,index) in product.options">
                            <usf-preview-modal-option :option="o" :index="index"></usf-preview-modal-option>
                        </template>

                        <!-- add to card button -->
                        <div class="usf-preview__field">                            
                            <div class="usf-flex usf-preview__add-to-cart">
                                <usf-num-input v-model="quantity" name="quantity" :disabled="!hasAvailableVariant" :min="1" :max="available" />
                                <button :title="!hasAvailableVariant ? loc.selectedVariantNotAvailable : ''" :disabled="!hasAvailableVariant" type="submit" name="add" class="usf-preview--add-to-cart-btn usf-add-to-cart-btn" :class="{ 'usf-disabled': !hasAvailableVariant}" :style="{color:settings.buttonTextColor,backgroundColor:settings.buttonBackgroundColor}">
                                    <span class="usf-label" v-html="loc.addToCart"></span>
                                </button>
                            </div>
                        </div>
                    </form>

                    <!-- See details link -->
                    <a class="usf-preview__link" :href="productUrl" v-html="loc.seeFullDetails"></a>
                </div>
            </div>
        </div>
    </div>
</div></div></div>`
/*inc_end_preview-modal*/
,
    gotoTop: /*inc_begin_goto-top*/
`<div class="usf-goto-top">
    <div class="usf-icon usf-icon-up"></div>
</div>`
/*inc_end_goto-top*/,
    searchResultsBanner: /*inc_begin_search-banner*/        
`<div class="usf-sr-banner">
    <a :href="banner.url || 'javascript:void(0)'" :alt="banner.description">
        <img :src="banner.mediaUrl" style="max-width:100%">
    </a>
</div>
`
/*inc_end_search-banner*/,

    ////////////////////////
    // Filter templates
    // facet filters breadcrumb
    filtersBreadcrumb: /*inc_begin_filters-breadcrumb*/
`<div v-if="usf.settings.filterNavigation.showFilterArea && root.facetFilters && root.facets && facetFilterIds.length" class="usf-refineby">
    <!-- Breadcrumb Header -->
    <div class="usf-title usf-clear">
        <span class="usf-pull-left usf-icon usf-icon-equalizer"></span>
        <span class="usf-label" v-html="loc.filters"></span>

        <!-- Clear all -->
        <button class="usf-clear-all usf-btn" v-html="loc.clearAll" @click.prevent="root.removeAllFacetFilters" :aria-label="loc.clearAllFilters"></button>
    </div>

    <!-- Breadcrumb Values -->
    <div class="usf-refineby__body">
        <template v-for="facetId in facetFilterIds" v-if="(facet = root.facets.find(fc => fc.id === facetId)) && (f = root.facetFilters[facetId])">
            <template v-for="queryValStr in f[1]">
                <div class="usf-refineby__item usf-pointer usf-clear" @click.prevent="root.removeFacetFilter(facetId, queryValStr)">
                    <button class="usf-btn"><span class="usf-filter-label" v-html="facet.title + ': '"></span><span v-html="root.formatBreadcrumbLabel(facet, f[0], queryValStr)"></span></button><span class="usf-remove"></span>
                </div>
            </template>
        </template>
    </div>
 </div>`
 /*inc_end_filters-breadcrumb*/,

    // facet filters    
    filters: /*inc_begin_filters*/
// Vert & Horz modes have different render order
`<div class="usf-facets usf-no-select usf-zone">
<!-- Mobile view -->
<template v-if="usf.isMobile">
    <div class="usf-close" @click="onMobileBack(1)"></div>
    <div class="usf-facets-wrapper">
        <!-- Header. shows 'Filters', facet name, etc. -->
        <div class="usf-header">
            <!-- Single facet mode -->
            <template v-if="isSingleFacetMode">
                <div class="usf-title" @click="onMobileBack(0)" v-html="facets[0].title"></div>
                <div v-if="facetFilters" class="usf-clear" @click="removeAllFacetFilters" v-html="loc.clear"></div>
            </template>

            <!-- When a filter is selected -->
            <template v-else-if="mobileSelectedFacet">
                <div class="usf-title usf-back" @click="onMobileBack(0)" v-html="mobileSelectedFacet.title"></div>
                <div v-if="facetFilters && facetFilters[mobileSelectedFacet.id]" class="usf-clear" @click="removeFacetFilter(mobileSelectedFacet.id)" v-html="loc.clear"></div>
                <div v-else-if="mobileSelectedFacet.multiple" class="usf-all" @click="selectFacetFilter(mobileSelectedFacet)" v-html="loc.all"></div>
            </template>

            <!-- When no filter is selected -->
            <template v-else>
                <div class="usf-title" @click="onMobileBack(0)" v-html="loc.filters"></div>
                <div v-if="facetFilters" class="usf-clear" @click="removeAllFacetFilters" v-html="loc.clearAll"></div>
            </template>
        </div>

        <div class="usf-body">
            <!-- List all filter options, in single facet mode -->
            <usf-filter v-if="isSingleFacetMode" :facet="facets[0]"></usf-filter>

            <!-- List all filter options, when a filter is selected -->
            <usf-filter v-else-if="mobileSelectedFacet" :facet="mobileSelectedFacet"></usf-filter>

            <!-- List all when there are more than one facet -->
            <template v-else :key="f.id" v-for="f in facets">
                <template v-if="canShowFilter(f)">
                    <div class="usf-facet-value" @click="onMobileSelectFacet(f)">
                        <span class="usf-title" v-html="f.title"></span>
                        <div v-if="(selectedFilterOptionValues = facetFilters && (ff = facetFilters[f.id]) ? ff[1] : null)" class="usf-dimmed">
                            <span v-for="cf in selectedFilterOptionValues" v-html="formatBreadcrumbLabel(f, f.facetName, cf)"></span>
                        </div>
                    </div>
                </template>
            </template>
        </div>

        <!-- View items -->
        <div class="usf-footer">
            <div @click="onMobileBack(1)" v-html="loc.viewItems"></div>
        </div>
    </div>
</template>

<!-- Desktop view -->
<template v-else>
    <usf-filter-breadcrumb></usf-filter-breadcrumb>    
    <!-- Filters Loader -->
    <div v-if="!facets" class="usf-facets__first-loader">
        <template v-for="i in 3">
            <div class="usf-facet"><div class="usf-title usf-no-select"><span class="usf-label"></span></div>
                <div v-if="!usf.settings.filters.horz" class="usf-container"><div class="usf-facet-values usf-facet-values--List"><div class="usf-relative usf-facet-value usf-facet-value-single"><span class="usf-label"></span><span class="usf-value"></span></div><div class="usf-relative usf-facet-value usf-facet-value-single"><span class="usf-label"></span><span class="usf-value"></span></div></div></div>
            </div>
        </template>
    </div>
    <!-- Facets body -->
    <div v-else class="usf-facets__body">
        <usf-filter :facet="f" :key="f.id" v-for="f in facets"></usf-filter>
    </div>
</template>
</div>`
/*inc_end_filters*/,

    // facet filter item
    filter: /*inc_begin_filter*/
`<div v-if="canShow" class="usf-facet" :class="{'usf-collapsed': collapsed && !usf.isMobile, 'usf-has-filter': isInBreadcrumb}">
    <!-- Mobile filter -->
    <div v-if="usf.isMobile" class="usf-container">
        <!-- Search box -->
        <input v-if="hasSearchBox" class="usf-search-box" :aria-label="loc.filterOptions" :placeholder="loc.filterOptions" :value="term" @input="v => term = v.target.value">

        <!-- Values -->
        ` + _usfFilterBodyTemplate +
    `</div>

    <!-- Desktop filter -->
    <template v-else>
        <!-- Filter title -->
        <div class="usf-clear">
            <div class="usf-title usf-no-select" @click.prevent="onExpandCollapse">
                <button class="usf-label usf-btn" v-html="facet.title" :aria-label="usf.utils.format(loc.filterBy,facet.title)" :aria-expanded="!collapsed"></button>
                <usf-helptip v-if="facet.tooltip" :tooltip="facet.tooltip"></usf-helptip>            
                <!-- 'Clear all' button to clear the current facet filter. -->
                <button v-if="isInBreadcrumb" class="usf-clear-all usf-btn" :title="loc.clearFilterOptions" :aria-label="usf.utils.format(loc.clearFiltersBy,facet.title)" @click.prevent="onClear" v-html="loc.clear"></button>
                <span class="usf-pm"></span>
            </div>
        </div>

        <!-- Filter body -->
        <div class="usf-container">
            <!-- Search box -->
            <input v-if="hasSearchBox" class="usf-search-box" :placeholder="loc.filterOptions" :value="term" @input="v => term = v.target.value">

            ` + _usfFilterBodyTemplate +
        `
        </div>
    </template>
</div>`
/*inc_end_filter*/,

    // facet filter option
    filterOption: /*inc_begin_filter-option*/
`<div v-if="children" :class="(isSelected ? 'usf-selected ' : '') + ' usf-relative usf-facet-value usf-facet-value-single usf-with-children' + (collapsed ? ' usf-collapsed' : '')">
    <!-- option label -->
    <button class="usf-pm usf-btn" v-if="children" @click.prevent="onToggleChildren"></button>
    <button class="usf-label usf-btn" v-html="label" @click.prevent="onToggle"></button>

    <!-- product count -->
    <span v-if="!(!usf.settings.filterNavigation.showProductCount || (swatchImage && !usf.isMobile)) && option.value !== undefined" class="usf-value">{{option.value}}</span>    

    <div class="usf-children-container" v-if="children && !collapsed">
        <button :class="'usf-child-item usf-btn usf-facet-value' + (isChildSelected(c) ? ' usf-selected' : '')" v-for="c in children" v-html="getChildLabel(c)" @click="onChildClick(c)"></span>
    </div>
</div>
<button v-else :class="(isSelected ? 'usf-selected ' : '') + (swatchImage ? ' usf-facet-value--with-background' : '') + ' usf-btn usf-relative usf-facet-value usf-facet-value-' + (facet.multiple ? 'multiple' : 'single')" :title="isSwatch || isBox ? option.label + ' (' + option.value + ')' : undefined" :style="usf.isMobile ? null : swatchStyle" @click.prevent="onToggle">
    <!-- checkbox -->
    <div v-if="!isBox && !isSwatch && facet.multiple" :class="'usf-checkbox' + (isSelected ? ' usf-checked' : '')">
        <span class="usf-checkbox-inner"></span>
    </div>

    <!-- swatch image in mobile -->
    <div v-if="swatchImage && usf.isMobile" class="usf-mobile-swatch" :style="swatchStyle"></div>

    <!-- option label -->
    <span class="usf-label usf-btn" v-html="label"></span>
    
    <!-- product count -->
    <span v-if="!(!usf.settings.filterNavigation.showProductCount || (swatchImage && !usf.isMobile)) && option.value !== undefined" class="usf-value">{{option.value}}</span>
</button>`
/*inc_end_filter-option*/,



    // Instant search popup
    instantSearch: /*inc_begin_instantsearch*/
`<div :class="'usf-popup usf-zone usf-is usf-is--' + position + (shouldShow ? '' : ' usf-hide') + (isEmpty ? ' usf-empty' : '') + (firstLoader ? ' usf-is--first-loader': '')"  :style="usf.isMobile ? null : {left: this.left + 'px',top: this.top + 'px',width: this.width + 'px'}">
    <!-- Mobile search box -->
    <div v-if="usf.isMobile">
        <form class="usf-is__inputbox" :action="searchUrl" method="get" role="search">
            <span class="usf-icon usf-icon-back usf-close" @click="close"></span>
            <input name="q" autocomplete="off" ref="searchInput" :value="term" @input="onSearchBoxInput">
            <span class="usf-remove" v-if="term" @click="onClear"></span>
        </form>
    </div>

    <!-- First loader -->
    <div class="usf-is__first-loader" v-if="firstLoader">
        <div class="usf-clear">
            <div class="usf-img"></div>
            <div class="usf-title"></div>
            <div class="usf-subtitle"></div>
        </div>
        <div class="usf-clear">
            <div class="usf-img"></div>
            <div class="usf-title"></div>
            <div class="usf-subtitle"></div>
        </div>
        <div class="usf-clear">
            <div class="usf-img"></div>
            <div class="usf-title"></div>
            <div class="usf-subtitle"></div>
        </div>
    </div>

    <!-- All JS files loaded -->
    <template v-else>
        <!-- Empty view -->
        <div v-if="isEmpty" class="usf-is__no-results">
            <div style="background:url('//cdn.shopify.com/s/files/1/0257/0108/9360/t/85/assets/no-items.png?t=2') center no-repeat;min-height:160px"></div>
            <div v-html="usf.utils.format(loc.noMatchesFoundFor, term)"></div>
        </div>
        <template v-else>
            <!-- Body content -->
            <div class="usf-is__content">
                <!-- Products -->
                <div class="usf-is__matches usf-is__products">
                    <div class="usf-title" v-html="queryOrTerm ? loc.productMatches : loc.trending"></div>
                    
                    <div class="usf-is__list" v-if="result.items.length">
                        <!-- Did you mean -->
                        <span class="usf-is__did-you-mean" v-html="usf.utils.format(loc.didYouMean, term, result.query)" v-if="result.query !== term.toLowerCase()"></span>

                        <!-- Product -->
                        <usf-is-item v-for="p in result.items" :product="p" :result="result" :key="p.id + '-' + p.selectedVariantId"></usf-is-item>
                    </div>
                    <div class="usf-is__list" v-else style="background:url('//cdn.shopify.com/s/files/1/0257/0108/9360/t/85/assets/no-products.png?t=2') center no-repeat;min-height:250px"></div>
                </div>

                <div class="usf-is__side">
                    <!-- Suggestions -->
                    <div class="usf-is__matches usf-is__suggestions" v-if="result.suggestions && result.suggestions.length">
                        <div class="usf-title" v-html="loc.searchSuggestions"></div>
                        <span v-for="s in result.suggestions" class="usf-is__match" v-html="usf.utils.highlight(s, result.query)" @click="search(s)"></span>
                    </div>

                    <!-- Collections -->
                    <div class="usf-is__matches usf-is__collections" v-if="result.collections && result.collections.length">
                        <div class="usf-title" v-html="loc.collections"></div>
                        <span v-for="c in result.collections" class="usf-is__match" v-html="usf.utils.highlight(c.title, result.query)" @click="selectCollection(c)"></span>
                    </div>

                    <!-- Pages -->
                    <div class="usf-is__matches usf-is__pages" v-if="result.pages && result.pages.length">
                        <div class="usf-title" v-html="loc.pages"></div>
                        <span v-for="p in result.pages" class="usf-is__match" v-html="usf.utils.highlight(p.title, result.query)" @click="selectPage(p)"></span>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="usf-is__viewall">
                <span @click="search(queryOrTerm)" v-html="usf.utils.format(queryOrTerm ? loc.viewAllResultsFor : loc.viewAllResults, queryOrTerm)"></span>
            </div>
        </template>
    </template>
</div>`

/*inc_end_instantsearch*/
    ,

    // Instant search item
    instantSearchItem:/*inc_begin_instantsearch-item*/
`<span class="usf-is__product usf-clear" @click="onItemClick">
    <!-- Image -->
    <div class="usf-img-wrapper usf-pull-left">
        <img class="usf-img" :src="selectedImageUrl">
    </div>
    
    <div class="usf-pull-left">
        <!-- Title -->
        <div class="usf-title" v-html="usf.utils.highlight(product.title, result.query)"></div>

        <!-- Vendor -->
        <div class="usf-vendor" v-html="product.vendor" v-if="usf.settings.search.showVendor"></div>

        <!-- Prices -->
        <div class="usf-price-wrapper">
            <span class="usf-price" :class="{ 'usf-has-discount': hasDiscount }" v-html="displayPrice"></span>
            <span v-if="hasDiscount" class="usf-discount product-price__price product-price__sale" v-html="displayDiscountedPrice"></span>
        </div>
    </div>
</span>`
/*inc_end_instantsearch-item*/,
};


// default values when no section settings specified.
var _usfImageWidths;


if (!window._usfSettingCollection)
    window._usfSettingCollection = {};

if (!_usfSettingCollection.mobile_items_per_row)
    Object.assign(_usfSettingCollection, {
        mobile_items_per_row: 2,
        tablet_items_per_row: 3,
        desktop_items_per_row: 4,
    })

var usfDefaultThemeSettings = {
    filterPosition: 'drawer',
    product_image_size: 'withFallback',
    show_price_on_hover: true,
    show_collection_info: true,

    mobile_items_per_row: 2,
    tablet_items_per_row: 3,
    desktop_items_per_row: 4,
};

for (var k in _usfSettingCollection) {
    var val = _usfSettingCollection[k];
    if (val === null || val === undefined)
        _usfSettingCollection[k] = usfDefaultThemeSettings[k]
}



function ft_parseFacetFilters() {
    // parse the facet filters
    var entries = usf.query.get('_usf_f');

    return entries ? JSON.parse(entries) : null;
}


function _usfGetSettingColorSwatch() {
    if (_usfSettingCollection.current_page !== 'collection') {
        return true; // if search page
    } else {
        return _usfSettingCollection.colorSwatch;
    }
}

var _colorChanged = (event, target) => {
    // We need to change the URL of the various links
    var productItem = target.closest('.ProductItem'),
        variantUrl = target.getAttribute('data-variant-url');
    productItem.querySelector('.ProductItem__ImageWrapper').setAttribute('href', variantUrl);
    productItem.querySelector('.ProductItem__Title > a').setAttribute('href', variantUrl);

    // If we have a custom image for the variant, we change it
    var originalImageElement = productItem.querySelector('.ProductItem__Image:not(.ProductItem__Image--alternate)');

    if (target.hasAttribute('data-image-url')) {
        var newImageElement = document.createElement('img');
        newImageElement.className = 'ProductItem__Image Image--fadeIn Image--lazyLoad';
        //   newImageElement.setAttribute('data-image-id', target.getAttribute('data-image-id'));
        newImageElement.setAttribute('data-src', target.getAttribute('data-image-url'));
        newImageElement.setAttribute('data-widths', target.getAttribute('data-image-widths'));
        newImageElement.setAttribute('data-sizes', 'auto');

        // Replace the original node
        if (window.theme.productImageSize === 'natural') {
            originalImageElement.parentNode.style.paddingBottom = 100.0 / target.getAttribute('data-image-aspect-ratio') + '%';
        }

        originalImageElement.parentNode.style.setProperty('--aspect-ratio', target.getAttribute('data-image-aspect-ratio'));
        originalImageElement.parentNode.replaceChild(newImageElement, originalImageElement);
    }
}

var usfImages = {}
function usfImageExists(url, callback) {
    var v = usfImages[url];
    if (v !== undefined) {
        callback(v);
        return v;
    }

    var img = new Image();
    img.onload = function () {
        usfImages[url] = true;
        callback(true);
    };

    img.onerror = function () {
        usfImages[url] = false;
        callback(false);
    };

    img.src = url;
}

var usfFilesUrl;

usf.event.add('init', function () {
     var colSortInitialized;
usf.event.add('sr_updated', function () {
    if (colSortInitialized)
        return;
    colSortInitialized = 1;
    var c;
    if (usf.platform.collection != null && (c = usf.collectionsByUrlName[usf.platform.collection]) && usf.queryRewriter.sort == 'r') {
        var sortOrder = {
            'Manual': '',
            'BestSelling': 'bestselling',
            'Title': 'title',
            'TitleDesc': '-title',
            'Date': 'date',
            'DateDesc': '-date',
            'Price': 'price',
            'PriceDesc': '-price',
        }[c.sortOrder];

        if (sortOrder)
            usf.queryRewriter.sort = sortOrder;
    }
})

    var SearchResultsGridItem2 = {
        mixins: [usf.components.SearchResultsGridItem],
        template: usf.templates.searchResultsGridViewItem,
        computed : {
            scaledHoverImageUrl(){
                if(this.product.selectedVariantId && !usf.search.facetFilters){
                    let v = this.product.variants.find((x) => x.id == this.product.selectedVariantId);
                    return this.product.images[v.imageIndex + 1].url;
                }
                return this.getHoverImageUrl(usf.settings.search.imageSize);
            }
        }
    }
    usf.register(SearchResultsGridItem2, null, "usf-sr-griditem2");

    window._usfGlobalSettings = window._usfGlobalSettings || {
        product_info_alignment: "left",
        show_secondary_image: true
    };
    window._usfSettingCollection = window._usfSettingCollection || {
        collectionUrl: "/collections/all",
        colorSwatch: true,
        currentTags: [],
        current_page: "collection",
        desktop_items_per_row: 4,
        filterPosition: "sidebar",
        mobile_items_per_row: 2,
        product_image_size: "natural",
        show_collection_info: false,
        show_price_on_hover: false,
        show_vendor: false,
        sortBy: "title-ascending",
        tablet_items_per_row: 3,
        useAjaxCart: true,
        use_natural_size: true
    };
    _usfImageWidths = _usfIsDynamicImage ? [200, 400, 600, 700, 800, 900, 1000, 1200] : [usf.settings.search.imageSize];

  

    var nodes = document.head.children;
    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (n.href && (n.href.indexOf('theme.scss.css') !== -1 || n.href.indexOf('theme.css') !== -1)) {
            usfFilesUrl = n.href;
            var m = usfFilesUrl.indexOf('/assets/');
            while (usfFilesUrl[--m] !== '/');
            while (usfFilesUrl[--m] !== '/');
            var k = usfFilesUrl.indexOf('?v=');
            usfFilesUrl = usfFilesUrl.substring(0, m) + "/files/{0}" + usfFilesUrl.substring(k);
            break;
        }
    }

    const addEvent = function (object, type, callback) {
        if (object == null || typeof (object) == 'undefined') return;
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + type, callback);
        } else {
            object["on" + type] = callback;
        }
    };

    // added 21/07/2020 , auto close searchbar after press enter
    var Search__Form = document.querySelector('.Search__Form')
    var Search__Close = document.querySelector('.Search__Close')
    if (Search__Form) {
        addEvent(Search__Form, 'keyup', function (e) {
            if (e.keyCode === 13) {
                if (!usf.isMobile && Search__Close)
                    Search__Close.click()
            }

        })
    }

    function insertAfter(el, referenceNode) {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }

 

    var UsfDropDownV2 = {
        props: {
            value: String,
            placeholder: String,
            name: String,
            options: Array,
        },

        data() {
            return {
                show: false,
                pageOverlayElement: null,
                labelFromValue: usf.settings.translation['sortBy_' + (usf.queryRewriter.sort || '')]
            }
        },
        beforeMount() {
            usf.query.changed.push((e) => {
                this.labelFromValue = usf.settings.translation['sortBy_' + (usf.queryRewriter.sort || '')]
            })
            usf.query.snapshot();
        },
        watch: {
            show(v) {
                var root = document.documentElement;
                if (v) {
                    if (usf.isMobile) this.pageOverlayElement.classList.add('is-visible');
                    root.classList.add('no-scroll');
                    this.pageOverlayElement.addEventListener('click', this._closeListener);

                } else {
                    if (usf.isMobile) this.pageOverlayElement.classList.remove('is-visible');
                    root.classList.remove('no-scroll');
                    this.pageOverlayElement.removeEventListener('click', this._closeListener);
                }
            },
        },
        methods: {
            toggleDropdown() {
                this.show = !this.show;
            },
            pickSortValue(v) {
                usf.queryRewriter.sort = v;
                this.show = false;
            },
            _closeListener() {
                this.show = false;
                this.pageOverlayElement.classList.remove('is-visible');
            }
        },
        mounted() {
            if (!usf.isMobile || !usf.platform.collection)
                updateSRposition();

            this.pageOverlayElement = document.querySelector('.PageOverlay');

            var dropdown = document.getElementById('collection-sort-popoverv2');
            var main_section = document.getElementById('_usf_prestige_main')
            var usf_new_sortbtn = document.getElementById('usf-new-sortbtn');
            if (usf.isMobile) {
                if (main_section)
                    main_section.insertBefore(dropdown, main_section.firstChild);
            }
            else {
                this.$el.parentNode.appendChild(dropdown);
            }

            usf.event.add('mobile_changed', () => {
                if (main_section) {
                    if (usf.isMobile) main_section.insertBefore(dropdown, main_section.firstChild);
                    else {
                        if (usf_new_sortbtn) insertAfter(dropdown, usf_new_sortbtn)
                    }
                }
            });
            document.body.addEventListener('click', function (e) {
                var activator = document.getElementById('usf-new-sortbtn');
                e.target.closest(".Popover") || e.target.closest(".Modal") || e.target === activator || activator.contains(e.target) || (this.show = false);
            }.bind(this))


            


        },
        render(h) {
            var vm = this;
            return h('button', {
                ref: 'sortButton',
                class: 'CollectionToolbar__Item CollectionToolbar__Item--sort Heading Text--subdued u-h6 usf-new-sortbtn',
                attrs: {
                    'aria-label': "Show sort by",
                    'aria-haspopup': "true",
                    'aria-expanded': (this.show === true ? "true" : "false"),
                    'aria-controls': "collection-sort-popoverv2",
                    id: 'usf-new-sortbtn',
                },
                on: {
                    click: this.toggleDropdown
                }
            }, [
                h('span', usf.isMobile ? usf.settings.translation.sort : this.labelFromValue),
                h('svg', {
                    class: 'Icon Icon--select-arrow',
                    attrs: {
                        role: "presentation",
                        viewBox: "0 0 19 12"
                    },
                    domProps: {
                        innerHTML: `<polyline fill="none" stroke="currentColor" points="17 2 9.5 10 2 2" fill-rule="evenodd" stroke-width="2" stroke-linecap="square"></polyline>`
                    }
                }),
                    
                    h("div", {
                        class: "Popover Popover--alignRight Popover--positionBottom usf-new-sort-popover",
                        attrs: {
                            "id": "collection-sort-popoverv2",
                            "aria-hidden": (this.show === true ? "false" : "true")
                        }
                    }, [
                            
                        h('div', {
                            class: 'Popover__Header'
                        }, [
                            h('button', {
                                class: 'Popover__Close Icon-Wrapper--clickable',
                                attrs: {
                                    'data-action': "close-popover"
                                },
                                on: {
                                    click: this.toggleDropdown
                                },
                                domProps: {
                                    innerHTML: `<svg class="Icon Icon--close" role="presentation" viewBox="0 0 16 14">
                                                <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                                            </svg>`
                                }
                            }),
                            h('span', {
                                class: 'Popover__Title Heading u-h4'
                            }, 'Sort')
                        ]),
                        h("div", {
                            class: "Popover__Content"
                        }, [
                            h('div', {
                                class: 'Popover__ValueList',
                                attrs: {
                                    "data-scrollable": ""
                                }
                            }, [
                                this.options.map((o) => {
                                    return h('button', {
                                        staticClass: 'Popover__Value  Heading Link Link--primary u-h6',
                                        class: {
                                            "is-selected": (o.value === usf.queryRewriter.sort)
                                        },
                                        on: {
                                            click(e) {
                                                vm.pickSortValue(o.value);
                                            }
                                        },
                                        domProps: {
                                            innerHTML: `${o.label}`
                                        }
                                    })
                                })
                            ]),
                        ]
                            ),
                            
                    ])
                ])
        }
    }
    usf.register(UsfDropDownV2, null, 'usf-dropdownv2');


    /*Filter */
    var newFiltersBar = {
        data() {
            return {
                view: 'grid',
                drawerFilterShow: false,
                loc: usf.settings.translation,
                noFacets: false,
            }
        },
        mounted() {
            usf.event.add('sr_updated', () =>{
                this.noFacets = usf.search.noFacets;
            })

            var vm = this;
            if (document.querySelector('.PageOverlay')) {
                document.querySelector('.PageOverlay').addEventListener('click', function () {
                    if (vm.drawerFilterShow) {
                        vm.drawerFilterShow = false;

                        if (!usf.isMobile) {
                            if (vm.drawerFilterShow) {
                                vm.forShowFilter();
                            } else {
                                vm.forHiddenFilter();
                            }
                        }
                    }
                })
            }
            if (_usfSettingCollection.filterPosition == 'drawer')
                document.body.insertBefore(this.$refs['drawerFilter'], document.body.firstChild)

            usf.event.add('mobile_changed', () => {
                if (usf.isMobile) {
                    if (vm.drawerFilterShow) {
                        vm.drawerFilterShow = false;
                        vm.forHiddenFilter();
                    }
                }
            });

            addEvent(document, "click", (event) => {
                // If the clicked element doesn't have the right selector, bail
                if (!event.target.matches('.usf-close')) return;
                // Don't follow the link
                //event.preventDefault();
                vm.drawerFilterShow = false;
                vm.forHiddenFilter();
            });
        },
        render(h) {
            var sortFields = usf.settings.search.sortFields;
            return h('div', {
                class: 'CollectionToolbar CollectionToolbar--top CollectionToolbar--reverse'
            }, [
                h('div', {
                    class: 'CollectionToolbar__Group'
                }, [
                        sortFields ? h('usf-dropdownv2', {
                        props: {
                            value: usf.queryRewriter.sort || sortFields[0],
                            options: sortFields.map(f => {
                                return {
                                    label: usf.settings.translation['sortBy_' + f],
                                    value: f
                                }
                            })
                            }
                        }) : null,
                        ((this.drawer && !usf.settings.filters.horz) || usf.isMobile) ?
                        this.renderFilterButton(h) : null,
                ]),
                /*usf.isMobile ? null : h('span', { attrs: { id: 'usf_searchTotal' } }),
                this.renderChangeLayoutButton(h),*/
                (this.drawer) ?
                    this.renderFilterDrawer(h) : "",

            ])
        },
        computed: {
            drawer() {
                return _usfSettingCollection.filterPosition == 'drawer';
            }
        },
        beforeMount() {
            this.view = usf.queryRewriter.view.toString();
            this.facetFilters = ft_parseFacetFilters();
        },
        methods: {
            forShowFilter() {
                document.body.classList.add('usf-lockscroll-filters')
                document.querySelector('.PageOverlay').classList.add('is-visible')
            },

            forHiddenFilter() {
                document.body.classList.remove('usf-lockscroll-filters')
                document.body.classList.remove('usf-mobile-filters')
                document.querySelector('.PageOverlay').classList.remove('is-visible')
            },

            toggledrawerFilterShow() {
                this.drawerFilterShow = !this.drawerFilterShow;

                if (!usf.isMobile) {
                    if (this.drawerFilterShow) {
                        this.forShowFilter();
                    } else {
                        this.forHiddenFilter();
                    }
                }
            },
            renderFilterDrawer(h) {
                return h('div', {
                    ref: 'drawerFilter',
                    class: 'CollectionFilters Drawer Drawer--secondary Drawer--fromRight',
                    attrs: {
                        'aria-hidden': ((this.drawerFilterShow && !usf.isMobile) ? "false" : "true"),
                        tabindex: "-1",
                        id: 'usf-collection-filter-drawer'
                    }
                }, [
                    h('header', {
                        class: 'Drawer__Header Drawer__Header--bordered Drawer__Header--center Drawer__Container'
                    }, [
                        h('span', {
                            class: 'Drawer__Title Heading u-h4'
                        }, this.loc.filters),
                        h('button', {
                            class: 'Drawer__Close Icon-Wrapper--clickable',
                            attrs: {
                                'data-action': "close-drawer",
                                'data-drawer-id': "collection-filter-drawer",
                                'aria-label': "Close navigation"
                            },
                            on: {
                                click: this.toggledrawerFilterShow
                            },
                            domProps: {
                                innerHTML: `<svg class="Icon Icon--close"
                role="presentation" viewBox="0 0 16 14">
                <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
            </svg>`
                            }
                        })
                    ]),
                    h('div', {
                        class: 'Drawer__Content'
                    }, [
                        h('div', {
                            class: 'Drawer__Main',
                            attrs: {
                                "data-scrollable": ""
                            }
                        }, [
                            h('div', {
                                attrs: {
                                    id: 'usf-sf-filter-tree'
                                }
                            }, [
                                h('block-filter-v1')
                            ])
                        ])
                    ])
                ])
            },
            renderFilterButton(h) {
                return h('button', {
                    class: "CollectionToolbar__Item CollectionToolbar__Item--filter Heading Text--subdued u-h6",
                    style: this.noFacets ? 'display: none' : null,
                    //style: 'display: none',
                    attrs: {
                        "data-action": "open-drawer",
                        "data-drawer-id": "usf-collection-filter-drawer",
                        "aria-label": "Show filters"
                    },
                    on: {
                        click: this.filterTriggerClick
                    }
                }, 'Filter')
            },
            filterTriggerClick() {
                if (usf.isMobile)
                    document.body.classList.toggle('usf-mobile-filters')

                this.toggledrawerFilterShow()
            },
            onGridViewClick() {
                this.view = "grid";
                usf.queryRewriter.view = 'grid';

                usf.query.remove('_usf_view');
                usf.event.raise('sr_viewChanged', this, 'grid');
            },

            onListViewClick() {
                this.view = "list";
                usf.queryRewriter.view = 'list';

                usf.query.add({ _usf_view: 'list' });
                usf.event.raise('sr_viewChanged', this, 'list');
            },
            renderChangeLayoutButton(h) {
                return h('div', {
                    class: 'CollectionToolbar__Item CollectionToolbar__Item--layout'
                }, [
                    h('div', {
                        class: 'CollectionToolbar__LayoutSwitch'
                    }, [
                        h('button', {
                            staticClass: "CollectionToolbar__LayoutType",
                            class: {
                                'is-active': (this.view == 'list')
                            },
                            on: {
                                click: this.onListViewClick
                            },
                            domProps: {
                                innerHTML: `<svg class="Icon Icon--wall-1" viewBox="0 0 18 18" role="presentation">
                            <path d="M8 1.030067h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1zm-7-15h2c.55228475 0 1 .44771525 1 1v2c0 .55228475-.44771525 1-1 1H1c-.55228475 0-1-.44771525-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .44771525 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .4477153 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.5522847.44771525-1 1-1z" fill="currentColor" fill-rule="evenodd"></path>
                          </svg>`
                            }
                        }),
                        h('button', {
                            staticClass: "CollectionToolbar__LayoutType",
                            class: {
                                'is-active': (this.view == 'grid')
                            },
                            on: {
                                click: this.onGridViewClick
                            },
                            domProps: {
                                innerHTML: `<svg class="Icon Icon--wall-4" role="presentation" viewBox="0 0 36 36">
                            <path fill="currentColor" d="M28 36v-8h8v8h-8zm0-22h8v8h-8v-8zm0-14h8v8h-8V0zM14 28h8v8h-8v-8zm0-14h8v8h-8v-8zm0-14h8v8h-8V0zM0 28h8v8H0v-8zm0-14h8v8H0v-8zM0 0h8v8H0V0z"></path>
                        </svg>`
                            }
                        })
                    ])
                ])
            }
        }
    }

    usf.register(newFiltersBar, null, 'usf-new-filters-barv2');

    // hack for pass render issue of sidebar (for draw mode)
    var blockFilterV1 = {
        props: ['show'],
        methods: {

        },
        computed: {
            showSidebar() {
                return _usfSettingCollection.filterPosition != 'sidebar';
            }
        },
        render(h) {
            return h('div', [
                h('usf-filters', {
                    class: {
                        'usf-non-sidebarFilter': this.showSidebar
                    }
                })
            ]);
        }
    }
    usf.register(blockFilterV1, null, 'block-filter-v1');
    /*End Filter */

    var color_label = 'color,colour,couleur,colore,farbe,색,色,färg,farve';
    var _usfColorSwatch = {
        props: {
            value: {
                type: Object,
                required: true
            },
            selectedImage: {
                type: Object
            },
            scaledSelectedImageUrl: {
                type: String
            },
            productUrl: {
                type: String
            },
        },
        data() {
            var colorValues = [], defaultColor = "", currentVariantId = '';
            var product = this.value;
            var productOptions = product.options;
            for (var i = 0; i < productOptions.length; i++) {
                var o = productOptions[i];
                if (color_label.includes(o.name.toLowerCase())) {
                    if (o.values) colorValues = [...colorValues, ...o.values]
                }
            }

            var selectedVariantForPrice = this.$parent.selectedVariantForPrice;

            var opts = selectedVariantForPrice.options;
            for (var i = 0; i < colorValues.length; i++) {
                var color = colorValues[i];
                if (opts.includes(color)) {
                    defaultColor = color;
                    break;
                }
            }
            //console.log("defaultColor : ", defaultColor)
            return {
                currentBgImages: {},
                defaultColor: defaultColor,
                product: product
            }
        },
        methods: {
            renderOptionValues(h, o, optionIndex) {
                var p = this.product;
                var arr = []
                o.values.map((value, i) => {
                    var downcased_value = value.toLowerCase();
                    var color_id = 'collection-template-' + p.id + '-' + optionIndex + '-' + i;
                    var color_name = 'collection-template-' + p.id + '-' + optionIndex;
                    var variant_for_value = "";
                    for (let j = 0; j < p.variants.length; j++) {
                        var v = p.variants[j];
                        if (o.values[v.options[optionIndex]] == value) {
                            variant_for_value = v;
                            break;
                        }
                    }
                    var variant_image_url = _usfGetScaledImageUrl(this.scaledSelectedImageUrl);
                    var ratio = this.selectedImage.width / this.selectedImage.height;
                    if (p.images[variant_for_value.imageIndex]) {
                        var img = p.images[variant_for_value.imageIndex];
                        variant_image_url = img.url;
                        ratio = img.width / img.height;
                    }
                    var color_swatch_name = _usfHandlezie(value) + '_64x64.png';

                    var imageUrl = usfFilesUrl.replace('{0}', color_swatch_name);
                    usfImageExists(imageUrl, (v) => {
                        if (v)
                            this.$set(this.currentBgImages, value, imageUrl);
                    });

                    var x = h('div', {
                        staticClass: 'ProductItem__ColorSwatchItem'
                    }, [
                        h('input', {
                            class: 'ColorSwatch__Radio',
                            attrs: {
                                type: "radio",
                                name: color_name,
                                id: color_id,
                                value: value,
                                checked: this.defaultColor === value ? "checked" : null,
                                'data-variant-url': "/products/" + p.urlName + "?variant=" + (variant_for_value.id),
                                'data-image-url': variant_image_url,
                                'data-image-widths': "[" + _usfImageWidths + "]",
                                'data-image-aspect-ratio': ratio,
                                'aria-hidden': true
                            },
                            on: {
                                change: (e) => {
                                    var t = e.currentTarget;
                                    _colorChanged(e, t);
                                    this.$parent.selectedVariantForPrice = variant_for_value;
                                    this.product.selectedVariantId = variant_for_value.id;
                                    if (this.$parent.setSelectedVariantId(variant_for_value.id)){
                                        // reset lazyloaded elements
                                        this.$parent.$el.querySelectorAll('.Image--lazyLoaded').forEach(el => el.classList.add('Image--lazyLoad'));
                                    }
                                    this.$emit('input', this.product);
                                }
                            }
                        }),
                        h('label', {
                            attrs: {
                                title: value,
                                'data-tooltip': value,
                                for: color_id
                            },
                            style: {
                                backgroundColor: this.currentBgImages[value] ? null : value.replace(' ', '').toLowerCase(),
                                backgroundImage: this.currentBgImages[value] ? 'url(' + imageUrl + ')' : null,
                            },
                            staticClass: 'ColorSwatch ColorSwatch--small'
                        })
                    ])
                    arr.push(x)
                })
                return arr;
            }
        },
        render(h) {
            var p = this.product;
            return h('div', {
                class: 'usf_swatch'
            }, [
                p.options.map((o, optionIndex) => {
                    var downcased_option = o.name.toLowerCase();
                    if (color_label.includes(downcased_option)) {
                        // var variant_option = index;
                        // return h('h1','haha')
                        return this.renderOptionValues(h, o, optionIndex)
                    }
                })
            ])
        }
    }
    usf.register(_usfColorSwatch, null, 'usf-color-swatch');

    // hack for pass render issue of sidebar for sidebar mode
    var blockFilterV2 = {
        methods: {

        },
        computed: {
            showSidebar() {
                return _usfSettingCollection.filterPosition != 'sidebar';
            }
        },
        render(h) {
            return h('div', {
                staticClass: 'CollectionInner__Sidebar CollectionInner__Sidebar--withTopToolbar',
                class: {
                    'usf-non-sidebarFilter': this.showSidebar
                }
            }, [
                h('usf-filters', {
                    class: {
                        'usf-non-sidebarFilter': this.showSidebar
                    }
                })
            ]);
        }
    }
    usf.register(blockFilterV2, null, 'block-filter-v2');
});

function _usfOnAddToCartSuccess(rs, formElement) {
    var addToCartBtn = formElement.querySelector('.usf-add-to-cart-btn');
    // We simply trigger an event so the mini-cart can re-render
    addToCartBtn.dispatchEvent(new CustomEvent('product:added', {
        bubbles: true,
        detail: {
            variant: parseInt(formElement.querySelector('[name="id"]').value),
            quantity: parseInt(formElement.querySelector('[name="quantity"]').value)
        }
    }));
}

function _usfOnAddToCartError(content, formElement) {
    var addToCartBtn = formElement.querySelector('.usf-add-to-cart-btn');
    var msg = content['description'];
    var errorMessageElement = document.createElement('span');
    errorMessageElement.className = 'ProductForm__Error Alert Alert--error';
    errorMessageElement.innerHTML = msg;
    addToCartBtn.removeAttribute('disabled');
    var prdEl = formElement.closest('.usf-sr-product');
    var _usfErrorCart = formElement.querySelector('._usfErrorCart') || prdEl ? prdEl.querySelector('._usfErrorCart') : null;

    var lbl = addToCartBtn.querySelector('.usf-label');
    if (_usfErrorCart)
        _usfErrorCart.insertAdjacentElement('afterend', errorMessageElement);
    else {
        if (!lbl._oldText)
            lbl._oldText = lbl.innerHTML;
        lbl.innerHTML = msg
    }

    setTimeout(function () {
        errorMessageElement.remove();
        if (lbl._oldText)
            lbl.innerHTML = lbl._oldText
    }, 2500);
}



usf.event.add('init', function () {
    if (usf.settings.instantSearch.online) {
        if (usf.isMobile) {
            function _usfShowInstantSearchPP() {
                var target = document.querySelector(".Search__Form input.Search__Input") || document.createElement('input');
                usf.event.raise('is_show', target);
            }
            // User clicks on the search icon => show our popup
            document.querySelectorAll('a[data-action="toggle-search"]').forEach(searchIcon =>
                searchIcon.addEventListener('click', function () {
                    _usfShowInstantSearchPP();
                })
            );
            //for 1.6 ver
            if (document.querySelector('[data-action="open-modal"]')) {
                document.querySelector('[data-action="open-modal"]').addEventListener('click', function () {
                    _usfShowInstantSearchPP();
                })
            }
        }

        // Handle theme search input box
        var sr = document.querySelector('.Search__Results');
        if(sr)
            sr.parentNode.removeChild(sr);

        /////////////////////////
        var hideDrawerDlg = function () {
            // Close the Drawer
            if (usf.isMobile) {
                var searchClose = document.querySelector('.Search__Close');
                if(searchClose)
                    searchClose.click();
                
                var drawerClose = document.querySelector('.Drawer__Close');
                if(drawerClose)
                    drawerClose.click();
            }
        }

        // if the instant search is already showing, execute the dlg
        if (usf.isInstantSearchShowing)
            hideDrawerDlg();

        // still register to 'is_show' event to hide the drawer.
        usf.event.add('is_show', hideDrawerDlg);

        // hide theme overlay when the instant search popup is closed.
        usf.event.add('is_hide', function () {
            var searchClose = document.querySelector('.Search__Close');
            if(searchClose)
                searchClose.click();
        })
        /////////////////////////
    }
})
