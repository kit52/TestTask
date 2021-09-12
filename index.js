
import * as DB from "./DB.js"
let currentPage = 0;
let arr = [...DB.db];
const color = [];

arr.forEach((item) => {
    color.push(item.eyeColor)
})

const uniqueColor = [...new Set(color)];



const table = document.querySelector('.table');


function renderTable(currentPage) {
    const tbody = document.createElement('tbody');
    let str = "";
    const x = 10 * currentPage
    /* Create dinamyc content for tbody  */
    table.querySelector('tbody').remove()
    for (let i = 0 + x; i <= 9 + x; i++) {
        let row = `<tr>
        <td> ${arr[i].name.firstName}</td> 
        <td>${arr[i].name.lastName}</td>
        <td class = "about ">${arr[i].about}</td>
        <td class = ${arr[i].eyeColor}></td>
    </tr>`
        str = str + row;
    }
    tbody.innerHTML = str;
    table.append(tbody)
}


function renderPagination() {
    /* Create dinamyc paginations */
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


function sortTable(index) {
    const tbody = document.querySelector('tbody');
    function compare(rowA, rowB) {

        const rowDataA = rowA.cells[index].innerHTML; /* get data from collumn[i]*/
        const rowDataB = rowB.cells[index].innerHTML;
        if (rowDataA == "" || rowDataB == "") {
            const colorA = rowA.cells[index].classList.value;
            const colorB = rowB.cells[index].classList.value;
            if (colorA < colorB) return -1;
            else if (colorA > colorB) return 1;
            return 0;
        } else {
            if (rowDataA < rowDataB) return - 1;   /* comparing data from column cells for sorting*/
            else if (rowDataA > rowDataB) return 1;
            return 0;
        }

    }

    const rows = [].slice.call(tbody.rows); /*converting a pseudo array to an array */
    rows.sort(compare) /*Sorting with use our method sort */
    table.removeChild(tbody); /* clear table content */
    for (let i = 0; i < rows.length; i++) {
        tbody.appendChild(rows[i])
    }
    table.appendChild(tbody)
}
function changeSelectColor(select) {
    const selectIndex = select.options.selectedIndex;
    select.style = `background:${select.options[selectIndex].classList.value}`
}

const changeTableContent = (e) => {
    const container = document.querySelector(".container");
    const target = e.target;
    console.log(target.nodeName);
    if (target.nodeName == "TH") {
        sortTable(target.cellIndex)
    } else if (target.nodeName == "IMG") {
        sortTable(target.parentNode.cellIndex)
    } else {
        table.removeEventListener("click", changeTableContent);
        table.classList.add("modify")
        const index = target.parentNode.rowIndex + currentPage * 10 - 1;
        const element = arr[index];
        const id = element.id;

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
            <textarea id = about${id} class = "aboutArea">
                ${element.about}
            </textarea>

        </form>
            <div class = "btn__save"></div>
        `
        const divBody = document.createElement('div')
        divBody.innerHTML = form;
        container.appendChild(divBody)
        const select = document.querySelector(`#select${id}`);
        changeSelectColor(select)
        select.addEventListener('change', () => changeSelectColor(select))
        const save = document.querySelector('.btn__save');
        save.addEventListener("click", (e) => {
            const form = divBody.querySelector('form');
            const firstNameValue = form.querySelector(`#firstName${id}`).value;
            const lastNameValue = form.querySelector(`#lastName${id}`).value;
            const aboutValue = form.querySelector(`#about${id}`).value;
            const indexSelectItem = select.options.selectedIndex;
            const selectItemValue = select.options[indexSelectItem].classList.value;
            if (firstNameValue == element.name.firstName &&
                lastNameValue == element.name.lastName &&
                aboutValue == element.about &&
                selectItemValue == element.eyeColor
            ) return
            else {
                arr[index] = {
                    ...arr[index],
                    name: {
                        firstName: firstNameValue,
                        lastName: lastNameValue
                    },
                    about: aboutValue,
                    eyeColor: selectItemValue
                }
            }
            container.innerHTML = ''
            renderTable(currentPage)
            table.addEventListener("click", changeTableContent)
            table.classList.remove("modify")

        })

    }


}
table.addEventListener('click', changeTableContent)

renderTable(currentPage)
renderPagination()
