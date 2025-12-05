let cartIcon = document.querySelector(".cartIcon")
let cartNumber = cartIcon.querySelector(".cartNumber")

let localStorageCartData = JSON.parse(localStorage.getItem("cartData")) || [];

// 總商品數量
let totalGoodsQuantity = 0

localStorageCartData.map(function (item) {
   totalGoodsQuantity+= item.goodsQuantity
    
})

if (localStorageCartData.length!==0) {
    cartNumber.classList.add("show")
    cartNumber.innerHTML= totalGoodsQuantity
}