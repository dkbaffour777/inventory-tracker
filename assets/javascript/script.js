var API_KEY = "b133c6b3f1msh0e46e9a17395421p1ea5bajsnb129cea2451d" // insert your API key in the double quotes

var inventoryOffers = null

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
        name: " EVGA 10G-P5-3897-KR GeForce RTX 3080 FTW3 ULTRA GAMING, 10GB GDDR6X, iCX3 Technology, ARGB LED, Metal Backplate",
        upc: "843368067243"
    },
    {
        name: "CORSAIR Carbide 200R Compact ATX Case, CC-9011023-WW",
        upc: "843591033251"
    },
    {
        name: " PICTEK Wireless Gaming Mouse, Silent Click, Side Buttons, 2.4G Cordless Computer PC Gaming Mouse Laptop USB Mice,",
        upc: "635648731346"
    },
    {
        name:"MSI Gaming AMD Ryzen X370 DDR4 VR Ready HDMI USB 3 SLI CFX ATX Motherboard",
        upc: "824142145272"
    },
    {
        name: "AMD Processor 3.2GHz Dual Core Socket FM2 A4-Series ",
        upc: "730143304610"
    },
    {
        name: "Noctua NF-A14 PWM, 4-Pin Premium Quiet Cooling Fan (140mm, Brown)",
        upc: "897337035856"
    },
    {
        name: "Corsair TR3X6G1600C8D Dominator 6 GB 3 x 2 GB PC3-12800 1600MHz 240-Pin DDR3 Core i7 Memory Kit",
        upc:"843591003476"
    },
    
    // Follow the object format and add more items
    // The dropdown will be updated by javascript with the new list of items
]

// Render inventory list
var renderInventoryList = (function () {
    var dropdownContEl = document.querySelector(".dropdown-content")
    var dropdownContInHTML = ""
    for (let i = 0; i < products.length; i++) {
        dropdownContInHTML += `
            <div class="dropdown-item">
                <p data-inventory-item="` + i + `">` + products[i].name + `</p>
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
                console.log(item)
                renderItem(item)
                // The API call allows one call per second
                setTimeout(function(){
                    fetchInventoryOffers(index)
                }, 1000)
            })
        } else {
            handleError(response.statusText)
        }
    })
    .catch(function (error) {
        console.log(error.message)
    });
}

// Fetch the inventory offers
function fetchInventoryOffers(index) {
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
                console.log(offers)
                renderOffers(offers)
            })
        } else {
            handleError(response.statusText)
        }
    })
    .catch(function (error) {
        console.log(error.message)
    });
}

// Render the item's info on the DOM
function renderItem(item) {
    var itemContEl = document.querySelector("#item-cont")
    var inStockStatus = item.Offers[0].InStockStatus === "0" ? "No" : "Yes"
    var content = `
    <div class="columns is-flex is-flex-direction-column is-flex-wrap-wrap is-align-items-center">
        <div class="column">
            <figure class="image main-img is-flex is-align-item-center">
                <a id="main-item-img-link" class="is-flex is-align-items-center p-0" href=` + item.Offers[0].Link + ` target="_blank">
                    <img id="main-item-img" src=""/>
                </a>
            </figure>
        </div>
        <div class="column mt-6">
            <div class="columns is-flex is-flex-wrap-no-wrap" id="item-img-cont"></div>
        </div>
        <div class="column item-info">
            <h1 class="title mt-5 is-size-5-mobile">
                ` + item.Title + `
            </h1>
            <p class="subtitle">
                Merchant: <span id="merchant">` + item.Offers[0].Merchant + `</span>(Quality - <span id="quality"> ` + item.Offers[0].Quality + `</span>)
            </p>
            <div class="columns is-flex  is-justify-content-center">
                <div class="column" id="price">Base Price: ` + item.FormattedBestPrice + `</div>
                <div class="column" id="instock">In stock: ` + inStockStatus + `</div>
            </div>
            <p class="subtitle mt-2"> Offers </p>
            <div class="is-flex  is-justify-content-space-evenly">
                <span class="icon is-large is-size-3">
                    <i id="previous-offer" class="fas fa-arrow-left" aria-hidden="true" style="cursor: pointer"></i>
                </span>
                <span class="icon is-large is-size-3">
                    <i id="next-offer" class="fas fa-arrow-right" aria-hidden="true" style="cursor: pointer"></i>
                </span>
            </div>
        </div>
    </div>
  `
    itemContEl.innerHTML = content

    renderImages(item.Media.ImageAlternatives)

    // Render the smaller image at the bigger image section when clicked
    document.querySelector("#item-img-cont").addEventListener("click", function (event) {
        if (event.target.matches(".item-img")) {
            var imageSRC = event.target.getAttribute("src")
            document.querySelector("#main-item-img").setAttribute("src", imageSRC)
        }
    })
}

// Render the offers
function renderOffers(offers) {
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
    var productLink = document.querySelector("#main-item-img-link")
    var merchant = document.querySelector("#merchant")
    var quality = document.querySelector("#quality")
    var price = document.querySelector("#price")
    var instock = document.querySelector("#instock")

    // Update the corresponding info of the offer
    function renderInfo(id) {
        productLink.setAttribute("href", offers[id].Link)
        merchant.textContent = offers[id].Merchant
        quality.textContent = offers[id].Quality
        price.textContent = "Base Price: " + offers[id].FormattedPrice
    
        var inStockStatus = offers[id].InStockStatus === "1" ? "Yes" : "No"
        instock.textContent = "In stock: " + inStockStatus
    }

    // Navigate to previous offer
    document.querySelector("#previous-offer").addEventListener("click", function(){
        renderInfo(offerID.previous())
    })
    
    // Navigate to next offer
    document.querySelector("#next-offer").addEventListener("click", function(){
        renderInfo(offerID.next())
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
    document.querySelector("#modal").setAttribute("class", "modal is-active")
    
    document.querySelector(".message-body").innerHTML = err_msg

    // Close the modal
    document.querySelector("#modal-close").addEventListener("click", function(){
        document.querySelector("#modal").setAttribute("class", "modal")
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
    if (event.target.matches(".dropdown-item p")) {
        document.querySelector("#item-cont").innerHTML = ""
        fetchInventoryDetails(event.target.dataset.inventoryItem)
    }
})