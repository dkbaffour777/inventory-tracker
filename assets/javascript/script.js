var API_KEY = "2cda45a79cmshb35a8f726f92142p1243fajsne0748752511b" // insert your API key in the double quotes

var products = [
    {
        name: "Das Keyboard DKP13-PRMXT00-US Prime 13 Cherry MX Brown Mechanical Keyboard",
        upc: "859285005404"
    },
    {
        name: "Samsung 27\" Odyssey G7 Gaming Monitor",
        upc: "887276413129"
    },
    {
        name: "Nvidia GEFORCE GTX 1080 Ti",
        upc: "812674021317"
    },
    {
        name: "EVGA 10G-P5-3897-KR GeForce RTX 3080 FTW3 ULTRA GAMING, 10GB GDDR6X, iCX3 Technology, ARGB LED, Metal Backplate",
        upc: "843368067243"
    },
    {
        name: "AMD Ryzen 9 5900X 12-core, 24-Thread Unlocked Desktop Processor",
        upc: "730143312738"
    },
    // Follow the object format and add more items
    // The dropdown will be updated by javascript with the new list of items
]

// Test data
/* const inventoryDetails = {
    Attributes: [
        {Type: null, Key: "model", Value: "DKP13-PRMXT00-US"},
        {Type: null, Key: "mpn", Value: "DKP13-PRMXT00-US"},
        {Type: "Important", Key: "color", Value: "black"},
        {Type: "Important", Key: "brand", Value: "Das Keyboard"}
    ],
    BasePrice: 129,
    BestPrice: 129,
    FormattedBasePrice: "$129.00",
    FormattedBestPrice: "$129.00",
    ID: 859285005404,
    Media: {
        ImageAlternatives: [
            "https://x.shopsavvy.com/https://images-na.ssl-images-amazon.com/images/I/41dmeeocIoL.jpg",
            "https://x.shopsavvy.com/https://images-na.ssl-images-amazon.com/images/I/41WGxXICNdL.jpg",
            "https://x.shopsavvy.com/https://images-na.ssl-images-amazon.com/images/I/41p6GZBP8OL.jpg",
            "https://x.shopsavvy.com/https://images-na.ssl-images-amazon.com/images/I/41j7KIBpPcL.jpg",
    
        ],

    },
    XImage: "https://x.shopsavvy.com/https://images-na.ssl-images-amazon.com/images/I/41j7KIBpPcL.jpg",
    Offers: [
        {
            FormattedPrice: "$99.00",
            InStockStatus: "0",
            Link: "https://www.google.com/search?tbm=shop&q=859285005404",
            Merchant: "Das Keyboard Store",
            Quality: "New",
        }
    ],
    FormattedPrice: "$99.00",
    InStockStatus: "0",
    Link: "https://www.google.com/search?tbm=shop&q=859285005404",
    Merchant: "Das Keyboard Store",
    Quality: "New",
    Title: "Das Keyboard DKP13-PRMXT00-US Prime 13 Cherry MX Brown Mechanical Keyboard - White LED Backlit Soft Tactile"
}

const inventorOffers = [
    {
        FormattedPrice: "$89.29",
        InStockStatus: "1",
        Merchant: "Amazon",
        Quality: "new",
        link: "https://www.amazon.com/dp/B01L9X1TRE",
    },
    {
        FormattedPrice: "$109.29",
        InStockStatus: "0",
        Merchant: "Walmart",
        Quality: "Used",
        link: "https://www.amazon.com/dp/B01L9X1TRE",
    },
    {
        FormattedPrice: "$79.29",
        InStockStatus: "1",
        Merchant: "Best Buy",
        Quality: "new",
        link: "https://www.amazon.com/dp/B01L9X1TRE",
    },
    {
        FormattedPrice: "$100.29",
        InStockStatus: "0",
        Merchant: "Altex Electronics",
        Quality: "Used",
        link: "https://www.amazon.com/dp/B01L9X1TRE",
    },
    {
        FormattedPrice: "$189.29",
        InStockStatus: "1",
        Merchant: "Colamco",
        Quality: "Used",
        link: "https://www.amazon.com/dp/B01L9X1TRE",
    },
] */

// Handle app tutorial
var handleTutorial = (function(){
    if(!localStorage.getItem("inventoryTrackerTutorial")) {
        var welcomeModalEl = document.querySelector("#welcome-modal")
        var tutModalEl = document.querySelector("#tutorial-modal")

        welcomeModalEl.setAttribute("class", "modal is-active")

        // Close the welcome modal
        document.querySelector("#tut-yes").addEventListener("click", function(){
            welcomeModalEl.setAttribute("class", "modal")
        })
        
        // Navigate to tutorial modal
        document.querySelector("#tut-no").addEventListener("click", function(){
            welcomeModalEl.setAttribute("class", "modal")
            tutModalEl.setAttribute("class", "modal is-active")
        })

        // Close the tutorial modal
        document.querySelector("#tutorial-modal-close").addEventListener("click", function(){
            tutModalEl.setAttribute("class", "modal")
            localStorage.setItem("inventoryTrackerTutorial", JSON.stringify("Inventory Tracker User"))
        })
        
        // Navigate between tutorial tabs
        document.querySelectorAll(".tutorial-tab").forEach(function(element){
            
            element.addEventListener("click", function(){
                var currentTab = element.closest(".tutorial-tab")
                var imgID = currentTab.dataset.imageId
                var imgLink = "./assets/images/tutorial-img-" + imgID + ".png"

                document.querySelector("#tut-img").setAttribute("src", imgLink)
                handleActiveTab(imgID)
            })
        })
        
        function handleActiveTab(imgID) {
            document.querySelectorAll(".tutorial-tab").forEach(function(element){
                if(element.dataset.imageId == imgID) {
                    element.setAttribute("class", "tutorial-tab is-active")
                } else {
                    element.setAttribute("class", "tutorial-tab")
                }
            })
        }
    }
})()

