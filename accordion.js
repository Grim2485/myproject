const accordionItems = document.querySelectorAll(".accordionItem")
        accordionItems.forEach(function (accordionItem) {
            // 載入
            if (accordionItem.classList.contains("show")) {
                accordionItem.children[1].style.maxHeight = "500px"
                accordionItem.children[1].style.padding = "32px 16px"

            } else {
                accordionItem.children[1].style.maxHeight = "0"
                accordionItem.children[1].style.padding = "0 16px"
            }
            // 點擊監聽
            accordionItem.children[0].addEventListener("click", function () {
                if (accordionItem.classList.contains("show")) {
                    // 關閉
                    accordionItem.classList.toggle("show")
                    accordionItem.children[1].style.maxHeight = "0"
                    accordionItem.children[1].style.padding = "0 16px"

                } else {
                    // 把其他show關掉
                    const showItem = accordionItem.parentElement.querySelector(".show")
                    if (showItem) {
                        showItem.classList.toggle("show")
                        showItem.children[1].style.maxHeight = "0"
                        showItem.children[1].style.padding = "0 16px"
                    }
                    
                    // 打開
                    accordionItem.classList.toggle("show")
                    accordionItem.children[1].style.maxHeight = "500px"
                    accordionItem.children[1].style.padding = "32px 16px"
                }


            })
        })