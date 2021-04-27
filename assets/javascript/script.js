var API_KEY = "" // insert your API key in the double quotes

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
                renderItem(item)
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
                inventoryOffers = offers
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
                <a class="p-0" href=` + item.Offers[0].Link + ` target="_blank">
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
                Merchant: ` + item.Offers[0].Merchant + `(Quality - New)
            </p>
            <div class="columns is-flex  is-justify-content-center">
                <div class="column" id="price">Base Price: ` + item.FormattedBestPrice + `</div>
                <div class="column">In stock: ` + inStockStatus + `</div>
            </div>
            <div class="is-flex  is-justify-content-center">
                <span class="icon is-large is-size-3">
                    <i id="previous-offer" class="fas fa-arrow-left" aria-hidden="true"></i>
                </span>
                <span class="icon is-large is-size-3">
                    <i id="next-offer" class="fas fa-arrow-right" aria-hidden="true"></i>
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