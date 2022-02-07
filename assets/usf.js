/* USF file - Do not modify this file since it is regularly changed. Auto modified at: 10/31/2021 8:44:10 PM*/
/* Begin custom theme code */
// define templates for the Prestige theme
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
<div class="usf-sr-product Grid__Cell" :class="['1/' + _usfSettingCollection.mobile_items_per_row + '--phone','1/' + _usfSettingCollection.tablet_items_per_row + '--tablet-and-up','1/' + _usfSettingCollection.desktop_items_per_row + '--desk']" :key="product.Id"
    :product-selector="product.id">
    <div class="ProductItem" style="visibility: inherit; opacity: 1; transform: matrix(1, 0, 0, 1, 0, 0);">
        <div class="ProductItem__Wrapper" >
	        <a :href="productUrl" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave" class="ProductItem__ImageWrapper" :class="{'ProductItem__ImageWrapper--withAlternateImage':scaledHoverImageUrl}">
                <div :class="'AspectRatio AspectRatio--' + (_usfSettingCollection.use_natural_size ? 'withFallback' :_usfSettingCollection.product_image_size)" :style="'max-width: '+(selectedImage.width ? selectedImage.width : 125)+'px; --aspect-ratio: ' + _usfGetImageRatio(selectedImage)+';' + 100/_usfGetImageRatio(selectedImage) + '%;'">
                    <img key="new_p" v-if="_usfGlobalSettings.show_secondary_image && hoverImage" class="ProductItem__Image ProductItem__Image--alternate Image--lazyLoad Image--fadeIn" :data-widths="'[' + _usfImageWidths + ']'" data-sizes="auto" :data-srcset="_usfGetScaledImageUrl(scaledHoverImageUrl)" :data-src="_usfGetScaledImageUrl(scaledHoverImageUrl)">
                    <img class="ProductItem__Image Image--lazyLoad Image--fadeIn" :data-widths="'[' + _usfImageWidths + ']'" data-sizes="auto" :data-src="_usfGetScaledImageUrl(scaledSelectedImageUrl)">

                    <span class="Image__Loader"></span>
                    
                    <!-- product image extra -->
                    <usf-plugin name="searchResultsProductImageExtra" :data="pluginData"></usf-plugin>
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
                        <span class="ProductItem__Price Price Price--highlight Text--subdued" data-money-convertible v-html="displayDiscountedPrice"></span>
                        <span class="ProductItem__Price Price Price--compareAt Text--subdued" data-money-convertible v-html="displayPrice"></span>
                    </template>
                    <span v-else class="ProductItem__Price Price Text--subdued" v-html="priceVaries && !product.selectedVariantId ? loc.from + ' ' + displayMinDiscountedPrice : displayDiscountedPrice"></span>
                </div>
                <usf-color-swatch :value="product"  :selectedImage="selectedImage" :scaledSelectedImageUrl="scaledSelectedImageUrl" :productUrl="productUrl" v-if="_usfGetSettingColorSwatch() && !_usfSettingCollection.show_price_on_hover"></usf-color-swatch>
                <div v-if="product.tags.find(x => x.includes('label_'))" class="New__Badges Product__Item">
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
<a class="usf-sr-product list-view-item" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave"
    :href="productUrl" :key="product.id">
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
    addToCartPlugin: 
`<form class="usf-add-to-cart" :data-form-variant-id="variant.id" method="POST" enctype="multipart/form-data" :action="usf.platform.addToCartUrl">
    <input type="hidden" name="form_type" value="product">
    <input type="hidden" name="utf8" value="✓">
    <input type="hidden" name="quantity" value="1">
    <input type="hidden" name="id" :value="variant.id">
    <button type="submit" name="add" :class="{'usf-visible': args.isHover}" @click="previewPopupSubmit" class="usf-add-to-cart-btn" v-html="loc.addToCart" :style="{borderColor:settings.buttonBorderColor,color:settings.buttonTextColor,backgroundColor:settings.buttonBackgroundColor}"></button>
</form>`
,
    // Preview Plugin
    previewPlugin: /*inc_begin_preview-plugin*/
`<div class="usf-sr-preview" :class="[{'usf-visible': args.isHover},'usf-sr-' + settings.buttonPosition]" @click="onShowModal" :style="{backgroundColor:settings.iconBackgroundColor}">
    <div><svg :style="'width:initial;height:initial;fill:' + settings.iconTextColor" viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"><g transform="translate(0.000000,281.000000) scale(0.100000,-0.100000)"><path d="M4808.6,2770.8c-1219.3-67-2423.2-610.6-3684.6-1659.5C884.8,912.3,100,140.9,100,104.6c0-34.4,794.3-819.2,1004.9-993.4c1138.9-941.7,2195.4-1468.1,3273-1630.8c306.3-45.9,821.1-55.5,1110.2-19.1C6663.3-2391.4,7832.8-1807.6,9023.4-774C9274.1-553.9,9900,73.9,9900,108.4c0,30.6-803.9,823-1004.9,989.6c-1098.7,909.2-2151.4,1445.1-3177.3,1617.4c-189.5,32.5-625.9,70.8-735,65.1C4944.5,2778.5,4866,2774.7,4808.6,2770.8z M5497.7,2296.2c1181-158.9,2425.1-846,3590.8-1983l212.5-206.7l-231.6-225.9c-1158-1135-2434.7-1829.8-3629.1-1977.2c-227.8-26.8-700.5-23-937.9,7.7c-417.3,57.4-851.8,181.8-1282.4,369.4C2452.4-1384.6,1543.2-743.4,865.6-60L702.9,104.6l172.3,174.2c509.1,513,1248,1075.7,1856.6,1410.7c562.7,310.1,1196.3,530.2,1751.4,606.8C4728.2,2330.6,5250.7,2330.6,5497.7,2296.2z"/><path d="M4670.8,1855.9c-671.8-128.2-1213.5-633.6-1397.3-1307.3c-59.3-212.5-59.3-675.7,0-888.1c172.3-625.9,654.6-1110.2,1276.7-1280.5c222-61.3,677.6-61.3,899.6,0c622.1,170.3,1104.4,654.6,1276.7,1280.5c59.3,212.5,59.3,675.7,0,888.1c-172.3,627.8-662.3,1117.8-1276.7,1280.5C5246.9,1880.8,4875.6,1894.2,4670.8,1855.9z M5373.2,1387c233.5-72.7,386.6-166.5,566.6-344.5c268-266.1,388.6-557,388.6-937.9c0-379-120.6-669.9-390.5-937.9c-268-269.9-558.9-390.5-937.9-390.5c-241.2,0-386.6,34.4-612.5,145.5c-130.2,63.2-195.2,111-325.4,243.1c-273.7,275.6-392.4,557-392.4,939.8c0,382.8,118.7,664.2,392.4,937.9c210.5,212.5,436.4,331.1,723.5,382.8C4929.2,1452.1,5222,1432.9,5373.2,1387z"/><path d="M4818.2,508.4c-283.3-132.1-348.4-509.1-122.5-723.5c281.4-266,744.6-68.9,744.6,319.7c0,179.9-109.1,342.6-271.8,409.6C5072.7,554.4,4912,552.4,4818.2,508.4z"/></g></svg></div>
    <span v-html="loc.quickView" :style="{color:settings.iconTextColor}"></span>
</div>`
/*inc_end_preview-plugin*/,
    previewPluginModal: /*inc_begin_preview-modal*/
`<div><div class="usf-backdrop"></div><div class="usf-preview__wrapper usf-zone">
    <div class="usf-preview">
        <!-- Close button -->
        <div class="usf-remove" @click="onClose"></div>

        <!-- Body content -->
        <div class="usf-preview__body">
            <!-- left - images of product -->
            <div class="usf-preview__content-left">
                <!-- Big image -->
                <div class="usf-preview__image-slider">
                    <div type="button" title="Prev" class="usf-preview__image-slider__prev" @click="onPrevImage(0)" v-if="showBigImageNav">
                        <svg aria-hidden="true" viewBox="0 0 512 512" class=""><path fill="currentColor" d="M358 512c4 0 7-1 9-4 5-5 5-13 0-18L146 269 367 47c5-5 5-13 0-18s-13-5-18 0L119 260c-5 5-5 13 0 18l230 230c3 3 6 4 9 4z"></path></svg>
                    </div>

                    <div class="usf-preview__image-slider__track" :style="'max-width:' + ((image.height/image.width*imageMaxWidth > imageMaxHeight) ? (imageMaxHeight*image.width/image.height) + 'px' : '100%') + ';padding-bottom:' + ((image.height/image.width*imageMaxWidth > imageMaxHeight) ? (imageMaxHeight*100/imageMaxWidth) : (image.height/image.width*100)) + '%'">
                        <div v-for="i in images" class="usf-preview__image" :class="{'usf-active': image === i}">
                            <div class="usf-preview__image-img-wrapper">
                                <img :src="usf.platform.getImageUrl(i.url, 1024)">
                            </div>
                        </div>
                    </div>

                    <div type="button" title="Next" class="usf-preview__image-slider__next" @click="onNextImage(0)" v-if="showBigImageNav">
                        <svg aria-hidden="true" viewBox="0 0 512 512" class=""><path fill="currentColor" d="M128 512c-3 0-7-1-9-4-5-5-5-13 0-18l221-221L119 47c-5-5-5-13 0-18s13-5 18 0l230 231c5 5 5 13 0 18L137 508c-2 3-6 4-9 4z"></path></svg>
                    </div>

                    <ul class="usf-preview__image-slider__dots" v-if="showImageIndices && false">
                        <li :class="{'active':i===image}" v-for="(i,index) in images"  @click="onThumbClick(i)"><button type="button">{{index+1}}</button></li>
                    </ul>
                </div>

                <!-- Thumbnails -->
                <div class="usf-preview__thumbs usf-clear" v-if="showThumbs">
                    <div v-if="showThumbNav" class="usf-preview__thumbs-prev" @click="onPrevImage">
                        <svg aria-hidden="true" viewBox="0 0 512 512" class=""><path fill="currentColor" d="M358 512c4 0 7-1 9-4 5-5 5-13 0-18L146 269 367 47c5-5 5-13 0-18s-13-5-18 0L119 260c-5 5-5 13 0 18l230 230c3 3 6 4 9 4z"></path></svg>
                    </div>

                    <div class="usf-preview__thumbs-inner">
                        <div v-for="i in images" class="usf-preview__thumb" :class="{'usf-active': image === i}">
                            <img :src="usf.platform.getImageUrl(i.url, 'small')" @click="onThumbClick(i)">
                        </div>
                    </div>

                    <div v-if="showThumbNav" class="usf-preview__thumbs-next" @click="onNextImage">
                        <svg aria-hidden="true" viewBox="0 0 512 512" class=""><path fill="currentColor" d="M128 512c-3 0-7-1-9-4-5-5-5-13 0-18l221-221L119 47c-5-5-5-13 0-18s13-5 18 0l230 231c5 5 5 13 0 18L137 508c-2 3-6 4-9 4z"></path></svg>                        
                    </div>
                </div>
            </div>

            <!-- right - info of the product -->
            <div class="usf-preview__content-right">
                <!-- Product title -->
                <h1 class="usf-preview__title" v-html="product.title"></h1>

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
                <div class="usf-preview__description" :class="{'usf-loader':!description}" v-html="description"></div>

                <!-- Add to cart form -->
                <form method="post" enctype="multipart/form-data" :action="usf.platform.addToCartUrl">
                    <!-- variant ID -->
                    <input type="hidden" name="id" :value="selectedVariant.id" />

                    <!-- Options -->
                    <template v-for="(o,index) in product.options">
                        <usf-preview-modal-option :option="o" :index="index"></usf-preview-modal-option>
                    </template>

                    <!-- add to card button -->
                    <div class="usf-preview__field">
                        <label v-html="loc.quantity"></label>
                        <div class="usf-flex usf-preview__add-to-cart">
                            <input pattern="[0-9]*" min="1" :value="quantity" name="quantity" type="number" />
                            <button :title="!hasAvailableVariant ? loc.selectedVariantNotAvailable : ''" :disabled="!hasAvailableVariant" type="submit" name="add" class="usf-preview--add-to-cart-btn" :class="{ 'usf-disabled': !hasAvailableVariant}" :style="{color:settings.buttonTextColor,backgroundColor:settings.buttonBackgroundColor}" v-html="loc.addToCart"></button>
                        </div>
                    </div>
                </form>

                <!-- See details link -->
                <div class="usf-preview__link-wrapper">
                    <a class="usf-preview__link" :href="productUrl" v-html="loc.seeFullDetails"></a>
                </div>
            </div>
        </div>
    </div>
</div></div>`
/*inc_end_preview-modal*/,
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
        <button class="usf-clear-all usf-btn" v-html="loc.clearAll" @click="root.removeAllFacetFilters" :aria-label="loc.clearAllFilters"></button>
    </div>

    <!-- Breadcrumb Values -->
    <div class="usf-refineby__body">
        <template v-for="facetId in facetFilterIds" v-if="(facet = root.facets.find(fc => fc.id === facetId)) && (f = root.facetFilters[facetId])">
            <template v-for="queryValStr in f[1]">
                <div class="usf-refineby__item usf-pointer usf-clear" @click="root.removeFacetFilter(facetId, queryValStr)">
                    <button class="usf-btn"><span class="usf-filter-label" v-html="facet.title + ': '"></span><b v-html="root.formatBreadcrumbLabel(facet, f[0], queryValStr)"></b></button><span class="usf-remove"></span>
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
                <div v-else class="usf-all" v-html="loc.all"></div>
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
            <div class="usf-title usf-no-select" @click="onExpandCollapse">
                <button class="usf-label usf-btn" v-html="facet.title" :aria-label="usf.utils.format(loc.filterBy,facet.title)" :aria-expanded="!collapsed"></button>
                <usf-helptip v-if="facet.tooltip" :tooltip="facet.tooltip"></usf-helptip>            
                <!-- 'Clear all' button to clear the current facet filter. -->
                <button v-if="isInBreadcrumb" class="usf-clear-all usf-btn" :title="loc.clearFilterOptions" :aria-label="usf.utils.format(loc.clearFiltersBy,facet.title)" @click="onClear" v-html="loc.clear"></button>
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
    <button class="usf-children-toggle usf-btn" v-if="children" @click="onToggleChildren"></button>
    <button class="usf-label usf-btn" v-html="label" @click="onToggle"></button>

    <!-- product count -->
    <span v-if="!(!usf.settings.filterNavigation.showProductCount || (swatchImage && !usf.isMobile)) && option.value !== undefined" class="usf-value">{{option.value}}</span>    

    <div class="usf-children-container" v-if="children && !collapsed">
        <button :class="'usf-child-item usf-btn usf-facet-value' + (isChildSelected(c) ? ' usf-selected' : '')" v-for="c in children" v-html="getChildLabel(c)" @click="onChildClick(c)"></span>
    </div>
</div>
<div v-else :class="(isSelected ? 'usf-selected ' : '') + (swatchImage ? ' usf-facet-value--with-background' : '') + (' usf-relative usf-facet-value usf-facet-value-' + (facet.multiple ? 'multiple' : 'single'))" :title="isSwatch || isBox ? option.label + ' (' + option.value + ')' : undefined" :style="usf.isMobile ? null : swatchStyle" @click="onToggle">
    <!-- checkbox -->
    <div v-if="!isBox && !isSwatch && facet.multiple" :class="'usf-checkbox' + (isSelected ? ' usf-checked' : '')">
        <span class="usf-checkbox-inner"></span>
    </div>

    <!-- swatch image in mobile -->
    <div v-if="swatchImage && usf.isMobile" class="usf-mobile-swatch" :style="swatchStyle"></div>

    <!-- option label -->
    <button class="usf-label usf-btn" v-html="label"></button>

    <!-- helper for swatch -->
    <button v-if="isSwatch" class="usf-btn-helper usf-btn" :aria-checked="isSelected" role="checkbox"></button>
    
    <!-- product count -->
    <span v-if="!(!usf.settings.filterNavigation.showProductCount || (swatchImage && !usf.isMobile)) && option.value !== undefined" class="usf-value">{{option.value}}</span>
</div>`
/*inc_end_filter-option*/,



    // Instant search popup
    instantSearch: /*inc_begin_instantsearch*/
`<div :class="'usf-popup usf-zone usf-is usf-is--' + position + (shouldShow ? '' : ' usf-hide') + (isEmpty ? ' usf-empty' : '') + (firstLoader ? ' usf-is--first-loader': '')"  :style="usf.isMobile ? null : {left: this.left + 'px',top: this.top + 'px',width: this.width + 'px'}">
    <!-- Mobile search box -->
    <div v-if="usf.isMobile">
        <form class="usf-is__inputbox" :action="searchUrl" method="get" role="search">
            <span class="usf-icon usf-icon-back usf-close" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="arrow-back"><rect width="24" height="24" opacity="0" transform="rotate(90 12 12)"></rect><path fill="rgba(34,34,34/80%)" d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23 1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2z"></path></g></g></svg>
            </span>
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
                <div class="usf-is__matches">
                    <div class="usf-title" v-html="loc.productMatches"></div>
                    
                    <div class="usf-is__products" v-if="result.items.length">
                        <!-- Product -->
                        <usf-is-item v-for="p in result.items" :product="p" :result="result" :key="p.id + '-' + p.selectedVariantId"></usf-is-item>
                    </div>
                    <div class="usf-is__products" v-else style="background:url('//cdn.shopify.com/s/files/1/0257/0108/9360/t/85/assets/no-products.png?t=2') center no-repeat;min-height:250px"></div>
                </div>

                <!-- Suggestions, Collections, Pages -->
                <div class="usf-is__suggestions">
                    <!-- Suggestions -->
                    <template v-if="result.suggestions && result.suggestions.length">
                        <div class="usf-title" v-html="loc.searchSuggestions"></div>
                        <span v-for="s in result.suggestions" class="usf-is__suggestion" v-html="usf.utils.highlight(s, result.query)" @click="search(s)"></span>
                    </template>
                    
                    <!-- Collections -->
                    <template v-if="result.collections && result.collections.length">
                        <div class="usf-title" v-html="loc.collections"></div>

                        <template v-if="result.collections">
                            <span v-for="c in result.collections" class="usf-is__suggestion" v-html="usf.utils.highlight(c.title, result.query)" @click="selectCollection(c)"></span>
                        </template>
                    </template>

                    <!-- Pages -->
                    <template v-if="result.pages && result.pages.length">
                        <div class="usf-title" v-html="loc.pages"></div>

                        <template v-if="result.pages">
                            <span v-for="p in result.pages" class="usf-is__suggestion" v-html="usf.utils.highlight(p.title, result.query)" @click="selectPage(p)"></span>
                        </template>
                    </template>
                </div>
            </div>

            <!-- Footer -->
            <div class="usf-is__viewall">
                <span @click="search(queryOrTerm)" v-html="usf.utils.format(queryOrTerm ? loc.viewAllResultsFor : loc.viewAllResults, queryOrTerm)"></span>
            </div>
            
            <!-- Loader -->
            <div v-if="loader" class="usf-is__loader">
                <div class="usf-spinner"></div>
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

        },
        render(h) {
            var vm = this;
            return h('button', {
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
                            ])
                        ]
                        )
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
                                    this.$parent.$el.querySelectorAll('.Image--lazyLoaded').forEach(el => el.classList.add('Image--lazyLoad'));
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


function previewPopupSubmit(event) {
    if (_usfSettingCollection.useAjaxCart) {
        // Don't follow the link
        event.preventDefault();

        var addToCartButton = event.target;
        var formElement = addToCartButton.closest('form');
        var formData = new FormData(formElement)
        var objectData = {};
        formData.forEach(function (value, key) {
            objectData[key] = value;
        });

        addToCartButton.setAttribute('disabled', 'disabled');
        document.dispatchEvent(new CustomEvent('theme:loading:start'));



        fetch(usf.platform.baseUrl + '/cart/add.js', {
            body: JSON.stringify(objectData),
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header
            }
        }).then(function (response) {
            document.dispatchEvent(new CustomEvent('theme:loading:end'));
            if (response.ok) {
                addToCartButton.removeAttribute('disabled');
                // We simply trigger an event so the mini-cart can re-render
                addToCartButton.dispatchEvent(new CustomEvent('product:added', {
                    bubbles: true,
                    detail: {
                        variant: parseInt(formElement.querySelector('[name="id"]').value),
                        quantity: parseInt(formElement.querySelector('[name="quantity"]').value)
                    }
                }));
                var x = document.querySelector('.usf-preview__wrapper .usf-remove');
                if (x) x.click();
            } else {
                response.json().then(function (content) {
                    var errorMessageElement = document.createElement('span');
                    errorMessageElement.className = 'ProductForm__Error Alert Alert--error';
                    errorMessageElement.innerHTML = content['description'];
                    addToCartButton.removeAttribute('disabled');
                    var _usfErrorCart = formElement.querySelector('._usfErrorCart') || formElement.closest('.usf-sr-product').querySelector('._usfErrorCart');
                    _usfErrorCart.insertAdjacentElement('afterend', errorMessageElement);
                    setTimeout(function () {
                        errorMessageElement.remove();
                    }, 2500);
                });
            }
        });
    }
}



