        const backdrop = document.querySelector(".backdrop")
        const hb = document.querySelector(".hb")
        backdrop.addEventListener("click", function () {
            
            
            hb.children[0].checked = false;
        })
        hb.addEventListener("click", function () {
            console.log(this.children);
            if (this.children[0].checked) {
                console.log(this.children[1].classList);
                
                this.children[1].classList.add("animation", "hbBar1GoAnimation .5s forwards")
            }
            
            
        })

