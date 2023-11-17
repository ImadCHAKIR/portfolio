document.addEventListener("DOMContentLoaded", function () {
    fetch("./assets/data.json")
    .then(response => response.json())
    .then(data => {
        fillData("about__text",data.about)

        m = ``
        for (let skill of data.skills){
            console.log(skill)
            m = m + `<div class="skills__data"><div class="skills__names"><i class="bx bxs-paint skills__icon"></i><span class="skills__name">${skill}</span></div><div class="bar"></div></div>`
        }
                    
        fillData("skills__list", m)
            
    })
    .catch(error => {
        console.error("Error fetching JSON:", error);
    });
});

function fillData(id,content){
    document.getElementById(id).innerHTML = content;
}

