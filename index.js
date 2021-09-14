
import * as DB from "./DB.js"
let currentPage = 0;
let arr = [...DB.db];
const color = [];
let sortDirection = false;
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector('#lastName');
const about = document.querySelector("#about");
const eyeColor = document.querySelector("#eyeColor");
/* Create array unique color from get data */
arr.forEach((item) => {
    color.push(item.eyeColor)
})
const uniqueColor = [...new Set(color)];
const table = document.querySelector('.table');

/* func wrapper for func show/hide collumn */
function collumnObserver() {
    const checkbox = document.querySelector(".tableSettings").querySelectorAll("input");
    checkbox.forEach((item) => {
        item.addEventListener('change', () => {
            const collumnClass = item.dataset.collumnClass;
            document.querySelectorAll(`.${collumnClass}`).forEach(i => i.classList.toggle("hide"))
        })
    })
}

/* func for colouring selected item */
function changeSelectColor(select) {
    const selectIndex = select.options.selectedIndex;
    select.style = `background:${select.options[selectIndex].classList.value}`
}
/* func for colouring sorted collumn title */
function changeSelectedCollumnColor(i) {
    document.querySelectorAll("th").forEach(item => item.classList.remove("bold"))
    i.classList.add("bold");
}

/* a function for rendering content in a table according to the page and saving sorting by the selected column */
function renderTable(currentPage) {
    const tbody = document.createElement('tbody');
    let str = "";
    const x = 10 * currentPage
    /* Create dinamyc content for tbody  */
    table.querySelector('tbody').remove()
    for (let i = 0 + x; i <= 9 + x; i++) {
        let row = `<tr key = ${arr[i].id}>
            <td class = "col-1 ${!firstName.checked ? "hide" : ""}"> ${arr[i].name.firstName}</td>
            <td class = "col-2 ${!lastName.checked ? "hide" : ""}">${arr[i].name.lastName}</td>
            <td class = "about col-3 ${!about.checked ? "hide" : ""}">${arr[i].about}</td>
            <td class = "col-4   ${arr[i].eyeColor} ${!eyeColor.checked ? "hide" : ""}"></td>
        </tr>`
        str = str + row;
    }
    tbody.innerHTML = str;
    table.append(tbody)
}

/*function for create  paginations on page */
function renderPagination() {
    const paginationsDiv = document.createElement('div');
    const counterPages = arr.length / 10;
    let pages = "";

    for (let i = 1; i <= counterPages; i++) {
        let span = `<span ${i == currentPage + 1 ? 'class = "pageNumber active"' : "class = pageNumber"}>${i}</span>`
        pages = pages + span
    }
    paginationsDiv.innerHTML = pages;
    const paginations = document.querySelector(".paginations").appendChild(paginationsDiv);

    paginations.addEventListener("click", (e) => {
        if (e.target.classList == "pageNumber") {
            document.querySelectorAll(".pageNumber").forEach(item => item.classList.remove('active'))
            e.target.classList.add('active')
            currentPage = e.target.innerHTML - 1;
            renderTable(e.target.innerHTML - 1)
        }
    })
}

/*Function for sorting table row A-Z Z-A*/
function sortTable(index) {
    function sortData(a, b) {
        switch (index) {
            case 0:
                if (a.name.firstName < b.name.firstName) return -1;
                else if (a.name.firstName > b.name.firstName) return 1;
                return 0;
            case 1:
                if (a.name.lastName < b.name.lastName) return -1;
                else if (a.name.lastName > b.name.lastName) return 1;
                return 0;
            case 2:
                if (a.about < b.about) return -1;
                else if (a.about > b.about) return 1;
                return 0;
            case 3:
                if (a.eyeColor < b.eyeColor) return -1;
                else if (a.eyeColor > b.eyeColor) return 1;
                return 0;
            default:
                break;
        }
    }
    if (sortDirection) {
        arr.sort(sortData).reverse()
        sortDirection = !sortDirection
    } else {
        arr.sort(sortData)
        sortDirection = !sortDirection
    }
    renderTable(currentPage)
}



/* func handler for all click by table */
const tableClickHandler = (e) => {
    /* handler for click on header table */
    const container = document.querySelector(".container");
    const target = e.target;
    if (target.nodeName == "TH") {
        changeSelectedCollumnColor(target)
        sortTable(target.cellIndex)
    } else if (target.nodeName == "IMG") {
        changeSelectedCollumnColor(target.parentNode)
        sortTable(target.parentNode.cellIndex)
    } else {
        /* handler click by content row*/
        table.removeEventListener("click", tableClickHandler);
        table.classList.add("modify");
        const id = target.parentNode.getAttribute("key");
        let index = arr.findIndex(i => i.id == id);
        const element = arr[index];

        const optionColor = uniqueColor.map((item) => {
            return `<option style=background:${item}  ${item == element.eyeColor ? "selected" : ""} class = ${item}>
                    </option>`
        });

        const form = `
        <form>
            <input id = firstName${id} value = ${element.name.firstName} class = "firstName">
            <input id = lastName${id} value = ${element.name.lastName} class = "lastName">
            <select id = select${id}>
                ${optionColor}
            </select>
            <textarea id = about${id} class = "aboutArea">${element.about}</textarea>

        </form>
            <div class = "btn__save"></div>
        `
        const divBody = document.createElement('div');
        divBody.innerHTML = form;
        container.appendChild(divBody);
        const select = document.querySelector(`#select${id}`);
        changeSelectColor(select);
        select.addEventListener('change', () => changeSelectColor(select))
        const save = document.querySelector('.btn__save');
        /* Handler saving data after changing */
        save.addEventListener("click", (e) => {
            const form = divBody.querySelector('form');
            const firstNameValue = form.querySelector(`#firstName${id}`).value;
            const lastNameValue = form.querySelector(`#lastName${id}`).value;
            const aboutValue = form.querySelector(`#about${id}`).value;
            const selectItemValue = select.options[select.options.selectedIndex].classList.value;

            if (firstNameValue != element.name.firstName || lastNameValue != element.name.lastName ||
                aboutValue != element.about || selectItemValue != element.eyeColor) {
                arr[index] = {
                    ...arr[index],
                    name: {
                        firstName: firstNameValue,
                        lastName: lastNameValue
                    },
                    about: aboutValue,
                    eyeColor: selectItemValue
                }
                container.innerHTML = ''
                renderTable(currentPage)
            } else {
                container.innerHTML = ''
            }
            table.addEventListener("click", tableClickHandler)
            table.classList.remove("modify")
        })
    }
}




table.addEventListener('click', tableClickHandler)
renderTable(currentPage)
collumnObserver()
renderPagination()