usf.event.add('init', function () {
    if (usf.settings.instantSearch.online) {
        if (usf.isMobile) {
            // User clicks on the search icon => show our popup
            document.querySelectorAll('a[data-action="toggle-search"]').forEach(searchIcon =>
                searchIcon.addEventListener('click', function () {
                    var target = document.querySelector(".Search__Form input.Search__Input") || document.createElement('input');
                    usf.event.raise('is_show', target);
                })
            );
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
/* End custom theme code */
/* Begin common theme code */

// unit test file is js\Source\tests\theme.common_tests.html
var _usfIsDynamicImage = usf.settings.search.imageSizeType === 'dynamic';

// return a list of image URLs for lazyload - TESTED, DONT CHANGE
// used when a theme use `data-srcset` attribute for lazyload.
function _usfGetImageUrls(imageUrl) {
    if (_usfIsDynamicImage)
        // in dynamic image size mode, {size} represents the image size
		return _usfImageWidths.map(w => imageUrl.replace('{size}', w) + ' ' + w + 'w').join(', ')
	
	return _usfImageWidths.map(w => imageUrl + ' ' + w + 'w').join(', ')
}

// used when a theme use `data-src` attribute only for lazyload - TESTED, DONT CHANGE
function _usfGetScaledImageUrl (url, size = '{width}') {
    if (_usfIsDynamicImage)
        return url.replace('{size}', size);
    
    var n = url.lastIndexOf('_');
    if (n === -1)
        return url;

    return url.substr(0, n) + url.substr(n).replace('_' + usf.settings.search.imageSize + 'x', '_' + size + 'x')
}

// get image ratio - TESTED, DONT CHANGE
function _usfGetImageRatio(img){
    return img.width/img.height
}

// get origin image with size (for swatchs...etc..) - TESTED, DONT CHANGE
function _usfGetOriginImgWithSize(url, size = '50x50') {
    var n = url.lastIndexOf(".");
    if (n != -1)
        return url.substring(0, n) + '_' + size + url.substring(n);
    else
        return url
}

// handle string to handle - TESTED, DONT CHANGE
// e.g.: product.title = "Hello Word" => handled: hello-word
function _usfHandlezie (str) {
    var x = str || "";
    return x.toLowerCase().replace("'", '').replace(/[^\w\u00C0-\u024f]+/g, "-").replace(/^-+|-+$/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

//split a string according to the number of words
function _usfTruncateWords (str, size = 10, description_words = '...') {
    if (!str)
        return "";
    var arr = str.split(' ', size);	
    if (arr.length < size)
        return str;
    return arr.join(' ') + description_words
}

//split a string according to the number of character
function _usfTruncate(str, size = 100, description_words = '...') {
    if (!str)
        return "";
    if (str.length  && str.length <= size)
        return str;
    return str.slice(0, size - description_words.length) + description_words
}

//split the string at a certain word
//first = true: get string before the word location
//first = false: get string after the word location
//ex: _usfSplitByText(product.description,'[/countdown]') for first || _usfSplitByText(product.description,'[/countdown]',false) for last
function _usfSplitByText(desc, txt,first = true, description_words = '...') {
    var arr = desc.split(txt);
    return first ? arr.shift() + description_words : arr.pop() + description_words
}

// append a query to URL
// ex: _usfAddQuery(productUrl,'view=ajax')
function _usfAddQuery(url, addon) {
    return url + (url.includes('?') ? '&' : '?') + addon
}

function _usfProductHasOnlyDefaultVariant(p) {
    return p.variants.length == 1 && !p.options.length
}


/* End common theme code */
/*!
 * Ultimate Search and Filter with A.I Power.
 * (c) Jason Dang - sobooster.com
*/
/*!
 * RVue.js v1.0.10
 * (c) Jason Dang
*/
/*!
 * Vue.js v2.6.10
 * (c) 2014-2020 Evan You
 * Released under the MIT License.
 */
!function(e,t){e.RVue=t()}(this,function(){"use strict";var e=Object.freeze({});function t(e){return null==e}function n(e){return null!=e}function r(e){return!0===e}function i(e){return"string"==typeof e||"number"==typeof e||"symbol"==typeof e||"boolean"==typeof e}function o(e){return null!==e&&"object"==typeof e}var a=Object.prototype.toString;function s(e){return"[object Object]"===a.call(e)}function c(e){var t=parseFloat(String(e));return t>=0&&Math.floor(t)===t&&isFinite(e)}function u(e){return n(e)&&"function"==typeof e.then&&"function"==typeof e.catch}function l(e){return null==e?"":Array.isArray(e)||s(e)&&e.toString===a?JSON.stringify(e,null,2):String(e)}function f(e){var t=parseFloat(e);return isNaN(t)?e:t}function p(e,t){for(var n=Object.create(null),r=e.split(","),i=0;i<r.length;i++)n[r[i]]=!0;return t?function(e){return n[e.toLowerCase()]}:function(e){return n[e]}}var d=p("slot,component",!0),v=p("key,ref,slot,slot-scope,is");function h(e,t){if(e.length){var n=e.indexOf(t);if(n>-1)return e.splice(n,1)}}var m=Object.prototype.hasOwnProperty;function y(e,t){return m.call(e,t)}function g(e){var t=Object.create(null);return function(n){return t[n]||(t[n]=e(n))}}var _=/-(\w)/g,b=g(function(e){return e.replace(_,function(e,t){return t?t.toUpperCase():""})}),$=g(function(e){return e.charAt(0).toUpperCase()+e.slice(1)}),w=/\B([A-Z])/g,x=g(function(e){return e.replace(w,"-$1").toLowerCase()});var A=Function.prototype.bind?function(e,t){return e.bind(t)}:function(e,t){function n(n){var r=arguments.length;return r?r>1?e.apply(t,arguments):e.call(t,n):e.call(t)}return n._length=e.length,n};function k(e,t){t=t||0;for(var n=e.length-t,r=new Array(n);n--;)r[n]=e[n+t];return r}function C(e,t){for(var n in t)e[n]=t[n];return e}function O(e){for(var t={},n=0;n<e.length;n++)e[n]&&C(t,e[n]);return t}function S(e,t,n){}var T=function(e,t,n){return!1};function j(e,t){if(e===t)return!0;var n=o(e),r=o(t);if(!n||!r)return!n&&!r&&String(e)===String(t);try{var i=Array.isArray(e),a=Array.isArray(t);if(i&&a)return e.length===t.length&&e.every(function(e,n){return j(e,t[n])});if(e instanceof Date&&t instanceof Date)return e.getTime()===t.getTime();if(i||a)return!1;var s=Object.keys(e),c=Object.keys(t);return s.length===c.length&&s.every(function(n){return j(e[n],t[n])})}catch(e){return!1}}function N(e,t){for(var n=0;n<e.length;n++)if(j(e[n],t))return n;return-1}function E(e){var t=!1;return function(){t||(t=!0,e.apply(this,arguments))}}var D=/a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;function I(e,t,n,r){Object.defineProperty(e,t,{value:n,enumerable:!!r,writable:!0,configurable:!0})}var M=new RegExp("[^"+D.source+".$_\\d]");var F,P="__proto__"in{},L="undefined"!=typeof window,R=L&&window.navigator.userAgent.toLowerCase(),H=R&&/msie|trident/.test(R),U=R&&R.indexOf("msie 9.0")>0,B=R&&R.indexOf("edge/")>0,z=(R&&R.indexOf("android"),R&&/iphone|ipad|ipod|ios/.test(R)),V=(R&&/chrome\/\d+/.test(R),R&&/phantomjs/.test(R),R&&R.match(/firefox\/(\d+)/)),K={}.watch,J=!1;if(L)try{var q={};Object.defineProperty(q,"passive",{get:function(){J=!0}}),window.addEventListener("test-passive",null,q)}catch(e){}var Z=function(){return void 0===F&&(F=!L&&"undefined"!=typeof global&&(global.process&&"server"===global.process.env.VUE_ENV)),F};function W(e){return"function"==typeof e&&/native code/.test(e.toString())}var G,X="undefined"!=typeof Symbol&&W(Symbol)&&"undefined"!=typeof Reflect&&W(Reflect.ownKeys);G="undefined"!=typeof Set&&W(Set)?Set:function(){function e(){this.set=Object.create(null)}return e.prototype.has=function(e){return!0===this.set[e]},e.prototype.add=function(e){this.set[e]=!0},e.prototype.clear=function(){this.set=Object.create(null)},e}();var Y="data-server-rendered",Q=["component","directive"],ee=["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated","errorCaptured","serverPrefetch"],te={keyCodes:Object.create(null),isReservedTag:T,isReservedAttr:T,isUnknownElement:T,getTagNamespace:S,parsePlatformTagName:function(e){return e},mustUseProp:T,async:!0,_lifecycleHooks:ee},ne=0,re=function(){this.id=ne++,this.subs=[]};re.prototype.addSub=function(e){this.subs.push(e)},re.prototype.removeSub=function(e){h(this.subs,e)},re.prototype.depend=function(){re.target&&re.target.addDep(this)},re.prototype.notify=function(){for(var e=this.subs.slice(),t=0,n=e.length;t<n;t++)e[t].update()},re.target=null;var ie=[];function oe(e){ie.push(e),re.target=e}function ae(){ie.pop(),re.target=ie[ie.length-1]}var se=function(e,t,n,r,i,o,a,s){this.tag=e,this.data=t,this.children=n,this.text=r,this.elm=i,this.ns=void 0,this.context=o,this.fnContext=void 0,this.fnOptions=void 0,this.fnScopeId=void 0,this.key=t&&t.key,this.componentOptions=a,this.componentInstance=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1,this.isOnce=!1,this.asyncFactory=s,this.asyncMeta=void 0,this.isAsyncPlaceholder=!1},ce={child:{configurable:!0}};ce.child.get=function(){return this.componentInstance},Object.defineProperties(se.prototype,ce);var ue=function(e){void 0===e&&(e="");var t=new se;return t.text=e,t.isComment=!0,t};function le(e){return new se(void 0,void 0,void 0,String(e))}function fe(e){var t=new se(e.tag,e.data,e.children&&e.children.slice(),e.text,e.elm,e.context,e.componentOptions,e.asyncFactory);return t.ns=e.ns,t.isStatic=e.isStatic,t.key=e.key,t.isComment=e.isComment,t.fnContext=e.fnContext,t.fnOptions=e.fnOptions,t.fnScopeId=e.fnScopeId,t.asyncMeta=e.asyncMeta,t.isCloned=!0,t}var pe=Array.prototype,de=Object.create(pe);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(e){var t=pe[e];I(de,e,function(){for(var n=[],r=arguments.length;r--;)n[r]=arguments[r];var i,o=t.apply(this,n),a=this.__ob__;switch(e){case"push":case"unshift":i=n;break;case"splice":i=n.slice(2)}return i&&a.observeArray(i),a.dep.notify(),o})});var ve=Object.getOwnPropertyNames(de),he=!0;function me(e){he=e}var ye=function(e){var t;this.value=e,this.dep=new re,this.vmCount=0,I(e,"__ob__",this),Array.isArray(e)?(P?(t=de,e.__proto__=t):function(e,t,n){for(var r=0,i=n.length;r<i;r++){var o=n[r];I(e,o,t[o])}}(e,de,ve),this.observeArray(e)):this.walk(e)};function ge(e,t){var n;if(o(e)&&!(e instanceof se))return y(e,"__ob__")&&e.__ob__ instanceof ye?n=e.__ob__:he&&!Z()&&(Array.isArray(e)||s(e))&&Object.isExtensible(e)&&!e._isVue&&(n=new ye(e)),t&&n&&n.vmCount++,n}function _e(e,t,n,r,i){var o=new re,a=Object.getOwnPropertyDescriptor(e,t);if(!a||!1!==a.configurable){var s=a&&a.get,c=a&&a.set;s&&!c||2!==arguments.length||(n=e[t]);var u=!i&&ge(n);Object.defineProperty(e,t,{enumerable:!0,configurable:!0,get:function(){var t=s?s.call(e):n;return re.target&&(o.depend(),u&&(u.dep.depend(),Array.isArray(t)&&function e(t){for(var n=void 0,r=0,i=t.length;r<i;r++)(n=t[r])&&n.__ob__&&n.__ob__.dep.depend(),Array.isArray(n)&&e(n)}(t))),t},set:function(t){var r=s?s.call(e):n;t===r||t!=t&&r!=r||s&&!c||(c?c.call(e,t):n=t,u=!i&&ge(t),o.notify())}})}}function be(e,t,n){if(Array.isArray(e)&&c(t))return e.length=Math.max(e.length,t),e.splice(t,1,n),n;if(t in e&&!(t in Object.prototype))return e[t]=n,n;var r=e.__ob__;return e._isVue||r&&r.vmCount?n:r?(_e(r.value,t,n),r.dep.notify(),n):(e[t]=n,n)}function $e(e,t){if(Array.isArray(e)&&c(t))e.splice(t,1);else{var n=e.__ob__;e._isVue||n&&n.vmCount||y(e,t)&&(delete e[t],n&&n.dep.notify())}}ye.prototype.walk=function(e){for(var t=Object.keys(e),n=0;n<t.length;n++)_e(e,t[n])},ye.prototype.observeArray=function(e){for(var t=0,n=e.length;t<n;t++)ge(e[t])};var we=Object.create(null);function xe(e,t){if(!t)return e;for(var n,r,i,o=X?Reflect.ownKeys(t):Object.keys(t),a=0;a<o.length;a++)"__ob__"!==(n=o[a])&&(r=e[n],i=t[n],y(e,n)?r!==i&&s(r)&&s(i)&&xe(r,i):be(e,n,i));return e}function Ae(e,t,n){return n?function(){var r="function"==typeof t?t.call(n,n):t,i="function"==typeof e?e.call(n,n):e;return r?xe(r,i):i}:t?e?function(){return xe("function"==typeof t?t.call(this,this):t,"function"==typeof e?e.call(this,this):e)}:t:e}function ke(e,t){var n=t?e?e.concat(t):Array.isArray(t)?t:[t]:e;return n?function(e){for(var t=[],n=0;n<e.length;n++)-1===t.indexOf(e[n])&&t.push(e[n]);return t}(n):n}function Ce(e,t,n,r){var i=Object.create(e||null);return t?C(i,t):i}we.data=function(e,t,n){return n?Ae(e,t,n):t&&"function"!=typeof t?e:Ae(e,t)},ee.forEach(function(e){we[e]=ke}),Q.forEach(function(e){we[e+"s"]=Ce}),we.watch=function(e,t,n,r){if(e===K&&(e=void 0),t===K&&(t=void 0),!t)return Object.create(e||null);if(!e)return t;var i={};for(var o in C(i,e),t){var a=i[o],s=t[o];a&&!Array.isArray(a)&&(a=[a]),i[o]=a?a.concat(s):Array.isArray(s)?s:[s]}return i},we.props=we.methods=we.inject=we.computed=function(e,t,n,r){if(!e)return t;var i=Object.create(null);return C(i,e),t&&C(i,t),i},we.provide=Ae;var Oe=function(e,t){return void 0===t?e:t};function Se(e,t,n){if("function"==typeof t&&(t=t.options),function(e,t){var n=e.props;if(n){var r,i,o={};if(Array.isArray(n))for(r=n.length;r--;)"string"==typeof(i=n[r])&&(o[b(i)]={type:null});else if(s(n))for(var a in n)i=n[a],o[b(a)]=s(i)?i:{type:i};e.props=o}}(t),function(e,t){var n=e.inject;if(n){var r=e.inject={};if(Array.isArray(n))for(var i=0;i<n.length;i++)r[n[i]]={from:n[i]};else if(s(n))for(var o in n){var a=n[o];r[o]=s(a)?C({from:o},a):{from:a}}}}(t),function(e){var t=e.directives;if(t)for(var n in t){var r=t[n];"function"==typeof r&&(t[n]={bind:r,update:r})}}(t),!t._base&&(t.extends&&(e=Se(e,t.extends,n)),t.mixins))for(var r=0,i=t.mixins.length;r<i;r++)e=Se(e,t.mixins[r],n);var o,a={};for(o in e)c(o);for(o in t)y(e,o)||c(o);function c(r){var i=we[r]||Oe;a[r]=i(e[r],t[r],n,r)}return a}function Te(e,t,n,r){if("string"==typeof n){var i=e[t];if(y(i,n))return i[n];var o=b(n);if(y(i,o))return i[o];var a=$(o);return y(i,a)?i[a]:i[n]||i[o]||i[a]}}function je(e,t,n,r){var i=t[e],o=!y(n,e),a=n[e],s=De(Boolean,i.type);if(s>-1)if(o&&!y(i,"default"))a=!1;else if(""===a||a===x(e)){var c=De(String,i.type);(c<0||s<c)&&(a=!0)}if(void 0===a){a=function(e,t,n){if(!y(t,"default"))return;var r=t.default;if(e&&e.$options.propsData&&void 0===e.$options.propsData[n]&&void 0!==e._props[n])return e._props[n];return"function"==typeof r&&"Function"!==Ne(t.type)?r.call(e):r}(r,i,e);var u=he;me(!0),ge(a),me(u)}return a}function Ne(e){var t=e&&e.toString().match(/^\s*function (\w+)/);return t?t[1]:""}function Ee(e,t){return Ne(e)===Ne(t)}function De(e,t){if(!Array.isArray(t))return Ee(t,e)?0:-1;for(var n=0,r=t.length;n<r;n++)if(Ee(t[n],e))return n;return-1}function Ie(e,t,n){oe();try{if(t)for(var r=t;r=r.$parent;){var i=r.$options.errorCaptured;if(i)for(var o=0;o<i.length;o++)try{if(!1===i[o].call(r,e,t,n))return}catch(e){Fe(e,r,"errorCaptured hook")}}Fe(e,t,n)}finally{ae()}}function Me(e,t,n,r,i){var o;try{(o=n?e.apply(t,n):e.call(t))&&!o._isVue&&u(o)&&!o._handled&&(o.catch(function(e){return Ie(e,r,i+" (Promise/async)")}),o._handled=!0)}catch(e){Ie(e,r,i)}return o}function Fe(e,t,n){!function(e,t,n){if(!L||"undefined"==typeof console)throw e;console.error(e)}(e)}var Pe,Le=!1,Re=[],He=!1;function Ue(){He=!1;var e=Re.slice(0);Re.length=0;for(var t=0;t<e.length;t++)e[t]()}if("undefined"!=typeof Promise&&W(Promise)){var Be=Promise.resolve();Pe=function(){Be.then(Ue),z&&setTimeout(S)},Le=!0}else if(H||"undefined"==typeof MutationObserver||!W(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())Pe="undefined"!=typeof setImmediate&&W(setImmediate)?function(){setImmediate(Ue)}:function(){setTimeout(Ue,0)};else{var ze=1,Ve=new MutationObserver(Ue),Ke=document.createTextNode(String(ze));Ve.observe(Ke,{characterData:!0}),Pe=function(){ze=(ze+1)%2,Ke.data=String(ze)},Le=!0}function Je(e,t){var n;if(Re.push(function(){if(e)try{e.call(t)}catch(e){Ie(e,t,"nextTick")}else n&&n(t)}),He||(He=!0,Pe()),!e&&"undefined"!=typeof Promise)return new Promise(function(e){n=e})}var qe=new G;function Ze(e){!function e(t,n){var r,i;var a=Array.isArray(t);if(!a&&!o(t)||Object.isFrozen(t)||t instanceof se)return;if(t.__ob__){var s=t.__ob__.dep.id;if(n.has(s))return;n.add(s)}if(a)for(r=t.length;r--;)e(t[r],n);else for(i=Object.keys(t),r=i.length;r--;)e(t[i[r]],n)}(e,qe),qe.clear()}var We=g(function(e){var t="&"===e.charAt(0),n="~"===(e=t?e.slice(1):e).charAt(0),r="!"===(e=n?e.slice(1):e).charAt(0);return{name:e=r?e.slice(1):e,once:n,capture:r,passive:t}});function Ge(e,t){function n(){var e=arguments,r=n.fns;if(!Array.isArray(r))return Me(r,null,arguments,t,"v-on handler");for(var i=r.slice(),o=0;o<i.length;o++)Me(i[o],null,e,t,"v-on handler")}return n.fns=e,n}function Xe(e,n,i,o,a,s){var c,u,l,f;for(c in e)u=e[c],l=n[c],f=We(c),t(u)||(t(l)?(t(u.fns)&&(u=e[c]=Ge(u,s)),r(f.once)&&(u=e[c]=a(f.name,u,f.capture)),i(f.name,u,f.capture,f.passive,f.params)):u!==l&&(l.fns=u,e[c]=l));for(c in n)t(e[c])&&o((f=We(c)).name,n[c],f.capture)}function Ye(e,i,o){var a;e instanceof se&&(e=e.data.hook||(e.data.hook={}));var s=e[i];function c(){o.apply(this,arguments),h(a.fns,c)}t(s)?a=Ge([c]):n(s.fns)&&r(s.merged)?(a=s).fns.push(c):a=Ge([s,c]),a.merged=!0,e[i]=a}function Qe(e,t,r,i,o){if(n(t)){if(y(t,r))return e[r]=t[r],o||delete t[r],!0;if(y(t,i))return e[r]=t[i],o||delete t[i],!0}return!1}function et(e){return i(e)?[le(e)]:Array.isArray(e)?function e(o,a){var s=[];var c,u,l,f;for(c=0;c<o.length;c++)t(u=o[c])||"boolean"==typeof u||(l=s.length-1,f=s[l],Array.isArray(u)?u.length>0&&(tt((u=e(u,(a||"")+"_"+c))[0])&&tt(f)&&(s[l]=le(f.text+u[0].text),u.shift()),s.push.apply(s,u)):i(u)?tt(f)?s[l]=le(f.text+u):""!==u&&s.push(le(u)):tt(u)&&tt(f)?s[l]=le(f.text+u.text):(r(o._isVList)&&n(u.tag)&&t(u.key)&&n(a)&&(u.key="__vlist"+a+"_"+c+"__"),s.push(u)));return s}(e):void 0}function tt(e){return n(e)&&n(e.text)&&!1===e.isComment}function nt(e,t){if(e){for(var n=Object.create(null),r=X?Reflect.ownKeys(e):Object.keys(e),i=0;i<r.length;i++){var o=r[i];if("__ob__"!==o){for(var a=e[o].from,s=t;s;){if(s._provided&&y(s._provided,a)){n[o]=s._provided[a];break}s=s.$parent}if(!s&&"default"in e[o]){var c=e[o].default;n[o]="function"==typeof c?c.call(t):c}}}return n}}function rt(e,t){if(!e||!e.length)return{};for(var n={},r=0,i=e.length;r<i;r++){var o=e[r],a=o.data;if(a&&a.attrs&&a.attrs.slot&&delete a.attrs.slot,o.context!==t&&o.fnContext!==t||!a||null==a.slot)(n.default||(n.default=[])).push(o);else{var s=a.slot,c=n[s]||(n[s]=[]);"template"===o.tag?c.push.apply(c,o.children||[]):c.push(o)}}for(var u in n)n[u].every(it)&&delete n[u];return n}function it(e){return e.isComment&&!e.asyncFactory||" "===e.text}function ot(t,n,r){var i,o=Object.keys(n).length>0,a=t?!!t.$stable:!o,s=t&&t.$key;if(t){if(t._normalized)return t._normalized;if(a&&r&&r!==e&&s===r.$key&&!o&&!r.$hasNormal)return r;for(var c in i={},t)t[c]&&"$"!==c[0]&&(i[c]=at(n,c,t[c]))}else i={};for(var u in n)u in i||(i[u]=st(n,u));return t&&Object.isExtensible(t)&&(t._normalized=i),I(i,"$stable",a),I(i,"$key",s),I(i,"$hasNormal",o),i}function at(e,t,n){var r=function(){var e=arguments.length?n.apply(null,arguments):n({});return(e=e&&"object"==typeof e&&!Array.isArray(e)?[e]:et(e))&&(0===e.length||1===e.length&&e[0].isComment)?void 0:e};return n.proxy&&Object.defineProperty(e,t,{get:r,enumerable:!0,configurable:!0}),r}function st(e,t){return function(){return e[t]}}function ct(e,t){var r,i,a,s,c;if(Array.isArray(e)||"string"==typeof e)for(r=new Array(e.length),i=0,a=e.length;i<a;i++)r[i]=t(e[i],i);else if("number"==typeof e)for(r=new Array(e),i=0;i<e;i++)r[i]=t(i+1,i);else if(o(e))if(X&&e[Symbol.iterator]){r=[];for(var u=e[Symbol.iterator](),l=u.next();!l.done;)r.push(t(l.value,r.length)),l=u.next()}else for(s=Object.keys(e),r=new Array(s.length),i=0,a=s.length;i<a;i++)c=s[i],r[i]=t(e[c],c,i);return n(r)||(r=[]),r._isVList=!0,r}function ut(e,t,n,r){var i,o=this.$scopedSlots[e];o?(n=n||{},r&&(n=C(C({},r),n)),i=o(n)||t):i=this.$slots[e]||t;var a=n&&n.slot;return a?this.$createElement("template",{slot:a},i):i}function lt(e,t){return Array.isArray(e)?-1===e.indexOf(t):e!==t}function ft(e,t,n,r,i){var o=te.keyCodes[t]||n;return i&&r&&!te.keyCodes[t]?lt(i,r):o?lt(o,e):r?x(r)!==t:void 0}function pt(e,t,n,r,i){if(n)if(o(n)){var a;Array.isArray(n)&&(n=O(n));var s=function(o){if("class"===o||"style"===o||v(o))a=e;else{var s=e.attrs&&e.attrs.type;a=r||te.mustUseProp(t,s,o)?e.domProps||(e.domProps={}):e.attrs||(e.attrs={})}var c=b(o),u=x(o);c in a||u in a||(a[o]=n[o],i&&((e.on||(e.on={}))["update:"+o]=function(e){n[o]=e}))};for(var c in n)s(c)}else;return e}function dt(e,t){var n=this._staticTrees||(this._staticTrees=[]),r=n[e];return r&&!t?r:(ht(r=n[e]=this.$options.staticRenderFns[e].call(this._renderProxy,null,this),"__static__"+e,!1),r)}function vt(e,t,n){return ht(e,"__once__"+t+(n?"_"+n:""),!0),e}function ht(e,t,n){if(Array.isArray(e))for(var r=0;r<e.length;r++)e[r]&&"string"!=typeof e[r]&&mt(e[r],t+"_"+r,n);else mt(e,t,n)}function mt(e,t,n){e.isStatic=!0,e.key=t,e.isOnce=n}function yt(e,t){if(t)if(s(t)){var n=e.on=e.on?C({},e.on):{};for(var r in t){var i=n[r],o=t[r];n[r]=i?[].concat(i,o):o}}else;return e}function gt(e,t,n,r){t=t||{$stable:!n};for(var i=0;i<e.length;i++){var o=e[i];Array.isArray(o)?gt(o,t,n):o&&(o.proxy&&(o.fn.proxy=!0),t[o.key]=o.fn)}return r&&(t.$key=r),t}function _t(e,t){for(var n=0;n<t.length;n+=2){var r=t[n];"string"==typeof r&&r&&(e[t[n]]=t[n+1])}return e}function bt(e,t){return"string"==typeof e?t+e:e}function $t(e){e._o=vt,e._n=f,e._s=l,e._l=ct,e._t=ut,e._q=j,e._i=N,e._m=dt,e._k=ft,e._b=pt,e._v=le,e._e=ue,e._u=gt,e._g=yt,e._d=_t,e._p=bt}function wt(t,n,i,o,a){var s,c=this,u=a.options;y(o,"_uid")?(s=Object.create(o))._original=o:(s=o,o=o._original);var l=r(u._compiled),f=!l;this.data=t,this.props=n,this.children=i,this.parent=o,this.listeners=t.on||e,this.injections=nt(u.inject,o),this.slots=function(){return c.$slots||ot(t.scopedSlots,c.$slots=rt(i,o)),c.$slots},Object.defineProperty(this,"scopedSlots",{enumerable:!0,get:function(){return ot(t.scopedSlots,this.slots())}}),l&&(this.$options=u,this.$slots=this.slots(),this.$scopedSlots=ot(t.scopedSlots,this.$slots)),u._scopeId?this._c=function(e,t,n,r){var i=Nt(s,e,t,n,r,f);return i&&!Array.isArray(i)&&(i.fnScopeId=u._scopeId,i.fnContext=o),i}:this._c=function(e,t,n,r){return Nt(s,e,t,n,r,f)}}function xt(e,t,n,r){var i=fe(e);return i.fnContext=n,i.fnOptions=r,t.slot&&((i.data||(i.data={})).slot=t.slot),i}function At(e,t){for(var n in t)e[b(n)]=t[n]}$t(wt.prototype);var kt={init:function(e,t){if(e.componentInstance&&!e.componentInstance._isDestroyed&&e.data.keepAlive){var r=e;kt.prepatch(r,r)}else{(e.componentInstance=function(e,t){var r={_isComponent:!0,_parentVnode:e,parent:t},i=e.data.inlineTemplate;n(i)&&(r.render=i.render,r.staticRenderFns=i.staticRenderFns);return new e.componentOptions.Ctor(r)}(e,Rt)).$mount(t?e.elm:void 0,t)}},prepatch:function(t,n){var r=n.componentOptions;!function(t,n,r,i,o){var a=i.data.scopedSlots,s=t.$scopedSlots,c=!!(a&&!a.$stable||s!==e&&!s.$stable||a&&t.$scopedSlots.$key!==a.$key),u=!!(o||t.$options._renderChildren||c);t.$options._parentVnode=i,t.$vnode=i,t._vnode&&(t._vnode.parent=i);if(t.$options._renderChildren=o,t.$attrs=i.data.attrs||e,t.$listeners=r||e,n&&t.$options.props){me(!1);for(var l=t._props,f=t.$options._propKeys||[],p=0;p<f.length;p++){var d=f[p],v=t.$options.props;l[d]=je(d,v,n,t)}me(!0),t.$options.propsData=n}r=r||e;var h=t.$options._parentListeners;t.$options._parentListeners=r,Lt(t,r,h),u&&(t.$slots=rt(o,i.context),t.$forceUpdate())}(n.componentInstance=t.componentInstance,r.propsData,r.listeners,n,r.children)},insert:function(e){var t,n=e.context,r=e.componentInstance;r._isMounted||(r._isMounted=!0,Bt(r,"mounted")),e.data.keepAlive&&(n._isMounted?((t=r)._inactive=!1,Vt.push(t)):Ut(r,!0))},destroy:function(e){var t=e.componentInstance;t._isDestroyed||(e.data.keepAlive?function e(t,n){if(n&&(t._directInactive=!0,Ht(t)))return;if(!t._inactive){t._inactive=!0;for(var r=0;r<t.$children.length;r++)e(t.$children[r]);Bt(t,"deactivated")}}(t,!0):t.$destroy())}},Ct=Object.keys(kt);function Ot(i,a,s,c,l){if(!t(i)){var f=s.$options._base;if(o(i)&&(i=f.extend(i)),"function"==typeof i){var p;if(t(i.cid)&&void 0===(i=function(e,i){if(r(e.error)&&n(e.errorComp))return e.errorComp;if(n(e.resolved))return e.resolved;var a=Dt;a&&n(e.owners)&&-1===e.owners.indexOf(a)&&e.owners.push(a);if(r(e.loading)&&n(e.loadingComp))return e.loadingComp;if(a&&!n(e.owners)){var s=e.owners=[a],c=!0,l=null,f=null;a.$on("hook:destroyed",function(){return h(s,a)});var p=function(e){for(var t=0,n=s.length;t<n;t++)s[t].$forceUpdate();e&&(s.length=0,null!==l&&(clearTimeout(l),l=null),null!==f&&(clearTimeout(f),f=null))},d=E(function(t){e.resolved=It(t,i),c?s.length=0:p(!0)}),v=E(function(t){n(e.errorComp)&&(e.error=!0,p(!0))}),m=e(d,v);return o(m)&&(u(m)?t(e.resolved)&&m.then(d,v):u(m.component)&&(m.component.then(d,v),n(m.error)&&(e.errorComp=It(m.error,i)),n(m.loading)&&(e.loadingComp=It(m.loading,i),0===m.delay?e.loading=!0:l=setTimeout(function(){l=null,t(e.resolved)&&t(e.error)&&(e.loading=!0,p(!1))},m.delay||200)),n(m.timeout)&&(f=setTimeout(function(){f=null,t(e.resolved)&&v(null)},m.timeout)))),c=!1,e.loading?e.loadingComp:e.resolved}}(p=i,f)))return function(e,t,n,r,i){var o=ue();return o.asyncFactory=e,o.asyncMeta={data:t,context:n,children:r,tag:i},o}(p,a,s,c,l);a=a||{},fn(i),n(a.model)&&function(e,t){var r=e.model&&e.model.prop||"value",i=e.model&&e.model.event||"input";(t.attrs||(t.attrs={}))[r]=t.model.value;var o=t.on||(t.on={}),a=o[i],s=t.model.callback;n(a)?(Array.isArray(a)?-1===a.indexOf(s):a!==s)&&(o[i]=[s].concat(a)):o[i]=s}(i.options,a);var d=function(e,r,i){var o=r.options.props;if(!t(o)){var a={},s=e.attrs,c=e.props;if(n(s)||n(c))for(var u in o){var l=x(u);Qe(a,c,u,l,!0)||Qe(a,s,u,l,!1)}return a}}(a,i);if(r(i.options.functional))return function(t,r,i,o,a){var s=t.options,c={},u=s.props;if(n(u))for(var l in u)c[l]=je(l,u,r||e);else n(i.attrs)&&At(c,i.attrs),n(i.props)&&At(c,i.props);var f=new wt(i,c,a,o,t),p=s.render.call(null,f._c,f);if(p instanceof se)return xt(p,i,f.parent,s);if(Array.isArray(p)){for(var d=et(p)||[],v=new Array(d.length),h=0;h<d.length;h++)v[h]=xt(d[h],i,f.parent,s);return v}}(i,d,a,s,c);var v=a.on;if(a.on=a.nativeOn,r(i.options.abstract)){var m=a.slot;a={},m&&(a.slot=m)}!function(e){for(var t=e.hook||(e.hook={}),n=0;n<Ct.length;n++){var r=Ct[n],i=t[r],o=kt[r];i===o||i&&i._merged||(t[r]=i?St(o,i):o)}}(a);var y=i.options.name||l;return new se("vue-component-"+i.cid+(y?"-"+y:""),a,void 0,void 0,void 0,s,{Ctor:i,propsData:d,listeners:v,tag:l,children:c},p)}}}function St(e,t){var n=function(n,r){e(n,r),t(n,r)};return n._merged=!0,n}var Tt=1,jt=2;function Nt(e,a,s,c,u,l){return(Array.isArray(s)||i(s))&&(u=c,c=s,s=void 0),r(l)&&(u=jt),function(e,i,a,s,c){if(n(a)&&n(a.__ob__))return ue();n(a)&&n(a.is)&&(i=a.is);if(!i)return ue();Array.isArray(s)&&"function"==typeof s[0]&&((a=a||{}).scopedSlots={default:s[0]},s.length=0);c===jt?s=et(s):c===Tt&&(s=function(e){for(var t=0;t<e.length;t++)if(Array.isArray(e[t]))return Array.prototype.concat.apply([],e);return e}(s));var u,l;if("string"==typeof i){var f;l=e.$vnode&&e.$vnode.ns||te.getTagNamespace(i),u=te.isReservedTag(i)?new se(te.parsePlatformTagName(i),a,s,void 0,void 0,e):a&&a.pre||!n(f=Te(e.$options,"components",i))?new se(i,a,s,void 0,void 0,e):Ot(f,a,e,s,i)}else u=Ot(i,a,e,s);return Array.isArray(u)?u:n(u)?(n(l)&&function e(i,o,a){i.ns=o;"foreignObject"===i.tag&&(o=void 0,a=!0);if(n(i.children))for(var s=0,c=i.children.length;s<c;s++){var u=i.children[s];n(u.tag)&&(t(u.ns)||r(a)&&"svg"!==u.tag)&&e(u,o,a)}}(u,l),n(a)&&function(e){o(e.style)&&Ze(e.style);o(e.class)&&Ze(e.class)}(a),u):ue()}(e,a,s,c,u)}var Et,Dt=null;function It(e,t){return(e.__esModule||X&&"Module"===e[Symbol.toStringTag])&&(e=e.default),o(e)?t.extend(e):e}function Mt(e,t){Et.$on(e,t)}function Ft(e,t){Et.$off(e,t)}function Pt(e,t){var n=Et;return function r(){null!==t.apply(null,arguments)&&n.$off(e,r)}}function Lt(e,t,n){Et=e,Xe(t,n||{},Mt,Ft,Pt,e),Et=void 0}var Rt=null;function Ht(e){for(;e&&(e=e.$parent);)if(e._inactive)return!0;return!1}function Ut(e,t){if(t){if(e._directInactive=!1,Ht(e))return}else if(e._directInactive)return;if(e._inactive||null===e._inactive){e._inactive=!1;for(var n=0;n<e.$children.length;n++)Ut(e.$children[n]);Bt(e,"activated")}}function Bt(e,t){oe();var n=e.$options[t],r=t+" hook";if(n)for(var i=0,o=n.length;i<o;i++)Me(n[i],e,null,e,r);e._hasHookEvent&&e.$emit("hook:"+t),ae()}var zt=[],Vt=[],Kt={},Jt=!1,qt=!1,Zt=0;var Wt=0,Gt=Date.now;if(L&&!H){var Xt=window.performance;Xt&&"function"==typeof Xt.now&&Gt()>document.createEvent("Event").timeStamp&&(Gt=function(){return Xt.now()})}function Yt(){var e,t;for(Wt=Gt(),qt=!0,zt.sort(function(e,t){return e.id-t.id}),Zt=0;Zt<zt.length;Zt++)(e=zt[Zt]).before&&e.before(),t=e.id,Kt[t]=null,e.run();var n=Vt.slice(),r=zt.slice();Zt=zt.length=Vt.length=0,Kt={},Jt=qt=!1,function(e){for(var t=0;t<e.length;t++)e[t]._inactive=!0,Ut(e[t],!0)}(n),function(e){var t=e.length;for(;t--;){var n=e[t],r=n.vm;r._watcher===n&&r._isMounted&&!r._isDestroyed&&Bt(r,"updated")}}(r)}var Qt=0,en=function(e,t,n,r,i){this.vm=e,i&&(e._watcher=this),e._watchers.push(this),r?(this.deep=!!r.deep,this.user=!!r.user,this.lazy=!!r.lazy,this.sync=!!r.sync,this.before=r.before):this.deep=this.user=this.lazy=this.sync=!1,this.cb=n,this.id=++Qt,this.active=!0,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new G,this.newDepIds=new G,this.expression="","function"==typeof t?this.getter=t:(this.getter=function(e){if(!M.test(e)){var t=e.split(".");return function(e){for(var n=0;n<t.length;n++){if(!e)return;e=e[t[n]]}return e}}}(t),this.getter||(this.getter=S)),this.value=this.lazy?void 0:this.get()};en.prototype.get=function(){var e;oe(this);var t=this.vm;try{e=this.getter.call(t,t)}catch(e){if(!this.user)throw e;Ie(e,t,'getter for watcher "'+this.expression+'"')}finally{this.deep&&Ze(e),ae(),this.cleanupDeps()}return e},en.prototype.addDep=function(e){var t=e.id;this.newDepIds.has(t)||(this.newDepIds.add(t),this.newDeps.push(e),this.depIds.has(t)||e.addSub(this))},en.prototype.cleanupDeps=function(){for(var e=this.deps.length;e--;){var t=this.deps[e];this.newDepIds.has(t.id)||t.removeSub(this)}var n=this.depIds;this.depIds=this.newDepIds,this.newDepIds=n,this.newDepIds.clear(),n=this.deps,this.deps=this.newDeps,this.newDeps=n,this.newDeps.length=0},en.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():function(e){var t=e.id;if(null==Kt[t]){if(Kt[t]=!0,qt){for(var n=zt.length-1;n>Zt&&zt[n].id>e.id;)n--;zt.splice(n+1,0,e)}else zt.push(e);Jt||(Jt=!0,Je(Yt))}}(this)},en.prototype.run=function(){if(this.active){var e=this.get();if(e!==this.value||o(e)||this.deep){var t=this.value;if(this.value=e,this.user)try{this.cb.call(this.vm,e,t)}catch(e){Ie(e,this.vm,'callback for watcher "'+this.expression+'"')}else this.cb.call(this.vm,e,t)}}},en.prototype.evaluate=function(){this.value=this.get(),this.dirty=!1},en.prototype.depend=function(){for(var e=this.deps.length;e--;)this.deps[e].depend()},en.prototype.teardown=function(){if(this.active){this.vm._isBeingDestroyed||h(this.vm._watchers,this);for(var e=this.deps.length;e--;)this.deps[e].removeSub(this);this.active=!1}};var tn={enumerable:!0,configurable:!0,get:S,set:S};function nn(e,t,n){tn.get=function(){return this[t][n]},tn.set=function(e){this[t][n]=e},Object.defineProperty(e,n,tn)}function rn(e){e._watchers=[];var t=e.$options;t.props&&function(e,t){var n=e.$options.propsData||{},r=e._props={},i=e.$options._propKeys=[];e.$parent&&me(!1);var o=function(o){i.push(o);var a=je(o,t,n,e);_e(r,o,a),o in e||nn(e,"_props",o)};for(var a in t)o(a);me(!0)}(e,t.props),t.methods&&function(e,t){e.$options.props;for(var n in t)e[n]="function"!=typeof t[n]?S:A(t[n],e)}(e,t.methods),t.data?function(e){var t=e.$options.data;s(t=e._data="function"==typeof t?function(e,t){oe();try{return e.call(t,t)}catch(e){return Ie(e,t,"data()"),{}}finally{ae()}}(t,e):t||{})||(t={});var n=Object.keys(t),r=e.$options.props,i=(e.$options.methods,n.length);for(;i--;){var o=n[i];r&&y(r,o)||(a=void 0,36!==(a=(o+"").charCodeAt(0))&&95!==a&&nn(e,"_data",o))}var a;ge(t,!0)}(e):ge(e._data={},!0),t.computed&&function(e,t){var n=e._computedWatchers=Object.create(null),r=Z();for(var i in t){var o=t[i],a="function"==typeof o?o:o.get;r||(n[i]=new en(e,a||S,S,on)),i in e||an(e,i,o)}}(e,t.computed),t.watch&&t.watch!==K&&function(e,t){for(var n in t){var r=t[n];if(Array.isArray(r))for(var i=0;i<r.length;i++)un(e,n,r[i]);else un(e,n,r)}}(e,t.watch)}var on={lazy:!0};function an(e,t,n){var r=!Z();"function"==typeof n?(tn.get=r?sn(t):cn(n),tn.set=S):(tn.get=n.get?r&&!1!==n.cache?sn(t):cn(n.get):S,tn.set=n.set||S),Object.defineProperty(e,t,tn)}function sn(e){return function(){var t=this._computedWatchers&&this._computedWatchers[e];if(t)return t.dirty&&t.evaluate(),re.target&&t.depend(),t.value}}function cn(e){return function(){return e.call(this,this)}}function un(e,t,n,r){return s(n)&&(r=n,n=n.handler),"string"==typeof n&&(n=e[n]),e.$watch(t,n,r)}var ln=0;function fn(e){var t=e.options;if(e.super){var n=fn(e.super);if(n!==e.superOptions){e.superOptions=n;var r=function(e){var t,n=e.options,r=e.sealedOptions;for(var i in n)n[i]!==r[i]&&(t||(t={}),t[i]=n[i]);return t}(e);r&&C(e.extendOptions,r),(t=e.options=Se(n,e.extendOptions)).name&&(t.components[t.name]=e)}}return t}function pn(e){this._init(e)}function dn(e){e.cid=0;var t=1;e.extend=function(e){e=e||{};var n=this,r=n.cid,i=e._Ctor||(e._Ctor={});if(i[r])return i[r];var o=e.name||n.options.name,a=function(e){this._init(e)};return(a.prototype=Object.create(n.prototype)).constructor=a,a.cid=t++,a.options=Se(n.options,e),a.super=n,a.options.props&&function(e){var t=e.options.props;for(var n in t)nn(e.prototype,"_props",n)}(a),a.options.computed&&function(e){var t=e.options.computed;for(var n in t)an(e.prototype,n,t[n])}(a),a.extend=n.extend,Q.forEach(function(e){a[e]=n[e]}),o&&(a.options.components[o]=a),a.superOptions=n.options,a.extendOptions=e,a.sealedOptions=C({},a.options),i[r]=a,a}}!function(t){t.prototype._init=function(t){var n=this;n._uid=ln++,n._isVue=!0,t&&t._isComponent?function(e,t){var n=e.$options=Object.create(e.constructor.options),r=t._parentVnode;n.parent=t.parent,n._parentVnode=r;var i=r.componentOptions;n.propsData=i.propsData,n._parentListeners=i.listeners,n._renderChildren=i.children,n._componentTag=i.tag,t.render&&(n.render=t.render,n.staticRenderFns=t.staticRenderFns)}(n,t):n.$options=Se(fn(n.constructor),t||{},n),n._renderProxy=n,n._self=n,function(e){var t=e.$options,n=t.parent;if(n&&!t.abstract){for(;n.$options.abstract&&n.$parent;)n=n.$parent;n.$children.push(e)}e.$parent=n,e.$root=n?n.$root:e,e.$children=[],e.$refs={},e._watcher=null,e._inactive=null,e._directInactive=!1,e._isMounted=!1,e._isDestroyed=!1,e._isBeingDestroyed=!1}(n),function(e){e._events=Object.create(null),e._hasHookEvent=!1;var t=e.$options._parentListeners;t&&Lt(e,t)}(n),function(t){t._vnode=null,t._staticTrees=null;var n=t.$options,r=t.$vnode=n._parentVnode,i=r&&r.context;t.$slots=rt(n._renderChildren,i),t.$scopedSlots=e,t._c=function(e,n,r,i){return Nt(t,e,n,r,i,!1)},t.$createElement=function(e,n,r,i){return Nt(t,e,n,r,i,!0)};var o=r&&r.data;_e(t,"$attrs",o&&o.attrs||e,null,!0),_e(t,"$listeners",n._parentListeners||e,null,!0)}(n),Bt(n,"beforeCreate"),function(e){var t=nt(e.$options.inject,e);t&&(me(!1),Object.keys(t).forEach(function(n){_e(e,n,t[n])}),me(!0))}(n),rn(n),function(e){var t=e.$options.provide;t&&(e._provided="function"==typeof t?t.call(e):t)}(n),Bt(n,"created"),n.$options.el&&n.$mount(n.$options.el)}}(pn),function(e){var t={get:function(){return this._data}},n={get:function(){return this._props}};Object.defineProperty(e.prototype,"$data",t),Object.defineProperty(e.prototype,"$props",n),e.prototype.$set=be,e.prototype.$delete=$e,e.prototype.$watch=function(e,t,n){if(s(t))return un(this,e,t,n);(n=n||{}).user=!0;var r=new en(this,e,t,n);if(n.immediate)try{t.call(this,r.value)}catch(e){Ie(e,this,'callback for immediate watcher "'+r.expression+'"')}return function(){r.teardown()}}}(pn),function(e){var t=/^hook:/;e.prototype.$on=function(e,n){var r=this;if(Array.isArray(e))for(var i=0,o=e.length;i<o;i++)r.$on(e[i],n);else(r._events[e]||(r._events[e]=[])).push(n),t.test(e)&&(r._hasHookEvent=!0);return r},e.prototype.$once=function(e,t){var n=this;function r(){n.$off(e,r),t.apply(n,arguments)}return r.fn=t,n.$on(e,r),n},e.prototype.$off=function(e,t){var n=this;if(!arguments.length)return n._events=Object.create(null),n;if(Array.isArray(e)){for(var r=0,i=e.length;r<i;r++)n.$off(e[r],t);return n}var o,a=n._events[e];if(!a)return n;if(!t)return n._events[e]=null,n;for(var s=a.length;s--;)if((o=a[s])===t||o.fn===t){a.splice(s,1);break}return n},e.prototype.$emit=function(e){var t=this._events[e];if(t){t=t.length>1?k(t):t;for(var n=k(arguments,1),r='event handler for "'+e+'"',i=0,o=t.length;i<o;i++)Me(t[i],this,n,this,r)}return this}}(pn),function(e){e.prototype._update=function(e,t){var n=this,r=n.$el,i=n._vnode,o=function(e){var t=Rt;return Rt=e,function(){Rt=t}}(n);n._vnode=e,n.$el=i?n.__patch__(i,e):n.__patch__(n.$el,e,t,!1),o(),r&&(r.__vue__=null),n.$el&&(n.$el.__vue__=n),n.$vnode&&n.$parent&&n.$vnode===n.$parent._vnode&&(n.$parent.$el=n.$el)},e.prototype.$forceUpdate=function(){this._watcher&&this._watcher.update()},e.prototype.$destroy=function(){var e=this;if(!e._isBeingDestroyed){Bt(e,"beforeDestroy"),e._isBeingDestroyed=!0;var t=e.$parent;!t||t._isBeingDestroyed||e.$options.abstract||h(t.$children,e),e._watcher&&e._watcher.teardown();for(var n=e._watchers.length;n--;)e._watchers[n].teardown();e._data.__ob__&&e._data.__ob__.vmCount--,e._isDestroyed=!0,e.__patch__(e._vnode,null),Bt(e,"destroyed"),e.$off(),e.$el&&(e.$el.__vue__=null),e.$vnode&&(e.$vnode.parent=null)}}}(pn),function(e){$t(e.prototype),e.prototype.$nextTick=function(e){return Je(e,this)},e.prototype._render=function(){var e,t=this,n=t.$options,r=n.render,i=n._parentVnode;i&&(t.$scopedSlots=ot(i.data.scopedSlots,t.$slots,t.$scopedSlots)),t.$vnode=i;try{Dt=t,e=r.call(t._renderProxy,t.$createElement)}catch(n){Ie(n,t,"render"),e=t._vnode}finally{Dt=null}return Array.isArray(e)&&1===e.length&&(e=e[0]),e instanceof se||(e=ue()),e.parent=i,e}}(pn),function(e){var t={get:function(){return te}};Object.defineProperty(e,"config",t),e.options=Object.create(null),Q.forEach(function(t){e.options[t+"s"]=Object.create(null)}),e.options._base=e,dn(e),function(e){Q.forEach(function(t){e[t]=function(e,n){return n?("component"===t&&s(n)&&(n.name=n.name||e,n=this.options._base.extend(n)),"directive"===t&&"function"==typeof n&&(n={bind:n,update:n}),this.options[t+"s"][e]=n,n):this.options[t+"s"][e]}})}(e)}(pn),Object.defineProperty(pn.prototype,"$isServer",{get:Z}),Object.defineProperty(pn.prototype,"$ssrContext",{get:function(){return this.$vnode&&this.$vnode.ssrContext}}),Object.defineProperty(pn,"FunctionalRenderContext",{value:wt});var vn=p("style,class"),hn=p("input,textarea,option,select,progress"),mn=function(e,t,n){return"value"===n&&hn(e)&&"button"!==t||"selected"===n&&"option"===e||"checked"===n&&"input"===e||"muted"===n&&"video"===e},yn=p("contenteditable,draggable,spellcheck"),gn=p("events,caret,typing,plaintext-only"),_n=function(e,t){return An(t)||"false"===t?"false":"contenteditable"===e&&gn(t)?t:"true"},bn=p("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),$n="http://www.w3.org/1999/xlink",wn=function(e){return":"===e.charAt(5)&&"xlink"===e.slice(0,5)},xn=function(e){return wn(e)?e.slice(6,e.length):""},An=function(e){return null==e||!1===e};function kn(e){for(var t=e.data,r=e,i=e;n(i.componentInstance);)(i=i.componentInstance._vnode)&&i.data&&(t=Cn(i.data,t));for(;n(r=r.parent);)r&&r.data&&(t=Cn(t,r.data));return function(e,t){if(n(e)||n(t))return On(e,Sn(t));return""}(t.staticClass,t.class)}function Cn(e,t){return{staticClass:On(e.staticClass,t.staticClass),class:n(e.class)?[e.class,t.class]:t.class}}function On(e,t){return e?t?e+" "+t:e:t||""}function Sn(e){return Array.isArray(e)?function(e){for(var t,r="",i=0,o=e.length;i<o;i++)n(t=Sn(e[i]))&&""!==t&&(r&&(r+=" "),r+=t);return r}(e):o(e)?function(e){var t="";for(var n in e)e[n]&&(t&&(t+=" "),t+=n);return t}(e):"string"==typeof e?e:""}var Tn={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},jn=p("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),Nn=p("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),En=function(e){return jn(e)||Nn(e)};function Dn(e){return Nn(e)?"svg":"math"===e?"math":void 0}var In=Object.create(null);var Mn=p("text,number,password,search,email,tel,url");function Fn(e){if("string"==typeof e){var t=document.querySelector(e);return t||document.createElement("div")}return e}var Pn=Object.freeze({__proto__:null,createElement:function(e,t){var n=document.createElement(e);return"select"!==e?n:(t.data&&t.data.attrs&&void 0!==t.data.attrs.multiple&&n.setAttribute("multiple","multiple"),n)},createElementNS:function(e,t){return document.createElementNS(Tn[e],t)},createTextNode:function(e){return document.createTextNode(e)},createComment:function(e){return document.createComment(e)},insertBefore:function(e,t,n){e.insertBefore(t,n)},removeChild:function(e,t){e.removeChild(t)},appendChild:function(e,t){e.appendChild(t)},parentNode:function(e){return e.parentNode},nextSibling:function(e){return e.nextSibling},tagName:function(e){return e.tagName},setTextContent:function(e,t){e.textContent=t},setStyleScope:function(e,t){e.setAttribute(t,"")}}),Ln={create:function(e,t){Rn(t)},update:function(e,t){e.data.ref!==t.data.ref&&(Rn(e,!0),Rn(t))},destroy:function(e){Rn(e,!0)}};function Rn(e,t){var r=e.data.ref;if(n(r)){var i=e.context,o=e.componentInstance||e.elm,a=i.$refs;t?Array.isArray(a[r])?h(a[r],o):a[r]===o&&(a[r]=void 0):e.data.refInFor?Array.isArray(a[r])?a[r].indexOf(o)<0&&a[r].push(o):a[r]=[o]:a[r]=o}}var Hn=new se("",{},[]),Un=["create","activate","update","remove","destroy"];function Bn(e,i){return e&&i&&e.key===i.key&&(e.tag===i.tag&&e.isComment===i.isComment&&n(e.data)===n(i.data)&&function(e,t){if("input"!==e.tag)return!0;var r,i=n(r=e.data)&&n(r=r.attrs)&&r.type,o=n(r=t.data)&&n(r=r.attrs)&&r.type;return i===o||Mn(i)&&Mn(o)}(e,i)||r(e.isAsyncPlaceholder)&&e.asyncFactory===i.asyncFactory&&t(i.asyncFactory.error))}function zn(e,t,r){var i,o,a={};for(i=t;i<=r;++i)n(o=e[i].key)&&(a[o]=i);return a}var Vn={create:Kn,update:Kn,destroy:function(e){Kn(e,Hn)}};function Kn(e,t){(e.data.directives||t.data.directives)&&function(e,t){var n,r,i,o=e===Hn,a=t===Hn,s=qn(e.data.directives,e.context),c=qn(t.data.directives,t.context),u=[],l=[];for(n in c)r=s[n],i=c[n],r?(i.oldValue=r.value,i.oldArg=r.arg,Wn(i,"update",t,e),i.def&&i.def.componentUpdated&&l.push(i)):(Wn(i,"bind",t,e),i.def&&i.def.inserted&&u.push(i));if(u.length){var f=function(){for(var n=0;n<u.length;n++)Wn(u[n],"inserted",t,e)};o?Ye(t,"insert",f):f()}l.length&&Ye(t,"postpatch",function(){for(var n=0;n<l.length;n++)Wn(l[n],"componentUpdated",t,e)});if(!o)for(n in s)c[n]||Wn(s[n],"unbind",e,e,a)}(e,t)}var Jn=Object.create(null);function qn(e,t){var n,r,i=Object.create(null);if(!e)return i;for(n=0;n<e.length;n++)(r=e[n]).modifiers||(r.modifiers=Jn),i[Zn(r)]=r,r.def=Te(t.$options,"directives",r.name);return i}function Zn(e){return e.rawName||e.name+"."+Object.keys(e.modifiers||{}).join(".")}function Wn(e,t,n,r,i){var o=e.def&&e.def[t];if(o)try{o(n.elm,e,n,r,i)}catch(r){Ie(r,n.context,"directive "+e.name+" "+t+" hook")}}var Gn=[Ln,Vn];function Xn(e,r){var i=r.componentOptions;if(!(n(i)&&!1===i.Ctor.options.inheritAttrs||t(e.data.attrs)&&t(r.data.attrs))){var o,a,s=r.elm,c=e.data.attrs||{},u=r.data.attrs||{};for(o in n(u.__ob__)&&(u=r.data.attrs=C({},u)),u)a=u[o],c[o]!==a&&Yn(s,o,a);for(o in(H||B)&&u.value!==c.value&&Yn(s,"value",u.value),c)t(u[o])&&(wn(o)?s.removeAttributeNS($n,xn(o)):yn(o)||s.removeAttribute(o))}}function Yn(e,t,n){e.tagName.indexOf("-")>-1?Qn(e,t,n):bn(t)?An(n)?e.removeAttribute(t):(n="allowfullscreen"===t&&"EMBED"===e.tagName?"true":t,e.setAttribute(t,n)):yn(t)?e.setAttribute(t,_n(t,n)):wn(t)?An(n)?e.removeAttributeNS($n,xn(t)):e.setAttributeNS($n,t,n):Qn(e,t,n)}function Qn(e,t,n){if(An(n))e.removeAttribute(t);else{if(H&&!U&&"TEXTAREA"===e.tagName&&"placeholder"===t&&""!==n&&!e.__ieph){var r=function(t){t.stopImmediatePropagation(),e.removeEventListener("input",r)};e.addEventListener("input",r),e.__ieph=!0}e.setAttribute(t,n)}}var er={create:Xn,update:Xn};function tr(e,n){var r=n.elm,i=n.data,o=e.data;if(!(t(i.staticClass)&&t(i.class)&&(t(o)||t(o.staticClass)&&t(o.class)))){var a=kn(n);a!==r._prevClass&&(r.setAttribute("class",a),r._prevClass=a)}}var nr,rr,ir,or,ar,sr,cr={create:tr,update:tr};function ur(e,t){console.error("[Vue compiler]: "+e)}function lr(e,t){return e?e.map(function(e){return e[t]}).filter(function(e){return e}):[]}function fr(e,t,n,r,i){(e.props||(e.props=[])).push(_r({name:t,value:n,dynamic:i},r)),e.plain=!1}function pr(e,t,n,r,i){(i?e.dynamicAttrs||(e.dynamicAttrs=[]):e.attrs||(e.attrs=[])).push(_r({name:t,value:n,dynamic:i},r)),e.plain=!1}function dr(e,t,n,r){e.attrsMap[t]=n,e.attrsList.push(_r({name:t,value:n},r))}function vr(e,t,n,r,i,o,a,s){(e.directives||(e.directives=[])).push(_r({name:t,rawName:n,value:r,arg:i,isDynamicArg:o,modifiers:a},s)),e.plain=!1}function hr(e,t,n){return n?"_p("+t+',"'+e+'")':e+t}function mr(t,n,r,i,o,a,s,c){var u;(i=i||e).right?c?n="("+n+")==='click'?'contextmenu':("+n+")":"click"===n&&(n="contextmenu",delete i.right):i.middle&&(c?n="("+n+")==='click'?'mouseup':("+n+")":"click"===n&&(n="mouseup")),i.capture&&(delete i.capture,n=hr("!",n,c)),i.once&&(delete i.once,n=hr("~",n,c)),i.passive&&(delete i.passive,n=hr("&",n,c)),i.native?(delete i.native,u=t.nativeEvents||(t.nativeEvents={})):u=t.events||(t.events={});var l=_r({value:r.trim(),dynamic:c},s);i!==e&&(l.modifiers=i);var f=u[n];Array.isArray(f)?o?f.unshift(l):f.push(l):u[n]=f?o?[l,f]:[f,l]:l,t.plain=!1}function yr(e,t,n){var r=gr(e,":"+t)||gr(e,"v-bind:"+t);if(null!=r)return r;if(!1!==n){var i=gr(e,t);if(null!=i)return JSON.stringify(i)}}function gr(e,t,n){var r;if(null!=(r=e.attrsMap[t]))for(var i=e.attrsList,o=0,a=i.length;o<a;o++)if(i[o].name===t){i.splice(o,1);break}return n&&delete e.attrsMap[t],r}function _r(e,t){return t&&(null!=t.start&&(e.start=t.start),null!=t.end&&(e.end=t.end)),e}function br(e,t,n){var r=n||{},i=r.number,o="$$v";r.trim&&(o="(typeof $$v === 'string'? $$v.trim(): $$v)"),i&&(o="_n("+o+")");var a=$r(t,o);e.model={value:"("+t+")",expression:JSON.stringify(t),callback:"function ($$v) {"+a+"}"}}function $r(e,t){var n=function(e){if(e=e.trim(),nr=e.length,e.indexOf("[")<0||e.lastIndexOf("]")<nr-1)return(or=e.lastIndexOf("."))>-1?{exp:e.slice(0,or),key:'"'+e.slice(or+1)+'"'}:{exp:e,key:null};rr=e,or=ar=sr=0;for(;!xr();)Ar(ir=wr())?Cr(ir):91===ir&&kr(ir);return{exp:e.slice(0,ar),key:e.slice(ar+1,sr)}}(e);return null===n.key?e+"="+t:"$set("+n.exp+", "+n.key+", "+t+")"}function wr(){return rr.charCodeAt(++or)}function xr(){return or>=nr}function Ar(e){return 34===e||39===e}function kr(e){var t=1;for(ar=or;!xr();)if(Ar(e=wr()))Cr(e);else if(91===e&&t++,93===e&&t--,0===t){sr=or;break}}function Cr(e){for(var t=e;!xr()&&(e=wr())!==t;);}var Or,Sr="__r",Tr="__c";function jr(e,t,n){var r=Or;return function i(){null!==t.apply(null,arguments)&&Dr(e,i,n,r)}}var Nr=Le&&!(V&&Number(V[1])<=53);function Er(e,t,n,r){if(Nr){var i=Wt,o=t;t=o._wrapper=function(e){if(e.target===e.currentTarget||e.timeStamp>=i||e.timeStamp<=0||e.target.ownerDocument!==document)return o.apply(this,arguments)}}Or.addEventListener(e,t,J?{capture:n,passive:r}:n)}function Dr(e,t,n,r){(r||Or).removeEventListener(e,t._wrapper||t,n)}function Ir(e,r){if(!t(e.data.on)||!t(r.data.on)){var i=r.data.on||{},o=e.data.on||{};Or=r.elm,function(e){if(n(e[Sr])){var t=H?"change":"input";e[t]=[].concat(e[Sr],e[t]||[]),delete e[Sr]}n(e[Tr])&&(e.change=[].concat(e[Tr],e.change||[]),delete e[Tr])}(i),Xe(i,o,Er,Dr,jr,r.context),Or=void 0}}var Mr,Fr={create:Ir,update:Ir};function Pr(e,r){if(!t(e.data.domProps)||!t(r.data.domProps)){var i,o,a=r.elm,s=e.data.domProps||{},c=r.data.domProps||{};for(i in n(c.__ob__)&&(c=r.data.domProps=C({},c)),s)i in c||(a[i]="");for(i in c){if(o=c[i],"textContent"===i||"innerHTML"===i){if(r.children&&(r.children.length=0),o===s[i])continue;1===a.childNodes.length&&a.removeChild(a.childNodes[0])}if("value"===i&&"PROGRESS"!==a.tagName){a._value=o;var u=t(o)?"":String(o);Lr(a,u)&&(a.value=u)}else if("innerHTML"===i&&Nn(a.tagName)&&t(a.innerHTML)){(Mr=Mr||document.createElement("div")).innerHTML="<svg>"+o+"</svg>";for(var l=Mr.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;l.firstChild;)a.appendChild(l.firstChild)}else if(o!==s[i])try{a[i]=o}catch(e){}}}}function Lr(e,t){return!e.composing&&("OPTION"===e.tagName||function(e,t){var n=!0;try{n=document.activeElement!==e}catch(e){}return n&&e.value!==t}(e,t)||function(e,t){var r=e.value,i=e._vModifiers;if(n(i)){if(i.number)return f(r)!==f(t);if(i.trim)return r.trim()!==t.trim()}return r!==t}(e,t))}var Rr={create:Pr,update:Pr},Hr=g(function(e){var t={},n=/:(.+)/;return e.split(/;(?![^(]*\))/g).forEach(function(e){if(e){var r=e.split(n);r.length>1&&(t[r[0].trim()]=r[1].trim())}}),t});function Ur(e){var t=Br(e.style);return e.staticStyle?C(e.staticStyle,t):t}function Br(e){return Array.isArray(e)?O(e):"string"==typeof e?Hr(e):e}var zr,Vr=/^--/,Kr=/\s*!important$/,Jr=function(e,t,n){if(Vr.test(t))e.style.setProperty(t,n);else if(Kr.test(n))e.style.setProperty(x(t),n.replace(Kr,""),"important");else{var r=Zr(t);if(Array.isArray(n))for(var i=0,o=n.length;i<o;i++)e.style[r]=n[i];else e.style[r]=n}},qr=["Webkit","Moz","ms"],Zr=g(function(e){if(zr=zr||document.createElement("div").style,"filter"!==(e=b(e))&&e in zr)return e;for(var t=e.charAt(0).toUpperCase()+e.slice(1),n=0;n<qr.length;n++){var r=qr[n]+t;if(r in zr)return r}});function Wr(e,r){var i=r.data,o=e.data;if(!(t(i.staticStyle)&&t(i.style)&&t(o.staticStyle)&&t(o.style))){var a,s,c=r.elm,u=o.staticStyle,l=o.normalizedStyle||o.style||{},f=u||l,p=Br(r.data.style)||{};r.data.normalizedStyle=n(p.__ob__)?C({},p):p;var d=function(e,t){var n,r={};if(t)for(var i=e;i.componentInstance;)(i=i.componentInstance._vnode)&&i.data&&(n=Ur(i.data))&&C(r,n);(n=Ur(e.data))&&C(r,n);for(var o=e;o=o.parent;)o.data&&(n=Ur(o.data))&&C(r,n);return r}(r,!0);for(s in f)t(d[s])&&Jr(c,s,"");for(s in d)(a=d[s])!==f[s]&&Jr(c,s,null==a?"":a)}}var Gr=function(e){var o,a,s={},c=e.modules,u=e.nodeOps;for(o=0;o<Un.length;++o)for(s[Un[o]]=[],a=0;a<c.length;++a)n(c[a][Un[o]])&&s[Un[o]].push(c[a][Un[o]]);function l(e){var t=u.parentNode(e);n(t)&&u.removeChild(t,e)}function f(e,t,i,o,a,c,l){if(n(e.elm)&&n(c)&&(e=c[l]=fe(e)),e.isRootInsert=!a,!function(e,t,i,o){var a=e.data;if(n(a)){var c=n(e.componentInstance)&&a.keepAlive;if(n(a=a.hook)&&n(a=a.init)&&a(e,!1),n(e.componentInstance))return d(e,t),v(i,e.elm,o),r(c)&&function(e,t,r,i){for(var o,a=e;a.componentInstance;)if(a=a.componentInstance._vnode,n(o=a.data)&&n(o=o.transition)){for(o=0;o<s.activate.length;++o)s.activate[o](Hn,a);t.push(a);break}v(r,e.elm,i)}(e,t,i,o),!0}}(e,t,i,o)){var f=e.data,p=e.children,m=e.tag;n(m)?(e.elm=e.ns?u.createElementNS(e.ns,m):u.createElement(m,e),g(e),h(e,p,t),n(f)&&y(e,t),v(i,e.elm,o)):r(e.isComment)?(e.elm=u.createComment(e.text),v(i,e.elm,o)):(e.elm=u.createTextNode(e.text),v(i,e.elm,o))}}function d(e,t){n(e.data.pendingInsert)&&(t.push.apply(t,e.data.pendingInsert),e.data.pendingInsert=null),e.elm=e.componentInstance.$el,m(e)?(y(e,t),g(e)):(Rn(e),t.push(e))}function v(e,t,r){n(e)&&(n(r)?u.parentNode(r)===e&&u.insertBefore(e,t,r):u.appendChild(e,t))}function h(e,t,n){if(Array.isArray(t))for(var r=0;r<t.length;++r)f(t[r],n,e.elm,null,!0,t,r);else i(e.text)&&u.appendChild(e.elm,u.createTextNode(String(e.text)))}function m(e){for(;e.componentInstance;)e=e.componentInstance._vnode;return n(e.tag)}function y(e,t){for(var r=0;r<s.create.length;++r)s.create[r](Hn,e);n(o=e.data.hook)&&(n(o.create)&&o.create(Hn,e),n(o.insert)&&t.push(e))}function g(e){var t;if(n(t=e.fnScopeId))u.setStyleScope(e.elm,t);else for(var r=e;r;)n(t=r.context)&&n(t=t.$options._scopeId)&&u.setStyleScope(e.elm,t),r=r.parent;n(t=Rt)&&t!==e.context&&t!==e.fnContext&&n(t=t.$options._scopeId)&&u.setStyleScope(e.elm,t)}function _(e,t,n,r,i,o){for(;r<=i;++r)f(n[r],o,e,t,!1,n,r)}function b(e){var t,r,i=e.data;if(n(i))for(n(t=i.hook)&&n(t=t.destroy)&&t(e),t=0;t<s.destroy.length;++t)s.destroy[t](e);if(n(t=e.children))for(r=0;r<e.children.length;++r)b(e.children[r])}function $(e,t,r,i){for(;r<=i;++r){var o=t[r];n(o)&&(n(o.tag)?(w(o),b(o)):l(o.elm))}}function w(e,t){if(n(t)||n(e.data)){var r,i=s.remove.length+1;for(n(t)?t.listeners+=i:t=function(e,t){function n(){0==--n.listeners&&l(e)}return n.listeners=t,n}(e.elm,i),n(r=e.componentInstance)&&n(r=r._vnode)&&n(r.data)&&w(r,t),r=0;r<s.remove.length;++r)s.remove[r](e,t);n(r=e.data.hook)&&n(r=r.remove)?r(e,t):t()}else l(e.elm)}function x(e,t,r,i){for(var o=r;o<i;o++){var a=t[o];if(n(a)&&Bn(e,a))return o}}function A(e,i,o,a,c,l){if(e!==i){n(i.elm)&&n(a)&&(i=a[c]=fe(i));var p=i.elm=e.elm;if(r(e.isAsyncPlaceholder))n(i.asyncFactory.resolved)?O(e.elm,i,o):i.isAsyncPlaceholder=!0;else if(r(i.isStatic)&&r(e.isStatic)&&i.key===e.key&&(r(i.isCloned)||r(i.isOnce)))i.componentInstance=e.componentInstance;else{var d,v=i.data;n(v)&&n(d=v.hook)&&n(d=d.prepatch)&&d(e,i);var h=e.children,y=i.children;if(n(v)&&m(i)){for(d=0;d<s.update.length;++d)s.update[d](e,i);n(d=v.hook)&&n(d=d.update)&&d(e,i)}t(i.text)?n(h)&&n(y)?h!==y&&function(e,r,i,o,a){for(var s,c,l,p=0,d=0,v=r.length-1,h=r[0],m=r[v],y=i.length-1,g=i[0],b=i[y],w=!a;p<=v&&d<=y;)t(h)?h=r[++p]:t(m)?m=r[--v]:Bn(h,g)?(A(h,g,o,i,d),h=r[++p],g=i[++d]):Bn(m,b)?(A(m,b,o,i,y),m=r[--v],b=i[--y]):Bn(h,b)?(A(h,b,o,i,y),w&&u.insertBefore(e,h.elm,u.nextSibling(m.elm)),h=r[++p],b=i[--y]):Bn(m,g)?(A(m,g,o,i,d),w&&u.insertBefore(e,m.elm,h.elm),m=r[--v],g=i[++d]):(t(s)&&(s=zn(r,p,v)),t(c=n(g.key)?s[g.key]:x(g,r,p,v))?f(g,o,e,h.elm,!1,i,d):Bn(l=r[c],g)?(A(l,g,o,i,d),r[c]=void 0,w&&u.insertBefore(e,l.elm,h.elm)):f(g,o,e,h.elm,!1,i,d),g=i[++d]);p>v?_(e,t(i[y+1])?null:i[y+1].elm,i,d,y,o):d>y&&$(0,r,p,v)}(p,h,y,o,l):n(y)?(n(e.text)&&u.setTextContent(p,""),_(p,null,y,0,y.length-1,o)):n(h)?$(0,h,0,h.length-1):n(e.text)&&u.setTextContent(p,""):e.text!==i.text&&u.setTextContent(p,i.text),n(v)&&n(d=v.hook)&&n(d=d.postpatch)&&d(e,i)}}}function k(e,t,i){if(r(i)&&n(e.parent))e.parent.data.pendingInsert=t;else for(var o=0;o<t.length;++o)t[o].data.hook.insert(t[o])}var C=p("attrs,class,staticClass,staticStyle,key");function O(e,t,i,o){var a,s=t.tag,c=t.data,u=t.children;if(o=o||c&&c.pre,t.elm=e,r(t.isComment)&&n(t.asyncFactory))return t.isAsyncPlaceholder=!0,!0;if(n(c)&&(n(a=c.hook)&&n(a=a.init)&&a(t,!0),n(a=t.componentInstance)))return d(t,i),!0;if(n(s)){if(n(u))if(e.hasChildNodes())if(n(a=c)&&n(a=a.domProps)&&n(a=a.innerHTML)){if(a!==e.innerHTML)return!1}else{for(var l=!0,f=e.firstChild,p=0;p<u.length;p++){if(!f||!O(f,u[p],i,o)){l=!1;break}f=f.nextSibling}if(!l||f)return!1}else h(t,u,i);if(n(c)){var v=!1;for(var m in c)if(!C(m)){v=!0,y(t,i);break}!v&&c.class&&Ze(c.class)}}else e.data!==t.text&&(e.data=t.text);return!0}return function(e,i,o,a){if(!t(i)){var c,l=!1,p=[];if(t(e))l=!0,f(i,p);else{var d=n(e.nodeType);if(!d&&Bn(e,i))A(e,i,p,null,null,a);else{if(d){if(1===e.nodeType&&e.hasAttribute(Y)&&(e.removeAttribute(Y),o=!0),r(o)&&O(e,i,p))return k(i,p,!0),e;c=e,e=new se(u.tagName(c).toLowerCase(),{},[],void 0,c)}var v=e.elm,h=u.parentNode(v);if(f(i,p,v._leaveCb?null:h,u.nextSibling(v)),n(i.parent))for(var y=i.parent,g=m(i);y;){for(var _=0;_<s.destroy.length;++_)s.destroy[_](y);if(y.elm=i.elm,g){for(var w=0;w<s.create.length;++w)s.create[w](Hn,y);var x=y.data.hook.insert;if(x.merged)for(var C=1;C<x.fns.length;C++)x.fns[C]()}else Rn(y);y=y.parent}n(h)?$(0,[e],0,0):n(e.tag)&&b(e)}}return k(i,p,l),i.elm}n(e)&&b(e)}}({nodeOps:Pn,modules:[er,cr,Fr,Rr,{create:Wr,update:Wr}].concat(Gn)});U&&document.addEventListener("selectionchange",function(){var e=document.activeElement;e&&e.vmodel&&ii(e,"input")});var Xr={inserted:function(e,t,n,r){"select"===n.tag?(r.elm&&!r.elm._vOptions?Ye(n,"postpatch",function(){Xr.componentUpdated(e,t,n)}):Yr(e,t,n.context),e._vOptions=[].map.call(e.options,ti)):("textarea"===n.tag||Mn(e.type))&&(e._vModifiers=t.modifiers,t.modifiers.lazy||(e.addEventListener("compositionstart",ni),e.addEventListener("compositionend",ri),e.addEventListener("change",ri),U&&(e.vmodel=!0)))},componentUpdated:function(e,t,n){if("select"===n.tag){Yr(e,t,n.context);var r=e._vOptions,i=e._vOptions=[].map.call(e.options,ti);if(i.some(function(e,t){return!j(e,r[t])}))(e.multiple?t.value.some(function(e){return ei(e,i)}):t.value!==t.oldValue&&ei(t.value,i))&&ii(e,"change")}}};function Yr(e,t,n){Qr(e,t),(H||B)&&setTimeout(function(){Qr(e,t)},0)}function Qr(e,t,n){var r=t.value,i=e.multiple;if(!i||Array.isArray(r)){for(var o,a,s=0,c=e.options.length;s<c;s++)if(a=e.options[s],i)o=N(r,ti(a))>-1,a.selected!==o&&(a.selected=o);else if(j(ti(a),r))return void(e.selectedIndex!==s&&(e.selectedIndex=s));i||(e.selectedIndex=-1)}}function ei(e,t){return t.every(function(t){return!j(t,e)})}function ti(e){return"_value"in e?e._value:e.value}function ni(e){e.target.composing=!0}function ri(e){e.target.composing&&(e.target.composing=!1,ii(e.target,"input"))}function ii(e,t){var n=document.createEvent("HTMLEvents");n.initEvent(t,!0,!0),e.dispatchEvent(n)}var oi={model:Xr};pn.config.mustUseProp=mn,pn.config.isReservedTag=En,pn.config.isReservedAttr=vn,pn.config.getTagNamespace=Dn,pn.config.isUnknownElement=function(e){if(!L)return!0;if(En(e))return!1;if(e=e.toLowerCase(),null!=In[e])return In[e];var t=document.createElement(e);return e.indexOf("-")>-1?In[e]=t.constructor===window.HTMLUnknownElement||t.constructor===window.HTMLElement:In[e]=/HTMLUnknownElement/.test(t.toString())},C(pn.options.directives,oi),pn.prototype.__patch__=L?Gr:S,pn.prototype.$mount=function(e,t){return function(e,t,n){var r;return e.$el=t,e.$options.render||(e.$options.render=ue),Bt(e,"beforeMount"),r=function(){e._update(e._render(),n)},new en(e,r,S,{before:function(){e._isMounted&&!e._isDestroyed&&Bt(e,"beforeUpdate")}},!0),n=!1,null==e.$vnode&&(e._isMounted=!0,Bt(e,"mounted")),e}(this,e=e&&L?Fn(e):void 0,t)};var ai=/\{\{((?:.|\r?\n)+?)\}\}|\{\@((?:.|\r?\n)+?)\@\}/g,si=/[-.*+?^${}()|[\]\/\\]/g,ci=g(function(e){var t=e[0].replace(si,"\\$&"),n=e[1].replace(si,"\\$&");return new RegExp(t+"((?:.|\\n)+?)"+n,"g")});var ui={staticKeys:["staticClass"],transformNode:function(e,t){t.warn;var n=gr(e,"class");n&&(e.staticClass=JSON.stringify(n));var r=yr(e,"class",!1);r&&(e.classBinding=r)},genData:function(e){var t="";return e.staticClass&&(t+="staticClass:"+e.staticClass+","),e.classBinding&&(t+="class:"+e.classBinding+","),t}};var li,fi={staticKeys:["staticStyle"],transformNode:function(e,t){t.warn;var n=gr(e,"style");n&&(e.staticStyle=JSON.stringify(Hr(n)));var r=yr(e,"style",!1);r&&(e.styleBinding=r)},genData:function(e){var t="";return e.staticStyle&&(t+="staticStyle:"+e.staticStyle+","),e.styleBinding&&(t+="style:("+e.styleBinding+"),"),t}},pi=function(e){return(li=li||document.createElement("div")).innerHTML=e,li.textContent},di=p("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),vi=p("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),hi=p("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),mi=/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,yi=/^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,gi="[a-zA-Z_][\\-\\.0-9_a-zA-Z"+D.source+"]*",_i="((?:"+gi+"\\:)?"+gi+")",bi=new RegExp("^<"+_i),$i=/^\s*(\/?)>/,wi=new RegExp("^<\\/"+_i+"[^>]*>"),xi=/^<!DOCTYPE [^>]+>/i,Ai=/^<!\--/,ki=/^<!\[/,Ci=p("script,style,textarea",!0),Oi={},Si={"&lt;":"<","&gt;":">","&quot;":'"',"&amp;":"&","&#10;":"\n","&#9;":"\t","&#39;":"'"},Ti=/&(?:lt|gt|quot|amp|#39);/g,ji=/&(?:lt|gt|quot|amp|#39|#10|#9);/g,Ni=p("pre,textarea",!0),Ei=function(e,t){return e&&Ni(e)&&"\n"===t[0]};function Di(e,t){var n=t?ji:Ti;return e.replace(n,function(e){return Si[e]})}var Ii,Mi,Fi,Pi,Li,Ri,Hi,Ui,Bi=/^@|^v-on:/,zi=/^v-|^@|^:/,Vi=/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,Ki=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,Ji=/^\(|\)$/g,qi=/^\[.*\]$/,Zi=/:(.*)$/,Wi=/^:|^\.|^v-bind:/,Gi=/\.[^.\]]+(?=[^\]]*$)/g,Xi=/[\r\n]/,Yi=/\s+/g,Qi=g(pi),eo="_empty_";function to(e,t,n){return{type:1,tag:e,attrsList:t,attrsMap:so(t),rawAttrsMap:{},parent:n,children:[]}}function no(e,t){Ii=t.warn||ur,Ri=t.isPreTag||T,Hi=t.mustUseProp||T,Ui=t.getTagNamespace||T;t.isReservedTag;Fi=lr(t.modules,"transformNode"),Pi=lr(t.modules,"preTransformNode"),Li=lr(t.modules,"postTransformNode"),Mi=t.delimiters;var n,r,i=[],o=!1!==t.preserveWhitespace,a=t.whitespace,s=!1,c=!1;function u(e){if(l(e),s||e.processed||(e=ro(e,t)),i.length||e===n||n.if&&(e.elseif||e.else)&&oo(n,{exp:e.elseif,block:e}),r&&!e.forbidden)if(e.elseif||e.else)a=e,(u=function(e){var t=e.length;for(;t--;){if(1===e[t].type)return e[t];e.pop()}}(r.children))&&u.if&&oo(u,{exp:a.elseif,block:a});else{if(e.slotScope){var o=e.slotTarget||'"default"';(r.scopedSlots||(r.scopedSlots={}))[o]=e}r.children.push(e),e.parent=r}var a,u;e.children=e.children.filter(function(e){return!e.slotScope}),l(e),e.pre&&(s=!1),Ri(e.tag)&&(c=!1);for(var f=0;f<Li.length;f++)Li[f](e,t)}function l(e){if(!c)for(var t;(t=e.children[e.children.length-1])&&3===t.type&&" "===t.text;)e.children.pop()}return function(e,t){for(var n,r,i=[],o=t.expectHTML,a=t.isUnaryTag||T,s=t.canBeLeftOpenTag||T,c=0;e;){if(n=e,r&&Ci(r)){var u=0,l=r.toLowerCase(),f=Oi[l]||(Oi[l]=new RegExp("([\\s\\S]*?)(</"+l+"[^>]*>)","i")),p=e.replace(f,function(e,n,r){return u=r.length,Ci(l)||"noscript"===l||(n=n.replace(/<!\--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g,"$1")),Ei(l,n)&&(n=n.slice(1)),t.chars&&t.chars(n),""});c+=e.length-p.length,e=p,C(l,c-u,c)}else{var d=e.indexOf("<");if(0===d){if(Ai.test(e)){var v=e.indexOf("--\x3e");if(v>=0){t.shouldKeepComment&&t.comment(e.substring(4,v),c,c+v+3),x(v+3);continue}}if(ki.test(e)){var h=e.indexOf("]>");if(h>=0){x(h+2);continue}}var m=e.match(xi);if(m){x(m[0].length);continue}var y=e.match(wi);if(y){var g=c;x(y[0].length),C(y[1],g,c);continue}var _=A();if(_){k(_),Ei(_.tagName,e)&&x(1);continue}}var b=void 0,$=void 0,w=void 0;if(d>=0){for($=e.slice(d);!(wi.test($)||bi.test($)||Ai.test($)||ki.test($)||(w=$.indexOf("<",1))<0);)d+=w,$=e.slice(d);b=e.substring(0,d)}d<0&&(b=e),b&&x(b.length),t.chars&&b&&t.chars(b,c-b.length,c)}if(e===n){t.chars&&t.chars(e);break}}function x(t){c+=t,e=e.substring(t)}function A(){var t=e.match(bi);if(t){var n,r,i={tagName:t[1],attrs:[],start:c};for(x(t[0].length);!(n=e.match($i))&&(r=e.match(yi)||e.match(mi));)r.start=c,x(r[0].length),r.end=c,i.attrs.push(r);if(n)return i.unarySlash=n[1],x(n[0].length),i.end=c,i}}function k(e){var n=e.tagName,c=e.unarySlash;o&&("p"===r&&hi(n)&&C(r),s(n)&&r===n&&C(n));for(var u=a(n)||!!c,l=e.attrs.length,f=new Array(l),p=0;p<l;p++){var d=e.attrs[p],v=d[3]||d[4]||d[5]||"",h="a"===n&&"href"===d[1]?t.shouldDecodeNewlinesForHref:t.shouldDecodeNewlines;f[p]={name:d[1],value:Di(v,h)}}u||(i.push({tag:n,lowerCasedTag:n.toLowerCase(),attrs:f,start:e.start,end:e.end}),r=n),t.start&&t.start(n,f,u,e.start,e.end)}function C(e,n,o){var a,s;if(null==n&&(n=c),null==o&&(o=c),e)for(s=e.toLowerCase(),a=i.length-1;a>=0&&i[a].lowerCasedTag!==s;a--);else a=0;if(a>=0){for(var u=i.length-1;u>=a;u--)t.end&&t.end(i[u].tag,n,o);i.length=a,r=a&&i[a-1].tag}else"br"===s?t.start&&t.start(e,[],!0,n,o):"p"===s&&(t.start&&t.start(e,[],!1,n,o),t.end&&t.end(e,n,o))}C()}(e,{warn:Ii,expectHTML:t.expectHTML,isUnaryTag:t.isUnaryTag,canBeLeftOpenTag:t.canBeLeftOpenTag,shouldDecodeNewlines:t.shouldDecodeNewlines,shouldDecodeNewlinesForHref:t.shouldDecodeNewlinesForHref,shouldKeepComment:t.comments,outputSourceRange:t.outputSourceRange,start:function(e,o,a,l,f){var p=r&&r.ns||Ui(e);H&&"svg"===p&&(o=function(e){for(var t=[],n=0;n<e.length;n++){var r=e[n];co.test(r.name)||(r.name=r.name.replace(uo,""),t.push(r))}return t}(o));var d,v=to(e,o,r);p&&(v.ns=p),"style"!==(d=v).tag&&("script"!==d.tag||d.attrsMap.type&&"text/javascript"!==d.attrsMap.type)||Z()||(v.forbidden=!0);for(var h=0;h<Pi.length;h++)v=Pi[h](v,t)||v;s||(!function(e){null!=gr(e,"v-pre")&&(e.pre=!0)}(v),v.pre&&(s=!0)),Ri(v.tag)&&(c=!0),s?function(e){var t=e.attrsList,n=t.length;if(n)for(var r=e.attrs=new Array(n),i=0;i<n;i++)r[i]={name:t[i].name,value:JSON.stringify(t[i].value)},null!=t[i].start&&(r[i].start=t[i].start,r[i].end=t[i].end);else e.pre||(e.plain=!0)}(v):v.processed||(io(v),function(e){var t=gr(e,"v-if");if(t)e.if=t,oo(e,{exp:t,block:e});else{null!=gr(e,"v-else")&&(e.else=!0);var n=gr(e,"v-else-if");n&&(e.elseif=n)}}(v),function(e){null!=gr(e,"v-once")&&(e.once=!0)}(v)),n||(n=v),a?u(v):(r=v,i.push(v))},end:function(e,t,n){var o=i[i.length-1];i.length-=1,r=i[i.length-1],u(o)},chars:function(e,t,n){if(r&&(!H||"textarea"!==r.tag||r.attrsMap.placeholder!==e)){var i,u,l,f=r.children;if(e=c||e.trim()?"script"===(i=r).tag||"style"===i.tag?e:Qi(e):f.length?a?"condense"===a&&Xi.test(e)?"":" ":o?" ":"":"")c||"condense"!==a||(e=e.replace(Yi," ")),!s&&" "!==e&&(u=function(e,t){var n=t?ci(t):ai;if(n.test(e)){for(var r,i,o,a=[],s=[],c=n.lastIndex=0,u=!1;r=n.exec(e);){(i=r.index)>c&&(s.push(o=e.slice(c,i)),a.push(JSON.stringify(o)));var l=r[2];if(l)a.push({exp:l.trim()}),u=!0;else{var f=r[1].trim();a.push("_s("+f+")"),s.push({"@binding":f})}c=i+r[0].length}return c<e.length&&(s.push(o=e.slice(c)),a.push(JSON.stringify(o))),{expression:a,tokens:s,hasChildExp:u}}}(e,Mi))?l={type:2,expression:u.expression,tokens:u.tokens,hasChildExp:u.hasChildExp,text:e}:" "===e&&f.length&&" "===f[f.length-1].text||(l={type:3,text:e}),l&&f.push(l)}},comment:function(e,t,n){if(r){var i={type:3,text:e,isComment:!0};r.children.push(i)}}}),n}function ro(e,t){var n,r;(r=yr(n=e,"key"))&&(n.key=r),e.plain=!e.key&&!e.scopedSlots&&!e.attrsList.length,function(e){var t=yr(e,"ref");t&&(e.ref=t,e.refInFor=function(e){var t=e;for(;t;){if(void 0!==t.for)return!0;t=t.parent}return!1}(e))}(e),function(e){var t;"template"===e.tag?(t=gr(e,"scope"),e.slotScope=t||gr(e,"slot-scope")):(t=gr(e,"slot-scope"))&&(e.slotScope=t);var n=yr(e,"slot");n&&(e.slotTarget='""'===n?'"default"':n,e.slotTargetDynamic=!(!e.attrsMap[":slot"]&&!e.attrsMap["v-bind:slot"]),"template"===e.tag||e.slotScope||pr(e,"slot",n,function(e,t){return e.rawAttrsMap[":"+t]||e.rawAttrsMap["v-bind:"+t]||e.rawAttrsMap[t]}(e,"slot")))}(e),function(e){"slot"===e.tag&&(e.slotName=yr(e,"name"))}(e),function(e){var t;(t=yr(e,"is"))&&(e.component=t);null!=gr(e,"inline-template")&&(e.inlineTemplate=!0)}(e);for(var i=0;i<Fi.length;i++)e=Fi[i](e,t)||e;return function(e){var t,n,r,i,o,a,s,c,u=e.attrsList;for(t=0,n=u.length;t<n;t++)if(r=i=u[t].name,o=u[t].value,zi.test(r))if(e.hasBindings=!0,(a=ao(r.replace(zi,"")))&&(r=r.replace(Gi,"")),Wi.test(r))r=r.replace(Wi,""),(c=qi.test(r))&&(r=r.slice(1,-1)),a&&(a.prop&&!c&&"innerHtml"===(r=b(r))&&(r="innerHTML"),a.camel&&!c&&(r=b(r)),a.sync&&(s=$r(o,"$event"),c?mr(e,'"update:"+('+r+")",s,null,!1,0,u[t],!0):(mr(e,"update:"+b(r),s,null,!1,0,u[t]),x(r)!==b(r)&&mr(e,"update:"+x(r),s,null,!1,0,u[t])))),a&&a.prop||!e.component&&Hi(e.tag,e.attrsMap.type,r)?fr(e,r,o,u[t],c):pr(e,r,o,u[t],c);else if(Bi.test(r))r=r.replace(Bi,""),(c=qi.test(r))&&(r=r.slice(1,-1)),mr(e,r,o,a,!1,0,u[t],c);else{var l=(r=r.replace(zi,"")).match(Zi),f=l&&l[1];c=!1,f&&(r=r.slice(0,-(f.length+1)),qi.test(f)&&(f=f.slice(1,-1),c=!0)),vr(e,r,i,o,f,c,a,u[t])}else pr(e,r,JSON.stringify(o),u[t]),!e.component&&"muted"===r&&Hi(e.tag,e.attrsMap.type,r)&&fr(e,r,"true",u[t])}(e),e}function io(e){var t;if(t=gr(e,"v-for")){var n=function(e){var t=e.match(Vi);if(!t)return;var n={};n.for=t[2].trim();var r=t[1].trim().replace(Ji,""),i=r.match(Ki);i?(n.alias=r.replace(Ki,"").trim(),n.iterator1=i[1].trim(),i[2]&&(n.iterator2=i[2].trim())):n.alias=r;return n}(t);n&&C(e,n)}}function oo(e,t){e.ifConditions||(e.ifConditions=[]),e.ifConditions.push(t)}function ao(e){var t=e.match(Gi);if(t){var n={};return t.forEach(function(e){n[e.slice(1)]=!0}),n}}function so(e){for(var t={},n=0,r=e.length;n<r;n++)t[e[n].name]=e[n].value;return t}var co=/^xmlns:NS\d+/,uo=/^NS\d+:/;function lo(e){return to(e.tag,e.attrsList.slice(),e.parent)}var fo=[ui,fi,{preTransformNode:function(e,t){if("input"===e.tag){var n,r=e.attrsMap;if(!r["v-model"])return;if((r[":type"]||r["v-bind:type"])&&(n=yr(e,"type")),r.type||n||!r["v-bind"]||(n="("+r["v-bind"]+").type"),n){var i=gr(e,"v-if",!0),o=i?"&&("+i+")":"",a=null!=gr(e,"v-else",!0),s=gr(e,"v-else-if",!0),c=lo(e);io(c),dr(c,"type","checkbox"),ro(c,t),c.processed=!0,c.if="("+n+")==='checkbox'"+o,oo(c,{exp:c.if,block:c});var u=lo(e);gr(u,"v-for",!0),dr(u,"type","radio"),ro(u,t),oo(c,{exp:"("+n+")==='radio'"+o,block:u});var l=lo(e);return gr(l,"v-for",!0),dr(l,":type",n),ro(l,t),oo(c,{exp:i,block:l}),a?c.else=!0:s&&(c.elseif=s),c}}}}];var po,vo,ho={expectHTML:!0,modules:fo,directives:{model:function(e,t,n){var r=t.value,i=t.modifiers,o=e.tag,a=e.attrsMap.type;if(e.component)return br(e,r,i),!1;if("select"===o)!function(e,t,n){var r='var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return '+(n&&n.number?"_n(val)":"val")+"});";r=r+" "+$r(t,"$event.target.multiple ? $$selectedVal : $$selectedVal[0]"),mr(e,"change",r,null,!0)}(e,r,i);else if("input"===o&&"checkbox"===a)!function(e,t,n){var r=n&&n.number,i=yr(e,"value")||"null",o=yr(e,"true-value")||"true",a=yr(e,"false-value")||"false";fr(e,"checked","Array.isArray("+t+")?_i("+t+","+i+")>-1"+("true"===o?":("+t+")":":_q("+t+","+o+")")),mr(e,"change","var $$a="+t+",$$el=$event.target,$$c=$$el.checked?("+o+"):("+a+");if(Array.isArray($$a)){var $$v="+(r?"_n("+i+")":i)+",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&("+$r(t,"$$a.concat([$$v])")+")}else{$$i>-1&&("+$r(t,"$$a.slice(0,$$i).concat($$a.slice($$i+1))")+")}}else{"+$r(t,"$$c")+"}",null,!0)}(e,r,i);else if("input"===o&&"radio"===a)!function(e,t,n){var r=n&&n.number,i=yr(e,"value")||"null";fr(e,"checked","_q("+t+","+(i=r?"_n("+i+")":i)+")"),mr(e,"change",$r(t,i),null,!0)}(e,r,i);else if("input"===o||"textarea"===o)!function(e,t,n){var r=e.attrsMap.type,i=n||{},o=i.lazy,a=i.number,s=i.trim,c=!o&&"range"!==r,u=o?"change":"range"===r?Sr:"input",l="$event.target.value";s&&(l="$event.target.value.trim()"),a&&(l="_n("+l+")");var f=$r(t,l);c&&(f="if($event.target.composing)return;"+f),fr(e,"value","("+t+")"),mr(e,u,f,null,!0),(s||a)&&mr(e,"blur","$forceUpdate()")}(e,r,i);else if(!te.isReservedTag(o))return br(e,r,i),!1;return!0},text:function(e,t){t.value&&fr(e,"textContent","_s("+t.value+")",t)},html:function(e,t){t.value&&fr(e,"innerHTML","_s("+t.value+")",t)}},isPreTag:function(e){return"pre"===e},isUnaryTag:di,mustUseProp:mn,canBeLeftOpenTag:vi,isReservedTag:En,getTagNamespace:Dn,staticKeys:function(e){return e.reduce(function(e,t){return e.concat(t.staticKeys||[])},[]).join(",")}(fo)},mo=g(function(e){return p("type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap"+(e?","+e:""))});function yo(e,t){e&&(po=mo(t.staticKeys||""),vo=t.isReservedTag||T,function e(t){t.static=function(e){if(2===e.type)return!1;if(3===e.type)return!0;return!(!e.pre&&(e.hasBindings||e.if||e.for||d(e.tag)||!vo(e.tag)||function(e){for(;e.parent;){if("template"!==(e=e.parent).tag)return!1;if(e.for)return!0}return!1}(e)||!Object.keys(e).every(po)))}(t);if(1===t.type){if(!vo(t.tag)&&"slot"!==t.tag&&null==t.attrsMap["inline-template"])return;for(var n=0,r=t.children.length;n<r;n++){var i=t.children[n];e(i),i.static||(t.static=!1)}if(t.ifConditions)for(var o=1,a=t.ifConditions.length;o<a;o++){var s=t.ifConditions[o].block;e(s),s.static||(t.static=!1)}}}(e),function e(t,n){if(1===t.type){if((t.static||t.once)&&(t.staticInFor=n),t.static&&t.children.length&&(1!==t.children.length||3!==t.children[0].type))return void(t.staticRoot=!0);if(t.staticRoot=!1,t.children)for(var r=0,i=t.children.length;r<i;r++)e(t.children[r],n||!!t.for);if(t.ifConditions)for(var o=1,a=t.ifConditions.length;o<a;o++)e(t.ifConditions[o].block,n)}}(e,!1))}var go=/^([\w$_]+|\([^)]*?\))\s*=>|^function\s*(?:[\w$]+)?\s*\(/,_o=/\([^)]*?\);*$/,bo=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,$o={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,delete:[8,46]},wo={esc:["Esc","Escape"],tab:"Tab",enter:"Enter",space:[" ","Spacebar"],up:["Up","ArrowUp"],left:["Left","ArrowLeft"],right:["Right","ArrowRight"],down:["Down","ArrowDown"],delete:["Backspace","Delete","Del"]},xo=function(e){return"if("+e+")return null;"},Ao={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();",self:xo("$event.target !== $event.currentTarget"),ctrl:xo("!$event.ctrlKey"),shift:xo("!$event.shiftKey"),alt:xo("!$event.altKey"),meta:xo("!$event.metaKey"),left:xo("'button' in $event && $event.button !== 0"),middle:xo("'button' in $event && $event.button !== 1"),right:xo("'button' in $event && $event.button !== 2")};function ko(e,t){var n=t?"nativeOn:":"on:",r="",i="";for(var o in e){var a=Co(e[o]);e[o]&&e[o].dynamic?i+=o+","+a+",":r+='"'+o+'":'+a+","}return r="{"+r.slice(0,-1)+"}",i?n+"_d("+r+",["+i.slice(0,-1)+"])":n+r}function Co(e){if(!e)return"function(){}";if(Array.isArray(e))return"["+e.map(function(e){return Co(e)}).join(",")+"]";var t=bo.test(e.value),n=go.test(e.value),r=bo.test(e.value.replace(_o,""));if(e.modifiers){var i="",o="",a=[];for(var s in e.modifiers)if(Ao[s])o+=Ao[s],$o[s]&&a.push(s);else if("exact"===s){var c=e.modifiers;o+=xo(["ctrl","shift","alt","meta"].filter(function(e){return!c[e]}).map(function(e){return"$event."+e+"Key"}).join("||"))}else a.push(s);return a.length&&(i+=function(e){return"if(!$event.type.indexOf('key')&&"+e.map(Oo).join("&&")+")return null;"}(a)),o&&(i+=o),"function($event){"+i+(t?"return "+e.value+"($event)":n?"return ("+e.value+")($event)":r?"return "+e.value:e.value)+"}"}return t||n?e.value:"function($event){"+(r?"return "+e.value:e.value)+"}"}function Oo(e){var t=parseInt(e,10);if(t)return"$event.keyCode!=="+t;var n=$o[e],r=wo[e];return"_k($event.keyCode,"+JSON.stringify(e)+","+JSON.stringify(n)+",$event.key,"+JSON.stringify(r)+")"}var So={on:function(e,t){e.wrapListeners=function(e){return"_g("+e+","+t.value+")"}},bind:function(e,t){e.wrapData=function(n){return"_b("+n+",'"+e.tag+"',"+t.value+","+(t.modifiers&&t.modifiers.prop?"true":"false")+(t.modifiers&&t.modifiers.sync?",true":"")+")"}}},To=function(e){this.options=e,this.warn=e.warn||ur,this.transforms=lr(e.modules,"transformCode"),this.dataGenFns=lr(e.modules,"genData"),this.directives=C(C({},So),e.directives);var t=e.isReservedTag||T;this.maybeComponent=function(e){return!!e.component||!t(e.tag)},this.onceId=0,this.staticRenderFns=[],this.pre=!1};function jo(e,t){var n=new To(t);return{render:"with(this){return "+(e?No(e,n):'_c("div")')+"}",staticRenderFns:n.staticRenderFns}}function No(e,t){if(e.parent&&(e.pre=e.pre||e.parent.pre),e.staticRoot&&!e.staticProcessed)return Eo(e,t);if(e.once&&!e.onceProcessed)return Do(e,t);if(e.for&&!e.forProcessed)return Mo(e,t);if(e.if&&!e.ifProcessed)return Io(e,t);if("template"!==e.tag||e.slotTarget||t.pre){if("slot"===e.tag)return function(e,t){var n=e.slotName||'"default"',r=Ro(e,t),i="_t("+n+(r?","+r:""),o=e.attrs||e.dynamicAttrs?Bo((e.attrs||[]).concat(e.dynamicAttrs||[]).map(function(e){return{name:b(e.name),value:e.value,dynamic:e.dynamic}})):null,a=e.attrsMap["v-bind"];!o&&!a||r||(i+=",null");o&&(i+=","+o);a&&(i+=(o?"":",null")+","+a);return i+")"}(e,t);var n;if(e.component)n=function(e,t,n){var r=t.inlineTemplate?null:Ro(t,n,!0);return"_c("+e+","+Fo(t,n)+(r?","+r:"")+")"}(e.component,e,t);else{var r;(!e.plain||e.pre&&t.maybeComponent(e))&&(r=Fo(e,t));var i=e.inlineTemplate?null:Ro(e,t,!0);n="_c('"+e.tag+"'"+(r?","+r:"")+(i?","+i:"")+")"}for(var o=0;o<t.transforms.length;o++)n=t.transforms[o](e,n);return n}return Ro(e,t)||"void 0"}function Eo(e,t){e.staticProcessed=!0;var n=t.pre;return e.pre&&(t.pre=e.pre),t.staticRenderFns.push("with(this){return "+No(e,t)+"}"),t.pre=n,"_m("+(t.staticRenderFns.length-1)+(e.staticInFor?",true":"")+")"}function Do(e,t){if(e.onceProcessed=!0,e.if&&!e.ifProcessed)return Io(e,t);if(e.staticInFor){for(var n="",r=e.parent;r;){if(r.for){n=r.key;break}r=r.parent}return n?"_o("+No(e,t)+","+t.onceId+++","+n+")":No(e,t)}return Eo(e,t)}function Io(e,t,n,r){return e.ifProcessed=!0,function e(t,n,r,i){if(!t.length)return i||"_e()";var o=t.shift();return o.exp?"("+o.exp+")?"+a(o.block)+":"+e(t,n,r,i):""+a(o.block);function a(e){return r?r(e,n):e.once?Do(e,n):No(e,n)}}(e.ifConditions.slice(),t,n,r)}function Mo(e,t,n,r){var i=e.for,o=e.alias,a=e.iterator1?","+e.iterator1:"",s=e.iterator2?","+e.iterator2:"";return e.forProcessed=!0,(r||"_l")+"(("+i+"),function("+o+a+s+"){return "+(n||No)(e,t)+"})"}function Fo(e,t){var n="{",r=function(e,t){var n=e.directives;if(!n)return;var r,i,o,a,s="directives:[",c=!1;for(r=0,i=n.length;r<i;r++){o=n[r],a=!0;var u=t.directives[o.name];u&&(a=!!u(e,o,t.warn)),a&&(c=!0,s+='{name:"'+o.name+'",rawName:"'+o.rawName+'"'+(o.value?",value:("+o.value+"),expression:"+JSON.stringify(o.value):"")+(o.arg?",arg:"+(o.isDynamicArg?o.arg:'"'+o.arg+'"'):"")+(o.modifiers?",modifiers:"+JSON.stringify(o.modifiers):"")+"},")}if(c)return s.slice(0,-1)+"]"}(e,t);r&&(n+=r+","),e.key&&(n+="key:"+e.key+","),e.ref&&(n+="ref:"+e.ref+","),e.refInFor&&(n+="refInFor:true,"),e.pre&&(n+="pre:true,"),e.component&&(n+='tag:"'+e.tag+'",');for(var i=0;i<t.dataGenFns.length;i++)n+=t.dataGenFns[i](e);if(e.attrs&&(n+="attrs:"+Bo(e.attrs)+","),e.props&&(n+="domProps:"+Bo(e.props)+","),e.events&&(n+=ko(e.events,!1)+","),e.nativeEvents&&(n+=ko(e.nativeEvents,!0)+","),e.slotTarget&&!e.slotScope&&(n+="slot:"+e.slotTarget+","),e.scopedSlots&&(n+=function(e,t,n){var r=e.for||Object.keys(t).some(function(e){var n=t[e];return n.slotTargetDynamic||n.if||n.for||Po(n)}),i=!!e.if;if(!r)for(var o=e.parent;o;){if(o.slotScope&&o.slotScope!==eo||o.for){r=!0;break}o.if&&(i=!0),o=o.parent}var a=Object.keys(t).map(function(e){return Lo(t[e],n)}).join(",");return"scopedSlots:_u(["+a+"]"+(r?",null,true":"")+(!r&&i?",null,false,"+function(e){var t=5381,n=e.length;for(;n;)t=33*t^e.charCodeAt(--n);return t>>>0}(a):"")+")"}(e,e.scopedSlots,t)+","),e.model&&(n+="model:{value:"+e.model.value+",callback:"+e.model.callback+",expression:"+e.model.expression+"},"),e.inlineTemplate){var o=function(e,t){var n=e.children[0];if(n&&1===n.type){var r=jo(n,t.options);return"inlineTemplate:{render:function(){"+r.render+"},staticRenderFns:["+r.staticRenderFns.map(function(e){return"function(){"+e+"}"}).join(",")+"]}"}}(e,t);o&&(n+=o+",")}return n=n.replace(/,$/,"")+"}",e.dynamicAttrs&&(n="_b("+n+',"'+e.tag+'",'+Bo(e.dynamicAttrs)+")"),e.wrapData&&(n=e.wrapData(n)),e.wrapListeners&&(n=e.wrapListeners(n)),n}function Po(e){return 1===e.type&&("slot"===e.tag||e.children.some(Po))}function Lo(e,t){var n=e.attrsMap["slot-scope"];if(e.if&&!e.ifProcessed&&!n)return Io(e,t,Lo,"null");if(e.for&&!e.forProcessed)return Mo(e,t,Lo);var r=e.slotScope===eo?"":String(e.slotScope),i="function("+r+"){return "+("template"===e.tag?e.if&&n?"("+e.if+")?"+(Ro(e,t)||"undefined")+":undefined":Ro(e,t)||"undefined":No(e,t))+"}",o=r?"":",proxy:true";return"{key:"+(e.slotTarget||'"default"')+",fn:"+i+o+"}"}function Ro(e,t,n,r,i){var o=e.children;if(o.length){var a=o[0];if(1===o.length&&a.for&&"template"!==a.tag&&"slot"!==a.tag){var s=n?t.maybeComponent(a)?",1":",0":"";return""+(r||No)(a,t)+s}var c=n?function(e,t){for(var n=0,r=0;r<e.length;r++){var i=e[r];if(1===i.type){if(Ho(i)||i.ifConditions&&i.ifConditions.some(function(e){return Ho(e.block)})){n=2;break}(t(i)||i.ifConditions&&i.ifConditions.some(function(e){return t(e.block)}))&&(n=1)}}return n}(o,t.maybeComponent):0,u=i||Uo;return"["+o.map(function(e){return u(e,t)}).join(",")+"]"+(c?","+c:"")}}function Ho(e){return void 0!==e.for||"template"===e.tag||"slot"===e.tag}function Uo(e,t){return 1===e.type?No(e,t):3===e.type&&e.isComment?(n=e,"_e("+JSON.stringify(n.text)+")"):function(e){var t=e.expression;if(2===e.type){if(e.hasChildExp){for(var n=[],r=[],i=0;i<t.length;i++){var o=t[i];o.exp?(r.length&&(n.push("_v("+r.join("+")+")"),r=[]),n.push(o.exp)):r.push(o)}return r.length&&n.push("_v("+r.join("+")+")"),n.join(",")}return"_v("+t.join("+")+")"}return"_v("+(2===e.type?t.join("+"):zo(JSON.stringify(e.text)))+")"}(e);var n}function Bo(e){for(var t="",n="",r=0;r<e.length;r++){var i=e[r],o=zo(i.value);i.dynamic?n+=i.name+","+o+",":t+='"'+i.name+'":'+o+","}return t="{"+t.slice(0,-1)+"}",n?"_d("+t+",["+n.slice(0,-1)+"])":t}function zo(e){return e.replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}new RegExp("\\b"+"do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b")+"\\b");function Vo(e,t){try{return new Function(e)}catch(n){return t.push({err:n,code:e}),S}}function Ko(e){var t=Object.create(null);return function(n,r,i){(r=C({},r)).warn;delete r.warn;var o=r.delimiters?String(r.delimiters)+n:n;if(t[o])return t[o];var a=e(n,r),s={},c=[];return s.render=Vo(a.render,c),s.staticRenderFns=a.staticRenderFns.map(function(e){return Vo(e,c)}),t[o]=s}}var Jo,qo,Zo=(Jo=function(e,t){var n=no(e.trim(),t);!1!==t.optimize&&yo(n,t);var r=jo(n,t);return{ast:n,render:r.render,staticRenderFns:r.staticRenderFns}},function(e){function t(t,n){var r=Object.create(e),i=[],o=[];if(n)for(var a in n.modules&&(r.modules=(e.modules||[]).concat(n.modules)),n.directives&&(r.directives=C(Object.create(e.directives||null),n.directives)),n)"modules"!==a&&"directives"!==a&&(r[a]=n[a]);r.warn=function(e,t,n){(n?o:i).push(e)};var s=Jo(t.trim(),r);return s.errors=i,s.tips=o,s}return{compile:t,compileToFunctions:Ko(t)}})(ho).compileToFunctions;function Wo(e){return(qo=qo||document.createElement("div")).innerHTML=e?'<a href="\n"/>':'<div a="\n"/>',qo.innerHTML.indexOf("&#10;")>0}var Go=!!L&&Wo(!1),Xo=!!L&&Wo(!0),Yo=g(function(e){var t=Fn(e);return t&&t.innerHTML}),Qo=pn.prototype.$mount;return pn.prototype.$mount=function(e,t){if((e=e&&Fn(e))===document.body||e===document.documentElement)return this;var n=this.$options;if(!n.render){var r=n.template;if(r)if("string"==typeof r)"#"===r.charAt(0)&&(r=Yo(r));else{if(!r.nodeType)return this;r=r.innerHTML}else e&&(r=function(e){if(e.outerHTML)return e.outerHTML;var t=document.createElement("div");return t.appendChild(e.cloneNode(!0)),t.innerHTML}(e));if(r){var i=Zo(r,{outputSourceRange:!1,shouldDecodeNewlines:Go,shouldDecodeNewlinesForHref:Xo,delimiters:n.delimiters,comments:n.comments},this),o=i.render,a=i.staticRenderFns;n.render=o,n.staticRenderFns=a}}return Qo.call(this,e,t)},pn.compile=Zo,pn});
!function(){var e=usf.settings,t=usf.event,i=usf.templates,r=e["translation_"+usf.platform.locale];if(!r)for(var s in e)if(s.startsWith("translation")){r=e[s];break}e.translation=r;var a=usf.utils,o,l=usf.platform,n=usf.query,c=usf.queryRewriter,u=["template","created","beforeMounted","mounted","beforeUpdate","updated","render","beforeDestroy","destroy","ref","key","slot","directives","on","attrs"];function h(e,t){for(var i=0;i<t.length;i++)e.push(t[i])}function d(e){return"string"==typeof e}function f(e,t,i){var r=t[i];if(r){var s=e[i];if(!s){if(isFunc(r))return void(e[i]=r);e[i]=s={}}for(var a in r){var o=r[a];s[a]||(s[a]=o)}}}function p(e,t,i){var r=$r.getBaseType(e);if(r){if(i){var s=r[i][t],a=r.mixins;if(!s&&a)for(var o=0;o<a.length;o++)if((s=a[o][i])&&(s=s[t]))return s;return s}return r[t]}return null}Object.assign(window.usf,{register:function(e,t,i){var r;if(d(e)?(r=eval(e),r.__typeName=e,r.fullName=function(){return r.__typeName}):r=e,r.__class=!0,t)for(var s in r.__baseType=t,["methods","props","computed","events","model","data","watch","inject","provide"].forEach(e=>f(r,t,e)),t.mixins&&(r.mixins||(r.mixins=[]),h(r.mixins,t.mixins)),t){var a=t[s];!r[s]&&u.includes(s)&&(r[s]=a)}return i&&RVue.component(i,r),r},base:function(e,t,i,r,s){var a=p(t,i,s);if(!a)throw new Error("Base method named '"+i+"' not found.");return r?a.apply(e,r):a.apply(e)}});var m={props:{value:String,placeholder:String,name:String,options:Array},data(){return{model:this.value,show:!1}},methods:{onInput(e){this.$emit("input",e.target.value)}},render(e){var t=this.options;if(t)return e("select",{class:"usf-dropdown",domProps:{value:this.value},on:{input:this.onInput}},t.map(t=>e("option",{attrs:{value:t.value}},[t.label])))}};usf.components.DropDown=usf.register(m,null,"usf-dropdown");var g={props:{value:Boolean,label:String,name:String},data(){return{model:this.value}},methods:{onInput(e){this.$emit("input",e.target.value)}},render(e){return e("div",{class:"usf-c-checkbox"},[e("div",{class:"usf-c-inner-option"},[e("input",{attrs:{type:"checkbox",name:this.name},props:{value:this.model},on:{input:this.onInput}})]),e("span",{domProps:{innerHTML:this.label}})])}};usf.components.CheckBox=usf.register(m,null,"usf-checkbox");var v={props:{tooltip:String},render(e){return e("div",{class:"usf-c-tooltip"},[e("div",{class:"usf-c-tooltip__popup",domProps:{innerHTML:this.tooltip}})])}},b,w,y,I,S,x,P;function F(e,t){return Math.ceil(e/t)*t}function _(e,t){var i,r=t.innerSymbols;if(r){var s=Math.log10(e)/3|0;if(i=r[s],s)e/=Math.pow(10,3*s)}else i="";return $e(e,t.decimals)+i}function U(e,t,i){return[e("span",{class:"usf-slider-pip__value-wrapper"},[i.prefix?e("span",{class:"usf-slider-pip__prefix"},[i.prefix]):null,e("span",{class:"usf-slider-pip__value"},[_(i.converter(t),i)]),i.suffix?e("span",{class:"usf-slider-pip__suffix"},[i.suffix]):null])]}usf.components.HelpTip=usf.register(v,null,"usf-helptip");var C={props:{value:Array,min:Number,max:Number,pips:Number,step:Number,decimals:Number,converter:Function,symbols:[Array,String],prefix:String,suffix:String,noAbbreviation:Boolean,color:String},data(){var e=this.symbols;return e&&(Array.isArray(e)||(e=(","+e).split(","))),{dragging:!1,innerSymbols:e}},methods:{onKeyDown(e){var t,i,r;switch(e.keyCode){case 37:t=-this.step;break;case 39:t=this.step;break;case 27:return(s=e.target===this.$refs.l)?(i=this.min,r=this.value[1]):(i=this.value[0],r=this.max),this.$emit("input",[i,r]),void this.$emit("change",[i,r])}if(void 0!==t){var s=e.target===this.$refs.l,a=this.value;s?(i=a[0]+t,r=a[1],i<this.min?i=this.min:i>r&&(i=r)):(i=a[0],(r=a[1]+t)<i?r=i:r>this.max&&(r=this.max)),i==a[0]&&r===a[1]||(this.$emit("input",[i,r]),clearTimeout(this._timeout),this._timeout=setTimeout(()=>this.$emit("change",[i,r]),100))}},onMouseUp(e){this.$emit("change",[S,x]),this.dragging=!1,this.clearDrag()},onMouseMove(e){var t=(e.touches?e.touches[0].clientX:e.clientX)-b,i=this.value[0],r=this.value[1],s=this.min,a=this.max;w?((i=y+F(t/_width*(a-s),this.step))<s&&(i=s),i>r&&(i=r)):((r=I+F(t/_width*(a-s),this.step))>a&&(r=a),r<i&&(r=i)),S===i&&x===r||(S=i,x=r,this.$emit("input",[i,r]))},onMinMouseDown(e){this.onHandleMouseDown(e,!0)},onMaxMouseDown(e){this.onHandleMouseDown(e,!1)},onHandleMouseDown(e,t){if(!this.dragging){var i=e.target;i.style.zIndex=2,this.$refs[i===this.$refs.l?"r":"l"].style.zIndex=1,this.dragging=!0,b=e.touches?e.touches[0].clientX:e.clientX,w=t,_width=this.$el.clientWidth,y=this.value[0],I=this.value[1];var r=this.onMouseUp,s=this.onMouseMove;P={mouseup:r,mousemove:s,touchend:r,touchmove:s},a.on(document.body,P,{passive:!0})}},clearDrag(){a.off(document.body,P)}},beforeDestroy(){this.clearDrag()},render(e){for(var t=this.min,i=this.max,r=this.color||"#333",s=[],a=i-t,o=a/this.pips,l=0;l<this.pips;l++){var n=l*o,c=t+n;if(s.push(e("div",{style:"left:"+100*n/a+"%",class:"usf-c-slider__pip"},U(e,c,this))),!l&&a<=this.step)break}s.push(e("div",{style:"right:0",class:"usf-c-slider__pip"},U(e,i,this)));var u=this.value[0],h=this.value[1];u<t&&(u=t),u>i&&(u=i),h>i&&(h=i),h<t&&(h=t);var d=100*(u-t)/a+"%",f=100*(h-t)/a+"%";return e("div",{class:"usf-c-slider"},[s,e("div",{class:"usf-c-slider__track"},[e("div",{class:"usf-active",style:{left:d,width:100*(h-u)/a+"%",backgroundColor:r}})]),e("div",{class:"usf-c-slider__handle usf-c-slider__handle-min usf-c",ref:"l",attrs:{tabindex:0},style:{left:d,borderColor:r},on:{"&mousedown":this.onMinMouseDown,"&touchstart":this.onMinMouseDown,keydown:this.onKeyDown}}),e("div",{class:"usf-c-slider__handle usf-c-slider__handle-max usf-c",ref:"r",attrs:{tabindex:0},style:{left:f,borderColor:r},on:{"&mousedown":this.onMaxMouseDown,"&touchstart":this.onMaxMouseDown,keydown:this.onKeyDown}})])}};usf.components.Slider=usf.register(C,null,"usf-slider");var T=navigator.userAgent,k=T.includes("iPad")||T.includes("iPhone");function M(e,t){var i=0,r=0,s=e;if(t){for(;e&&!isNaN(e.offsetLeft)&&!isNaN(e.offsetTop)&&(i+=e.offsetLeft,r+=e.offsetTop,(e=e.offsetParent)!==t););for(s=s.parentNode;s&&!isNaN(s.scrollLeft)&&!isNaN(s.scrollTop)&&(i-=s.scrollLeft,r-=s.scrollTop,s!==t);)s=s.parentNode}else{var a=e.getBoundingClientRect();i=a.x+window.scrollX,r=a.y+window.scrollY}return{x:i,y:r}}var L=/\{(\d+)(:[^\}]+)?\}/g,N={}.toString,D;function R(e,t,i){}function $(e,t,i){}function O(e,t,i){if(t){if("[object Date]"===N.call(e))return R(e,t,i);if($r_isNumeric(e))return $(e,t,i)}return void 0!==e?e:""}var E={url:e.resUrl+"no-image.svg",width:360,height:260};function B(){for(var e=document.head.children,t=0;t<e.length;t++){var i=e[t];if("SCRIPT"==i.tagName&&-1!==i.text.indexOf("usf-license.js"))return!0}}Object.assign(usf.platform,{get addToCartUrl(){return l.baseUrl+"/cart/add"},get searchUrl(){return l.baseUrl+"/search"},emptyImage:E,getProductUrl(e,t,i){var r;return r=!l.useProductsUrl&&e&&"all"!==e&&-1===e.indexOf("/")?l.baseUrl+"/collections/"+e+"/products/"+t.urlName:l.baseUrl+"/products/"+t.urlName,i&&(r+="?variant="+i.id),r},getImageUrl(t,i){if(!t.includes("shopify.com")||t.includes("/assets/"))return t;var r=t.lastIndexOf(".");if("list"===i)switch(e.search.imageSizeType){case"fixed":i="_"+e.search.imageSize+"x";break;default:i=""}else i="small"===i?"_small":i?"_"+i+"x":"";return t.substring(0,r)+i+t.substring(r)},getCollectionUrl(e){if("number"==typeof e){var t;for(var i in usf.collectionsByUrlName){var r=usf.collectionsByUrlName[i];if(r.id===e){e=r,t=!0;break}}t||(e={urlName:"all"})}var s=e.urlName||e;return l.baseUrl+"/collections/"+s},getPageUrl(e){var t=l.baseUrl;switch(e.type){case"Article":return t+"/blogs/"+e.urlName;case"Page":e=e.urlName}return t+"/pages/"+e}}),window.addEventListener("load",function(){a.registerScriptsLoadedCallback(window._usfActive,"usf-license",function(){},8e3,function(){window._usfActive||B()||l.redirectToOriginalView()})});var H=function(){t.add("is_show",(e,t)=>this.show(e)),t.add("is_hide",(e,t)=>this.hide(e)),t.add("resize",(e,t)=>this.resize(t)),Object.defineProperty(usf,"isInstantSearchShowing",{configurable:!0,get:()=>this.app?this.app.shouldShow:0})},V,A,z={},j;H.prototype={resize(e){this.app&&this.app.show&&this.reposition(this.app.input)},show(s){if(!V){var o={mixins:[usf.components.SearchResultsItemBase],template:i.instantSearchItem,imageSize:"small",methods:{onItemClick(){var e=this.product;_usfaq.track("productClick",{url:this.productUrl,id:e.id,title:e.title,variantId:e.selectedVariantId,imageUrl:this.imageUrl,term:this.term}),location=this.productUrl}}};usf.components.InstantSearchItem=usf.register(o,null,"usf-is-item"),j=e.search.online?l.baseUrl+e.search.searchResultsUrl:l.searchUrl,V=document.createElement("div"),document.body.appendChild(V);var n={el:V,template:i.instantSearch,data:{left:0,top:0,width:0,show:!1,popupFocus:!1,firstLoader:!0,loader:!0,term:"",result:null,position:"right"},computed:{shouldShow(){return this.show||this.popupFocus},isEmpty(){var e=this.result;return!(e&&(e.items.length||e.pages&&e.pages.length||e.collections&&e.collections.length))},queryOrTerm(){var e=this.result;return e?e.query:this.term}},methods:{close(){this.show=0,this.popupFocus=!1,window.usf_container&&usf_container.click(),a.hideInstantSearch()},onSearchBoxInput(e){this.term=e.target.value,this.updateResults()},onClear(){this.term="",this.updateResults(),this.$refs.searchInput.focus()},updateResults(){var i=this;if(i.term!==i._oldTerm){i._oldTerm=i.term,A&&A.abort(),t.raise("is_updating",this,null);var r=usf._refineTerm(i.term),s=z[r];if(s)return i.loader=!1,i.result=s,void i.$nextTick(()=>{t.raise("is_updated",this,i.result)});i.loader=!0;var o={q:r,apiKey:e.siteId},n=l.customerTags;n&&n.length&&(o.customerTags=n.join(",")),o.locale=l.locale,e.instantSearch.showCollections&&(o.showCollections=1),e.instantSearch.showPages&&(o.showPages=1),A=a.send({url:e.searchSvcUrl+"instantsearch",data:o,success:function(e){A=null,i.loader=!1,i.firstLoader=!1,e=JSON.parse(e),t.raise("is_dataReceived",this,e.data),i.result=e.data,z[r]=e.data,i.$nextTick(()=>{t.raise("is_updated",this,i.result)})},error:function(e){A=null,i.loader=!1}})}},search(t){this.show=0,this.popupFocus=!1;var i=j;location.pathname===i&&e.search.online||window.usf_container&&a.closest(this.input,"usf-sr-inputbox")?(this.input.value=t,c.term=t):location=i+"?"+c.getTermQuery(t),window.usf_container&&usf_container.click(),a.hideInstantSearch()},selectCollection(e){location=l.getCollectionUrl(e.urlName)},selectPage(e){location=l.getPageUrl(e)}},beforeMount(){this.searchUrl=j,this.settings=e.instantSearch,this.loc=r,document.body.addEventListener("mousedown",e=>{if(this.shouldShow){for(var i=e.target;i&&i!==this.$el&&i!==this.input;){if(i===document.body){var r={cancel:!1};return t.raise("is_hiding",this,r),r.cancel?(this.popupFocus=!0,void a.stopEvent(e)):void this.close()}i=i.parentNode}this.popupFocus=!0}}),document.body.addEventListener("mouseup",e=>{this.shouldShow&&setTimeout(()=>{this.input.value||(this.popupFocus=!1)},100)})}};this.app=new RVue(n)}this.reposition(s),usf.isMobile&&setTimeout(()=>{var e=window.usf_container||document.querySelector("main");if(e){var t=document.createEvent("HTMLEvents");t.initEvent("click",!0,!1),e.dispatchEvent(t)}var i=this.app.$refs.searchInput;i&&i.focus()},170)},reposition(e){var t=this.app;if(t.input=e,usf.isMobile)with(t)show=1,term=e.value,updateResults();else{var i=e.getBoundingClientRect(),r={x:i.x+window.scrollX,y:i.y+window.scrollY};o(r),this._posTimeout&&clearInterval(this._posTimeout);var s=0,a=()=>{if(this.app.shouldShow){var t=M(e);if(r.y!==t.y||r.x!==t.x){if(!e.offsetWidth&&!e.offsetHeight||t.y<0)return clearInterval(this._posTimeout),void this.app.close();o(t)}++s>=25&&clearInterval(this._posTimeout)}else clearInterval(this._posTimeout)};this._posTimeout=setInterval(a,200)}function o(i){var r=i.x,s=i.y+e.offsetHeight,a=e.offsetWidth,o=a,l=window.innerWidth,n;with(o<506&&(o=506),r+o>l-30?(r=r+a-o,n="right"):n="left",t)left=r,top=s,width=o,show=1,term=e.value,position=n,updateResults()}},hide(){this.app&&(this.app.show=0,this.app.popupFocus=0)}},new H;var q=["price"],W;function K(e){var t;return void 0!==e.min?(t=(e.minInclusive?":":"")+e.min+" ",e.max<De&&(t+=(e.maxInclusive?":":"")+e.max),t+=" "+e.label):t=e.label,t}function X(e,t,i,r){var s=t.inStockLabel;if(void 0!==s){var a=t.outOfStockLabel;return"1"===e.label?s:a}return e.label||"reviewRating"!==t.facetName?void 0!==e.min?Y(e,t):J(e.label,t):Z(e,t.ratingColor)}function Y(t,i){var r=t.min,s=t.max,a=q.includes(i.facetName);return a?(r=$e(r*e.currencyRate),r=Me(e.priceFormat,r)):r=$e(r),s!==De&&(a?(s=$e(s*e.currencyRate),s=Me(e.priceFormat,s)):s=$e(s)),Me(t.label,r,s)}function G(t,i,r){if(t.numericRange){var s=r.indexOf(" ");if(-1!==s){var a,o,l=r.substr(0,s),n=r.indexOf(" ",s+1);-1===n?a=r.substr(s+1):(a=r.substr(s+1,n-s-1),o=r.substr(n+1));var c=":"===l[0],u=":"===a[0];l=Be(l),a=Be(a);var h=q.includes(i),d=ee(h,t.valueFormula),f=d(parseFloat(l)),p=a.length?d(parseFloat(a)):-1;if("reviewRating"===i&&!o)return Z({min:f,minInclusive:c,max:p,maxInclusive:u},t.ratingColor);o||(f<t.min&&(l=t.min.toString()),p>t.max&&(a=t.max.toString()),o=t.rangeFormat);var m,g=t.range;return g&&(m=g[2]),h?(l=Me(e.priceFormat,$e(f,m)),a&&(a=Me(e.priceFormat,$e(p,m)))):(l=$e(f,m),a&&(a=$e(p,m))),Me(o,l,a)}}else{if(void 0!==t.inStockLabel)return"1"===r?t.inStockLabel:t.outOfStockLabel;if("collections"===t.facetName){var v=parseInt(r);if(!Number.isNaN(v)){var b=usf.collectionsByUrlName;for(var w in b){var y=b[w];if(y.id===v){r=y.title;break}}}}}return J(r,t)}function J(e,t){var i=t.valuesTransformation;return i?'<span class="usf-'+i.toLowerCase()+'">'+e+"</span>":e}function Q(){setTimeout(()=>{usf_container.getBoundingClientRect().top<=-50&&a.scrollTo(usf_container.scrollTop,800)},100)}function Z(e,t){var i;i=e.minInclusive||!e.maxInclusive?e.min:e.max;for(var r='<span class="usf-stars" style="color:'+t+'">',s=1;s<=5;s++)r+='<i class="usf-icon usf-icon-star'+(s>i?"-empty":"")+'"></i>';return r+="</span>"}function ee(e,t){return t||e?function(i){return e&&(i=a.convertPrice(i)),t&&(eval("var value="+i),i=eval("("+t+")")),i}:e=>e}var te={template:i.filtersBreadcrumb,inject:{root:{default:null}},data:()=>({loc:r}),methods:{onClearAll(){this.root.removeAllFacetFilters()}},computed:{facetFilterIds(){var e=this.root.facetFilters,t=[];for(var i in e)t.push(parseInt(i));return t}},methods:{}};usf.components.FacetFilterBreadcrumb=usf.register(te,null,"usf-filter-breadcrumb");var ie=e.filters.horz,re={props:{facet:Object,terms:Object},template:i.filter,inject:{root:{default:null}},created(){var e=this.facet;this.loc=r,this.id=e.id,this.hasLazyLoad=e.maxHeight&&!e.maxItems&&"List"===e.display&&e.labels.length>24,this.maxItems=this.hasLazyLoad?24:e.maxItems,this.loadedItemsCount=this.maxItems},data(){this.facet;return{loadedItemsCount:this.maxItems}},computed:{rangeConverter(){return ee(this.isPrice,this.facet.valueFormula)},rangeResolver(){return ee(this.isPrice,this.facet.inverseFormula)},canShow(){var e=this.facet;return this.isRange?e.min!==e.max:e.navigationCollections?this.options.length:e.labels.length},rangeDecimals(){var e=this.facet.range[2];return"number"!=typeof e?1:e},range(){var e=this.facet,t=e.min,i=e.max,r=t,s=i,a=this.root.facetFilters;if(a){var o=a[e.id];if(o){var l=(o=o[1])[0].split(" ");r=parseFloat(Be(l[0])),s=parseFloat(Be(l[1])),r<t&&(r=t),s>i&&(s=i)}}return[r,s]},isRange(){var e=this.facet;return void 0!==e.min&&"List"!==e.display},hasRangeInputs(){var e=this.facet;return!e.valueFormula||e.inverseFormula},isPrice(){return q.includes(this.facet.facetName)},hasSearchBox(){var e=this.facet;return usf.isMobile?e.searchBoxOnMobile:e.searchBoxOnPc},isInBreadcrumb(){var e=this.root.facetFilters;return e&&e[this.facet.id]},options(){var e,t,i=this.facet,r=i.sort,s=i.labels;if(i.navigationCollections){var a=le(i);if(a)return a}if(t=i.manualValues){var o=[];if(t.forEach(e=>{var t=s.find(t=>t.label===e);t&&o.push(t)}),!o.length)return;s=o,i.sortManualValues||(r=null)}else if(e=i.excludedValues)for(var l=s.length-1;l>=0;l--)e.includes(s[l].label)&&s.splice(l,1);null!==r&&(s=s.slice(0,s.length)).sort((e,t)=>{var i=e.label.toLowerCase(),s=t.label.toLowerCase();switch(r){case 1:return i<s?-1:i>s?1:0;case 2:return i<s?1:i>s?-1:0;case 3:return t.value-e.value;case 4:return e.value-t.value}});var n=this.term;return n&&(n=n.toLowerCase(),s=s.filter(e=>e.label.toLowerCase().includes(n))),s},visibleOptions(){this.facet;var e=this.options,t=this.maxItems;if(t&&e.length>t){var i=this.loadedItemsCount;i<e.length&&(e=e.slice(0,i))}return e},term:{get(){return this.root.terms[this.id]},set(e){this.$set(this.root.terms,this.id,e)}},collapsed(){var e=this.root.collapsed[this.id];return void 0===e&&(e=this.facet.collapseOnPc||ie),e},isMoreVisible(){var e=this.facet,t=this.options,i=(e.id,e.maxItems);return!!(i&&t.length>i)&&(!(this.loadedItemsCount>=t.length)&&i)}},mounted(){if(this.hasLazyLoad){var e=this.$refs.values;usf.isMobile&&(e=a.closest(e,"usf-body")),e&&(this._scrollEl=e,a.on(e,"scroll",this.onScroll))}},beforeDestroy(){this._scrollEl&&a.off(this._scrollEl,"scroll",this.onScroll)},methods:{onShowMore(e){var t=this.facet;this.loadedItemsCount+=t.maxItems,this.$nextTick(()=>this.$refs.values.scrollTop=this.$refs.values.scrollHeight),a.stopEvent(e)},onScroll(e){var t=this._scrollEl,i=t.scrollTop+t.offsetHeight;if(this.loadedItemsCount<this.options.length&&i+5>t.scrollHeight){this.loadedItemsCount+=this.maxItems;var r=t.parentNode.classList;r.add("usf-with-loader"),setTimeout(function(){r.remove("usf-with-loader")},300)}},onExpandCollapse(){var e=this.root,t=this.id,i=e.collapsed[t];void 0===i&&(i=this.collapsed),i?(ie&&(e.facets.forEach(t=>{this.$set(e.collapsed,t.id,1)}),W||(W=(t=>{a.closest(t.target,"usf-facet")||(e.facets.forEach(t=>{this.$set(e.collapsed,t.id,1)}),a.off(document,"click",W))})),setTimeout(()=>a.on(document,"click",W),400)),this.$set(e.collapsed,t,0)):this.$set(e.collapsed,t,1)},onClear(e){this.root.removeFacetFilter(this.facet.id,null),a.stopEvent(e)},onRangeSliderInput(e){var t=this.root,i=t.facetFilters,r=this.facet,s=r.id,a=this.rangeDecimals;i||(t.facetFilters=i={});var o=i[s];o||(o=[r.facetName,""],this.$set(i,s,o)),this.$set(o,1,[":"+e[0].toFixed(a)+" :"+e[1].toFixed(a)])},onRangeInput(t,i,r){var s=this.facet;if(s.inverseFormula){var a=this.rangeResolver(parseFloat(t.target.value)),o=r?[this.range[0],this.range[1]=a]:[this.range[0]=a,this.range[1]];return this.onRangeSliderInput(o),void this.onRangeSliderChange(o)}var l=s.min,n=s.max,u=this.root,h=this.range[0],d=this.range[1],f=s.id,p=u.facetFilters,m=parseFloat(t.target.value);if(isNaN(m))t.target.value=i.toString();else{m>n?m=n:m<l&&(m=l),1===r&&m<h?m=h:!r&&m>d&&(m=d);var g=[h,d];if(g[r]=m,this.isPrice&&g[0]===l&&g[1]===n)p&&u.$delete(p,f);else{var v=":"+g[0]+" :"+g[1];p||(u.facetFilters=p={});var b=p[f];b||(b=[s.facetName,""],u.$set(p,f,b)),u.$set(b,1,[v]),_usfaq.track("facetFilter",{term:c.term,filterFacetLabel:v.replace(/\:/g,"").replace(" ",":"),filterFacetName:s.title})}c.facetFilters=p,e.filterNavigation.scrollUpOnChange&&Q()}},onRangeSliderChange(t){var i=this.root.facetFilters;if(i){var r=this.facet,s=r.id;if(this.isPrice&&t[0]===r.min&&t[1]===r.max)this.$delete(i,s);else if(i[s]){var o=a.formatNumber,l=this.rangeDecimals;_usfaq.track("facetFilter",{term:c.term,filterFacetLabel:o(t[0],l)+":"+o(t[1],l),filterFacetName:r.title})}c.facetFilters=i,e.filterNavigation.scrollUpOnChange&&Q()}}}};usf.components.Filter=usf.register(re,null,"usf-filter");var se={template:usf.templates.filterOption,props:{facet:Object,option:Object},inject:{root:{default:null}},created(){var e=this.facet,t=e.displayMode;this.isSwatch=2===t,this.isBox=1===t;var i=this.option,s=i.children;this.children=s&&s.length?s:null;var a=e.swatchImages?e.swatchImages[e.labelPrefix?e.labelPrefix+i.label:i.label]:null;!a||a.color||a.imageUrl||(a=null),this.swatchImage=a,this.swatchStyle=a?a.imageUrl?{backgroundImage:"url("+a.imageUrl+")"}:{backgroundColor:a.color}:null,this.label=s?i.collection.label:X(i,this.facet,this.swatchImage,usf.isMobile),this.loc=r},data(){var e=this.option,t=e.children;return{collapsed:!(t=t&&t.length?t:null)||e.collection&&l.collection!==e.collection.urlName}},computed:{isSelected(){var e,t=this.root,i=this.facet,r=i.id,s=this.option;s.children&&(s=s.collection);var a=t.facetFilters?t.facetFilters[r]:null;a&&(a=a[1],e=(e=s.id)?e.toString():K(s));var l=a&&a.includes(e);if(o&&!l&&i.navigationCollections){var n=usf.collectionsByUrlName[o];l=n&&s.id===n.id}return l}},methods:{getChildLabel(e){switch(this.facet.navigationCollectionsChildType){case"link":var t=e.label,i=t.indexOf("](");return-1!==i?t.substring(1,i):t}return e.label},isChildSelected(e){return this.isSelected&&"tags"===this.facet.navigationCollectionsChildType&&ae(e.label)===l.tagUrlName},onChildClick(e){var t=this.facet,i=this.option.collection;switch(t.navigationCollectionsChildType){case"tags":location=l.getCollectionUrl(i.urlName+"/"+ae(e.label));break;case"productType":location=l.getCollectionUrl(i.urlName+"/ProductType:"+e.label);break;case"vendor":location=l.getCollectionUrl(i.urlName+"/Vendor:"+e.label);break;case"collections":location=l.getCollectionUrl(e.urlName);break;case"link":var r=e.label,s=r.indexOf("](");location=-1!==s?r.substring(s+2,r.length-1):r}},onToggleChildren(e){this.collapsed=!this.collapsed,a.stopEvent(e)},onToggle(){var t=this.root,i=this.option,r=this.facet;if(r.navigationCollections){var s=i.collection;location=l.getCollectionUrl(s?s.urlName:i.id)+location.search}else{var a=i.id;a=a?a.toString():K(i);var o,n=t.facetFilters,u=r.id;n&&(o=n[u]);var h=r.multiple,d=!0;if(o){var f=o[1],p=f.indexOf(a);-1===p?(h||f.splice(0,f.length),f.push(a)):(f.splice(p,1),d=!1),f.length||delete n[u]}else o=[r.facetName,[a]],n||(n={}),n[u]=o;n&&(c.facetFilters=n),r.multiple||(usf.isMobile?t.mobileSelectedFacetId=null:e.filters.horz&&this.$set(t.collapsed,r.id,1)),d&&_usfaq.track("facetFilter",{term:c.term,filterFacetLabel:K(i),filterFacetName:r.title}),e.filterNavigation.scrollUpOnChange&&Q()}}}};function ae(e){return e.toLowerCase().replace(/[\s\:]/g,"-").replace(/--/g,"-")}usf.components.FilterOption=usf.register(se,null,"usf-filter-option");var oe={template:i.filters,data:()=>({facets:null,facetFilters:null,collapsed:{},loadedItems:{},terms:{},mobileSelectedFacetId:null}),beforeMount(){this.loc=r,t.add("sr_updated",(t,i)=>{!this.facets&&e.filters.horz&&i.facets.forEach(e=>{this.$set(this.collapsed,e.id,1)}),this.facets=i.facets});var i=this;n.changed.push(()=>{i.facetFilters=c.facetFilters}),i.facetFilters=c.facetFilters},mounted(){usf.isMobile&&document.body.appendChild(this.$el),t.add("mobile_changed",e=>{if(usf.isMobile)document.body.appendChild(this.$el);else{var t=this.$parent.$el;t.insertBefore(this.$el,t.children[0])}})},provide(){return{root:this}},computed:{isSingleFacetMode(){return this.facets&&1===this.facets.length},mobileSelectedFacet(){return this.facets?this.facets.find(e=>e.id===this.mobileSelectedFacetId):null}},methods:{canShowFilter(e){if(void 0!==e.min)return e.min!==e.max;if(e.navigationCollections){var t=le(e);if(t)return t.length}return e.labels.length},formatBreadcrumbLabel:G,formatFacetLabel:J,onMobileBack(e){e||this.singleFacetMode?document.body.classList.remove("usf-mobile-filters"):this.mobileSelectedFacetId=null},onMobileSelectFacet(e){this.mobileSelectedFacetId=e.id},applyFacetFilters(e){c.facetFilters=e},removeFacetFilter(e,t){var i=this.facetFilters;if(i){if(t){var r=i[e];if(!r)return;var s=r[1],a=s.indexOf(t);-1===a?s.push(label):s.splice(a,1),s.length||delete i[e]}else delete i[e];c.facetFilters=i}},removeAllFacetFilters(){c.removeAllFacetFilters()}}};function le(e){var t=e.navigationCollectionsMenu;if(t){var i=e.labels;if(e.navigationCollectionsKeepMain)return t.map(e=>{var t=i.find(t=>t.id===e.collection.id);return t?Object.assign({id:t.id,value:t.value},e):e});var r=[];return t.forEach(e=>{var t;(t=i.find(t=>t.id===e.collection.id))&&r.push(Object.assign({id:t.id,value:t.value},e))}),r}}usf.components.Filters=usf.register(oe,null,"usf-filters");var ne=e.search.more,ce="infinite"===ne,ue=ce||"more"===ne,he={template:i.searchResults,data(){var e=c.term;return{loader:!1,term:e,termModel:e,sortBy:c.sort,view:c.view,facetFilters:c.facetFilters,page:c.page,itemsPerPage:c.itemsPerPage,take:c.take,result:null,hasFacets:!0}},computed:{hasResults(){return this.result&&this.result.items.length},noFacets(){return!this.hasFacets&&!this.facetFilters},pagesTotal(){var e=this.result;return e&&e.total?Math.floor((e.total-1)/this.itemsPerPage+1):0}},created(){usf.search=this;var t=e.search.sortFields;t&&(t=t.map(e=>{return{label:r["sortBy_"+e]||e,value:e}})),this.sortByOptions=t,this.showSearchBox=o?e.search.showSearchInputOnCollectionPage:e.search.showSearchInputOnSearchPage,this.loc=r},beforeMount(){n.changed.push(()=>{var t=n.getChanges();if(t.length){n.snapshot(),this.term=this.termModel=c.term,this.sortBy=c.sort,this.view=c.view,this.facetFilters=c.facetFilters,this.page=c.page,this.itemsPerPage=c.itemsPerPage;var i=this.take;if(this.take=c.take,ue){if(!(this.take===i||this.take>this.itemsLoaded+e.search.itemsPerPage))return this.take<i?(this.result.items.splice(this.take,this.result.items.length-this.take),void(this.itemsLoaded=this.take)):void this.refresh(!0);c.take=0}c.isViewChanged(t)&&this.refresh()}}),k&&window.addEventListener("pageshow",()=>{n.snapshot(),t.raise("resetstate")}),n.snapshot(),this.refresh()},mounted(){if(a.installSearchInput(this.$refs.searchInput,usf.isMobile),e.showGotoTop){var t=document.createElement("div");document.body.appendChild(t),t.innerHTML=i.gotoTop,a.on(t.children[0],"click",function(e){a.scrollTo(0,800)}),a.on(document,"scroll",function(e){window.scrollY>170?document.body.classList.add("usf-with-goto-top"):document.body.classList.remove("usf-with-goto-top")},{passive:!0})}ce&&pe(this,".usf-sr-paging")},methods:{onInfiniteLoad(){this.onLoadMore()},onRedirect(e){location=e},onSortByChanged(e){c.sort=e===this.sortByOptions[0].value?"":e},clearSearch(){this.termModel="",c.term="";var e=this.$refs.searchInput;e.value="",e.focus()},onGridViewClick(){c.view="",this.$nextTick(()=>{t.raise("sr_viewChanged",this,"grid")})},onListViewClick(){c.view="list",this.$nextTick(()=>{t.raise("sr_viewChanged",this,"list")})},onLoadMore(){c.take=this.itemsLoaded+e.search.itemsPerPage},refresh(e){var i=this;i.loader||(i._refreshTime=(new Date).getTime()),i.loader=!e||"more",t.raise("sr_updating",this,null),e||(this.itemsLoaded?c.resetPagination():c.skip=0,this.itemsLoaded=0),usf.fetch(this,e)}}};usf.components.SearchResults=usf.register(he,null,"usf-sr");var de={props:{position:String,banner:Object},template:i.searchResultsBanner},fe;function pe(e,i){t.add("sr_updated",()=>{fe=null}),a.on(document,"scroll",function(t){(fe||(fe=document.querySelector(i)),fe)&&(fe.getBoundingClientRect().top<=window.innerHeight&&!0!==e.loader&&e.itemsLoaded<e.result.total&&e.onInfiniteLoad())},{passive:!0})}function me(e,t){return{type:"page",page:e,current:t}}usf.components.SearchResultsBanner=usf.register(de,null,"usf-sr-banner");var ge={props:{page:Number,pagesTotal:Number,pagesToDisplay:{type:Number,default:4},sidePagesToDisplay:{type:Number,default:1}},data:()=>({loc:r}),template:i.searchResultsPages,computed:{elements(){var e=this.pagesTotal;if(e<=1)return[];this.loc;var t=this.page,i=this.pagesToDisplay,r=this.sidePagesToDisplay,s=t>i/2+2&&e>i+1,a=e>i+1&&t<e-(i/2+1),o=[];t>1&&o.push({type:"prev"});var l=1;if(s){for(var n=1;n<=r;n++)o.push(me(n));l=r+1,o.push({type:"dots"})}else for(n=l;n<t-i/2;n++)o.push(me(n));for(n=0;n<i/2;n++){(c=t-i/2+n)<l||o.push(me(c))}o.push(me(t,!0));for(n=0;n<i/2;n++){var c;if((c=t+n+1)>e)break;c<l||(o.push(me(c)),l++)}if(a){o.push({type:"dots"});for(n=e-r+1;n<=e;n++)o.push(me(n))}else for(n=t+i/2+1;n<=e;n++)o.push(me(n));return t<e&&o.push({type:"next"}),o},prevUrl(){return this.getPageUrl(this.page-1)},nextUrl(){return this.getPageUrl(this.page+1)}},methods:{getPageUrl:e=>c.getPageUrl(e),onPrev(e){c.page=this.page-1,Q(),a.stopEvent(e)},onNext(e){c.page=this.page+1,Q(),a.stopEvent(e)},onPage(e,t){return e!==this.page&&(c.page=e,Q()),a.stopEvent(t)}}};usf.components.SearchResultsPages=usf.register(ge,null,"usf-sr-pages");var ve=e.search.priceUnit||"",be,we=e.search.imageSize,ye;if(we){var Ie=we.split(",");we=Ie[usf.isMobile&&Ie.length>1?1:0],e.search.imageSize=we}switch(e.search.imageSizeType){case"dynamic":be="{size}";break;case"fixed":be=we}function Se(t){var i,s,o,n=t.product,c=n.variants,u=n.selectedVariantId,h=u?c.find(e=>e.id===u):null,d=h||(c.length?c[0]:null),f=d.compareAtPrice,p=d.price,m=f>p?f-p:0,g=l.collection,v=l.getProductUrl(g,n,h);if(h)i=h.available,s=1&h.flags,o=i>0||-2147483648===i;else{i=0;for(var b=0;b<c.length;b++){var w=c[b];if(-2147483648===w.available){i=-2147483648,s=!1,o=!0;break}i+=w.available,w.available>0&&(o=!0),1&w.flags&&(s=!0)}}var y=!!m;t.collection=g,t.productUrl=v,t.available=i,t.hasDiscount=y,t.continueSelling=s,t.isSoldOut=!s&&!o,t.price=p,t.compareAtPrice=f,t.originalPrice=f>p?f:p,t.displayPrice=a.getDisplayPrice(t.originalPrice)+ve,t.displayDiscountedPrice=a.getDisplayPrice(t.price)+ve,y&&(t.displayDiscount=a.getDisplayPrice(m)+ve,t.discount=m),t.selectedVariant=h,t.selectedVariantForPrice=d,t.loc=r,t.scaledSelectedImageUrl=t.getSelectedImageUrl(be),t.selectedImage=a.getProductImage(t.product,t.selectedVariant),t.hoverImage=e.search.showAltImage&&!u?Le(n):null}function xe(e){}function Pe(e){e.c||(ye=1)}var Fe={props:{product:Object,term:String,result:Object,imageSize:{type:String,default:"list"}},created(){Se(this)},data:()=>({isHover:!1,c:1}),computed:{salePercent(){if(Pe(this),!this.hasDiscount)return 0;var e=this.selectedVariantForPrice;return Math.ceil(100-100*e.price/e.compareAtPrice)},minPrice(){var e=this.originalPrice;return this.product.variants.forEach(t=>{var i=t.compareAtPrice,r=t.price,s=i>r?i:r;s<e&&(e=s)}),e},maxPrice(){var e=this.originalPrice;return this.product.variants.forEach(t=>{var i=t.compareAtPrice,r=t.price,s=i>r?i:r;s>e&&(e=s)}),e},minDiscountedPrice(){var e=this.price;return this.product.variants.forEach(t=>{var i=t.price;i<e&&(e=i)}),e},maxDiscountedPrice(){var e=this.price;return this.product.variants.forEach(t=>{var i=t.price;i>e&&(e=i)}),e},priceVaries(){return this.minDiscountedPrice!==this.maxDiscountedPrice},displayMinPrice(){return a.getDisplayPrice(this.minPrice)+ve},displayMaxPrice(){return a.getDisplayPrice(this.maxPrice)+ve},displayMinDiscountedPrice(){return a.getDisplayPrice(this.minDiscountedPrice)+ve},displayMaxDiscountedPrice(){return a.getDisplayPrice(this.maxDiscountedPrice)+ve},displayLongPrice(){return Pe(this),a.getLongDisplayPrice(this.originalPrice)+ve},displayLongDiscount(){return Pe(this),a.getLongDisplayPrice(this.discount)+ve},displayLongDiscountedPrice(){return Pe(this),a.getLongDisplayPrice(this.price)+ve},image(){var e;return xe("image"),Pe(this),this.isHover&&(e=this.hoverImage),e||this.selectedImage},scaledHoverImageUrl(){return this.getHoverImageUrl(be)},imageUrl(){return xe("imageUrl"),Pe(this),this.getImageUrl(this.imageSize)},selectedImageUrl(){return xe("selectedImageUrl"),Pe(this),this.getSelectedImageUrl(this.imageSize)},hoverImageUrl(){return xe("hoverImageUrl"),Pe(this),this.getHoverImageUrl(this.imageSize)},originalImageUrl(){return xe("originalImageUrl"),Pe(this),this.getImageUrl()},originalSelectedImageUrl(){return xe("originalSelectedImageUrl"),Pe(this),this.getSelectedImageUrl()},originalHoverImageUrl(){return xe("originalHoverImageUrl"),Pe(this),this.getHoverImageUrl()},scaledImageUrl(){return xe("scaledImageUrl"),Pe(this),this.getImageUrl(be)},pluginData(){return{product:this.product,isHover:this.isHover,result:this.result,owner:this}}},methods:{reset(){this.isHover=!1},onItemClick(){var e=this.product;_usfaq.track("productClick",{url:this.productUrl,id:e.id,title:e.title,variantId:e.selectedVariantId,imageUrl:this.imageUrl,term:this.term})},onItemHover(){this.isHover=!0},onItemLeave(){this.isHover=!1},getImageUrl(e){var t,i=this.product;return this.isHover&&(t=this.getHoverImageUrl(e)),t||a.getProductImageUrl(i,this.selectedVariant,e)},getSelectedImageUrl(e){return a.getProductImageUrl(this.product,this.selectedVariant,e)},getHoverImageUrl(t){if(e.search.showAltImage){var i=this.product;if(!i.selectedVariantId)return Ne(i,t)}},getMetafield(e,t){return a.getMetafield(this.product,e,t)},setSelectedVariantId(e){var t=this.product,i=t.variants.find(t=>t.id===e);if(i)return t.selectedVariantId=e,Se(this),this.c++,this.$forceUpdate(),i}}};usf.components.SearchResultsItemBase=Fe;var _e={mixins:[Fe],template:i.searchResultsGridViewItem};usf.components.SearchResultsGridItem=usf.register(_e,null,"usf-sr-griditem");var Ue={mixins:[Fe],template:i.searchResultsListViewItem};usf.components.SearchResultsListItem=usf.register(Ue,null,"usf-sr-listitem"),t.add("init",function(){if(window.usf_container){o=l.collection;var r=usf.app=new RVue({el:usf_container,template:i.app,data:{collection:null,settings:e},mounted(){usf.settings=e=this.settings,t.raise("mounted")}});t.add("sr_updated",function(){var e=l.collection;if(e){var t=usf.collectionsByUrlName[e];r.$set(usf.app,"collection",t||{title:"All products"})}}),t.add(["mobile_changed","rerender"],function(){Oe(r)}),t.add("resetstate",function(){!function e(t){t.$children.forEach(t=>e(t)),t.reset&&t.reset()}(r)})}});var Ce={functional:!0,props:{name:String,data:Object},render(e,t){var i=usf.plugins.invoke("render_"+t.props.name,[t.parent,e,t.props.data]);return usf.plugins.lastRenderResult=i,i}};function Te(e,t,i){for(var r=0,s=0,a=function(){++s===r&&t()},o=document.head.children,l=0,n=0;n<o.length;n++){var c=o[n],u=c.src;u&&u.includes(e)&&(r++,c.addEventListener("load",a),l++)}!l&&i&&i(l)}function ke(e,t){return e?e.replace(new RegExp(t,"gi"),e=>'<span class="usf-highlight">'+e+"</span>"):e}usf.components.Plugin=usf.register(Ce,null,"usf-plugin"),Object.assign(a,{registerScriptsLoadedCallback(e,t,i,r,s,a){var o;e?i():(r&&(o=setTimeout(s,r)),Te(t,function(){setTimeout(i,30),r&&clearTimeout(o)},a))},getMetafield(e,t,i){var r=e.metafields&&e.metafields.find(e=>e.namespace===t&&e.key===i);return r&&r.value?r.value:""},getProductImage(e,t){var i,r=0,s=e.images;s&&(t&&(i=t.imageIndex)>0&&i<s.length&&(r=i));return s&&s[r]||l.emptyImage},getProductImageUrl(e,t,i){var r,s=0,a=e.images;a&&(t&&(r=t.imageIndex)>0&&r<a.length&&(s=r));return a=a&&a[s],l.getImageUrl((a?a.url:null)||l.emptyImage.url,i)},convertPrice:t=>e.currencyRate?t*e.currencyRate:t,isVariantSoldOut(e){var t=e._s;if(void 0!==t)return t;-2147483648===e.available?t=!1:t=!(1&e.flags)&&e.available<=0;e._s=t},getDisplayPrice:t=>Me(e.priceFormat,$e(a.convertPrice(t))),getLongDisplayPrice:t=>Me(e.priceLongFormat,$e(a.convertPrice(t))),formatNumber:$e,format:function(e){for(var t=1;t<arguments.length;t++)e=e.replace("{"+(t-1)+"}",arguments[t]);return e},highlight:ke,ensureMobile(i){var r=document.body.clientWidth;if(r!==Re||!0===i){Re=r;var s=r<e.mobileBreakpoint;s!==usf.isMobile&&(usf.isMobile=s,document.body.classList[usf.isMobile?"add":"remove"]("usf-mobile"),t.raise("mobile_changed")),t.raise("resize",null,{width:r})}},scrollTo(e,t){if(k)return window.scrollTo(0,e);const i=document.scrollingElement,r=i&&i.scrollTop||window.pageYOffset,s=e-r;let a=0;const o=function(){const e=(i=a+=20,l=r,n=s,(i/=t/2)<1?n/2*i*i*i+l:n/2*((i-=2)*i*i+2)+l);var i,l,n;window.scrollTo(0,e),a<t&&requestAnimationFrame(o)};o()}});var Me=a.format;function Le(e){var t=e.images;return t=t&&t.length>1&&t[1]}function Ne(e,t){var i=e.images;return i&&i.length>1&&l.getImageUrl(i[1].url,t)}var De=1.7976931348623157e308,Re;function $e(t,i){var r;void 0===i&&(i=e.decimals);var s=Math.pow(10,i);r=Math.round(t*s).toString();var a=e.decimalDisplay,o=e.useTrailingZeros;if(i){var l=r.length;if(l>i){var n,c=l-i,u=r.substr(c);if(o)if(u.length<i)for(;u.length<i;)u+="0";else{for(var h=u.length-1;h>i&&"0"==u[h];)h--;h++,u=u.substr(0,h)}else{n=!0;for(var d=u.length-1;d>=0;){if("0"!==u[d]){n=!1;break}d--}d++,!n&&d<u.length&&(u=u.substr(0,d))}r=n?r.substr(0,c):r.substr(0,c)+a+u}else if(o){for(;r.length<i;)r="0"+r;r="0"+a+r}else if("0"!==r){for(;r.length<i;)r="0"+r;r="0"+a+r}}var f=e.thousandSeparator;return f?r.replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1"+f):r}function Oe(e){e.$children.forEach(e=>Oe(e)),e.$forceUpdate()}function Ee(e,t,i){var r;return function(){var s=this,a=arguments;clearTimeout(r),r=setTimeout(function(){r=null,i||e.apply(s,a)},t),i&&!r&&e.apply(s,a)}}function Be(e){return":"===e[0]?e.substring(1):e}function He(){return window.performance&&window.performance.navigation.type===window.performance.navigation.TYPE_BACK_FORWARD}function Ve(){if(window.usf_container){var e=He();if(e){let e;try{e=localStorage.getItem("usf-scroll")}catch(e){}var i,r;if(history.scrollRestoration="manual",null!==e){var s=function(){i||window.scrollTo(0,parseInt(e))};t.add("sr_updated",()=>{if(!r&&!i){r=!0;var e=usf.isContentReady;if(e)for(var t=0;t<15;t++){setTimeout(function(t){return()=>{i||(14===t||e&&e())&&(s(),i=!0)}}(t),200+200*t)}else setTimeout(s,1500)}})}}var a=k?"pagehide":"beforeunload";window.addEventListener(a,()=>{try{localStorage.setItem("usf-scroll",window.scrollY)}catch(e){}}),k&&e&&window.addEventListener("pageshow",()=>{setTimeout(()=>{let e;try{e=localStorage.getItem("usf-scroll")}catch(e){}e&&window.scrollTo(0,parseInt(e))},500)})}}a.ready(function(){Re=document.body.clientWidth,window.addEventListener("resize",a.ensureMobile)}),Ve()}();

/* Begin plugin code */

/* End plugin code */