// Render inventory list
var renderInventoryList = (function () {
    var dropdownContEl = document.querySelector(".dropdown-content")
    var dropdownContInHTML = ""
    for (let i = 0; i < products.length; i++) {
        dropdownContInHTML += `
            <div class="dropdown-item">
                <p><a class="products" href="#footer" data-inventory-item="` + i + `">` + products[i].name + `</a></p>
            </div>
        `
    }
    dropdownContEl.innerHTML = dropdownContInHTML
})()

// Fetch the inventory details
function fetchInventoryDetails(index) {
    fetch("https://ebay-com.p.rapidapi.com/products/" + products[index].upc, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": "ebay-com.p.rapidapi.com"
        }
    })
    .then(function (response) {
        return response;
    })
    .then(function (response) {
        //console.log(item)
        if(response.ok) {
            response.json()
            .then(function(item){
                //console.log(item)
                renderItem(item, index)
            })
        } else {
            handleError("Inventory details error: " + response.statusText)
        }
    })
    .catch(function (error) {
        handleError("Inventory details error: " + error.message)
    });
}

// Fetch the inventory offers
function fetchInventoryOffers(index, title) {
    fetch("https://ebay-com.p.rapidapi.com/products/" + products[index].upc + "/offers", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": "ebay-com.p.rapidapi.com"
        }
    })
    .then(function (response) {
        return response;
    })
    .then(function (response) {
        if(response.ok) {
            response.json()
            .then(function(offers){
                //console.log(offers)
                renderOffers(offers, title)
            })
        } else {
            handleError("Inventory offer error: " + response.statusText)
        }
    })
    .catch(function (error) {
        handleError("Inventory offer error: " + error)
    });
}

// Render the item's info on the DOM
function renderItem(item, index) {
    var itemContEl = document.querySelector("#item-cont")
    var content = `
    <div class="columns is-flex is-flex-direction-column is-flex-wrap-wrap is-align-items-center">
        <div class="column">
            <figure class="image is-flex is-align-item-center">
                <a id="main-item-img-link" class="is-flex is-align-items-center p-0" href=` + item.Offers[0].Link + ` target="_blank">
                    <img id="main-item-img" src=""/>
                </a>
            </figure>
        </div>
        <div class="column mt-6">
            <div class="columns is-flex is-flex-wrap-no-wrap" id="item-img-cont"></div>
        </div>
        <div class="column p-6" id="item-info">
            <figure class="is-flex is-align-item-center is-justify-content-center">
                <img id="main-item-img" src="https://i.imgur.com/b96dOB0.gif" style="width: 100px;"/>
            </figure>
        </div>
    </div>
  `
    itemContEl.innerHTML = content

    window.location.href = document.querySelector(".products").getAttribute("href")

    // Render the image alternatives
    renderImages(item.Media.ImageAlternatives)

    
    // Render the smaller image at the bigger image section when clicked
    document.querySelector("#item-img-cont").addEventListener("click", function (event) {
        if (event.target.matches(".item-img")) {
            var imageSRC = event.target.getAttribute("src")
            document.querySelector("#main-item-img").setAttribute("src", imageSRC)
        }
    })

    // The API call allows one call per second
    setTimeout(function(){
        // Fetch the offers available for the product
        fetchInventoryOffers(index, item.Title)
    }, 1000)
}

// Color code if product is in stock or not
function inStock(offerIDEl, inStockEl, isInStock) {
    if(isInStock === "In stock") {
        inStockEl.setAttribute("class", "inStock")
        offerIDEl.setAttribute("class", "inStock")
    } else if(isInStock === "Not in stock") {
        inStockEl.setAttribute("class", "notInStock")
        offerIDEl.setAttribute("class", "notInStock")
    } 
}

// Render the offers
function renderOffers(offers, title) {
    // Render the offer HTML element
    var inStockStatus = offers[0].InStockStatus === "1" ? "In stock" : "Not in stock"
    var itemInfoEl = document.querySelector("#item-info")
    itemInfoEl.innerHTML = `
        <p class="subtitle mt-2 is-flex is-flex-wrap-no-wrap is-justify-content-center is-align-items-center"><span id="offerID">Offers 1/` + offers.length + `</span> </p>
        <h1 class="title mt-5 is-size-5-mobile">
            ` + title + `
        </h1>
        <p class="subtitle">
            Merchant: <span id="merchant">` + offers[0].Merchant + `</span>  (Quality - <span id="quality"> ` + offers[0].Quality + `</span>)
        </p>
        <div class="columns is-flex  is-justify-content-center">
            <div class="column" id="price">Base Price: ` + offers[0].FormattedPrice + `</div>
            <div class="column"><span id="inStock">` + inStockStatus + `</span></div>
        </div>
        <div class="columns is-flex  is-justify-content-space-between">
            <div class="column">
                <span id="p-offer" class="icon is-large is-size-3 icon-nav">
                    <i class="fas fa-arrow-left" aria-hidden="true" style="cursor: pointer"></i>
                </span>
            </div>
            <div class="column">
            </div>
            <div class="column">
                <span id="n-offer" class="icon is-large is-size-3 icon-nav">
                    <i class="fas fa-arrow-right" aria-hidden="true" style="cursor: pointer"></i>
                </span>
            </div>
        </div>
    `

    // Color code in stock or not
    inStock(document.querySelector("#offerID"), document.querySelector("#inStock"), inStockStatus)  
    
    handleOfferNav(offers)
}

// Handle the offer navigation
function handleOfferNav(offers) {
    // Generate an id for the offers
    // This will be used for navigating back and forth the offers
    var offerID = (function(){
        var id = 0
        return {
            previous: function(){
                if(id > 0) {
                    id--
                }
                return id
            },
            next: function(){
                if(id < offers.length-1) {
                    id++
                }
                return id
            }
        }
    })()

    // Get the corresponding DOM elements
    var productLinkEl = document.querySelector("#main-item-img-link")
    var offerIDEl = document.querySelector("#offerID")
    var merchantEl = document.querySelector("#merchant")
    var qualityEl = document.querySelector("#quality")
    var priceEl = document.querySelector("#price")
    var instockEl = document.querySelector("#inStock")
    
    // Update the corresponding info of the offer
    function renderOfferInfo(id) {
        productLinkEl.setAttribute("href", offers[id].Link)
        offerIDEl.textContent = "Offers " + (id + 1) +"/" + offers.length
        merchantEl.textContent = offers[id].Merchant
        qualityEl.textContent = offers[id].Quality
        priceEl.textContent = "Base Price: " + offers[id].FormattedPrice
        
        
        // Color code in stock or not
        var inStockStatus = offers[id].InStockStatus === "1" ? "In stock" : "Not in stock"
        instockEl.textContent = inStockStatus
        inStock(offerIDEl, instockEl, inStockStatus)
    }

    
    function handlePreviousOffer() {
        renderOfferInfo(offerID.previous())
    }
    
    function handleNextOffer() {
        renderOfferInfo(offerID.next())
    }

    var previousOfferEl = document.querySelector("#p-offer")
    previousOfferEl.addEventListener("click", function () {
        handlePreviousOffer()
    })
    var nextOfferEl = document.querySelector("#n-offer")
    nextOfferEl.addEventListener("click", function () {
        handleNextOffer()
    })
}

// Render the images of the item
function renderImages(imageAlternatives) {
    var imageContEl = document.querySelector("#item-img-cont")
    var imageContInHTML = ""

    // Set the main or bigger image to the first image in the imageAlternatives array
    document.querySelector("#main-item-img").setAttribute("src", imageAlternatives[0])

    // Render the smaller images
    for (let i = 0; i < imageAlternatives.length; i++) {
        imageContInHTML += `
        <div class="column is-flex is-justify-content-center">
            <figure class="image other-img is-flex is-align-items-center p-3">
                <img class="item-img" src="` + imageAlternatives[i] + `"/>
            </figure>
        </div>
        `
    }

    imageContEl.innerHTML = imageContInHTML
}

// Handle errors if any
function handleError(err_msg) {
    // Activate the modal 
    document.querySelector("#error-modal").setAttribute("class", "modal is-active")
    
    document.querySelector("#error-message-body").innerHTML = err_msg

    // Close the modal
    document.querySelector("#error-modal-close").addEventListener("click", function(){
        document.querySelector("#error-modal").setAttribute("class", "modal")
    })

    // Render empty item
    document.querySelector("#item-cont").innerHTML = `
        <div class="empty is-flex is-flex-direction-column is-align-items-center is-justify-content-space-evenly">
            <h2 class="is-size-1-desktop is-size-4-mobile">Select an inventory to track</h2>
            <span class="icon is-large is-size-1">
                <i class="fas fa-search" aria-hidden="true"></i>
            </span>
        </div>
    `
}

// When an inventory item is clicked
document.querySelector(".dropdown-content").addEventListener("click", function (event) {
    if (event.target.matches(".dropdown-item p a")) {
        document.querySelector("#item-cont").innerHTML = ""
        fetchInventoryDetails(event.target.dataset.inventoryItem)
        

        // Test
        /* renderItem(inventoryDetails, event.target.dataset.inventoryItem)
        // The API call allows one call per second
        setTimeout(function(){
            // Fetch the offers available for the product
            renderOffers(inventorOffers, inventoryDetails.Title)
            
        }, 1000) */
    }
})