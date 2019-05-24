//drag


window.absolute = null;
window.highlight = false;
window.last_mouse_over_element = null;

function mouseover_listener(ev) {
    //window.above = ev;
    console.log('mousemove');
    console.log(absolute);
    if (window.absolute) {
        window.last_event = ev;
        //console.log(ev.target);
        //console.log('+++++++++++');
        //console.log(window.last_el);
        if (ev.target.closest('.task-block')) {
            console.log('gon');
            console.log(window.last_mouse_over_element);
            if (window.last_mouse_over_element !== ev.target.closest('.task-block')) {
                removeHighlight();
                window.highlight = true;
                window.last_mouse_over_element = ev.target.closest('.task-block');
            }


        } else if (ev.target.closest('.card')) {
            console.log('gan');
            console.log(window.last_mouse_over_element);

            let card = ev.target.closest('.card');
            if (window.last_mouse_over_element !== card) {
                removeHighlight();

                window.highlight = true;
                window.last_mouse_over_element = card;
            }
        }
    }
}


function mousemove_listener(event) {
    if (window.absolute) {
        let eventDoc, doc, body;


        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        initialX = event.pageX;
        initialY = event.pageY;


        window.absolute.style.top = `${event.pageY - yOff}px`;
        window.absolute.style.left = `${event.pageX - xOff}px`;


        if (window.last_highlight) {
            if (initialY < last_highlight.offsetTop || initialY > last_highlight.offsetTop + last_highlight.offsetHeight ||
                initialX < last_highlight.offsetLeft || initialX > last_highlight.offsetLeft + last_highlight.offsetWidth
            ) {
                removeHighlight();
                window.last_mouse_over_element = null;
            }
        }
        if (window.highlight) {
            window.highlight = false;
            addHighlight();


        }


    }
}

function removeHighlight() {
    if (window.last_highlight) {
        if (window.last_highlight.element.classList.contains('removable')) {
            removeElement(window.last_highlight.element);
        } else {
            window.last_highlight.element.style.height = '0';
            window.last_highlight.element.classList.remove('norm-card');
        }
    }
    window.last_highlight = null;
}

function addHighlight() {
    window.last_highlight = {};
    if (window.last_mouse_over_element.classList.contains('card')) {


        let cards_list = window.last_mouse_over_element.getElementsByClassName('cards_list')[0];
        cards_list.innerHTML += window.strings.removable_highlight.t();
        cards_list.getElementsByClassName('removable')[0].style.height = `${window.absolute.offsetHeight - 20}px`;
        window.last_highlight.element = cards_list.getElementsByClassName('removable')[0];


    } else {
        console.log('goes_here');
        let place_to_insert = window.last_mouse_over_element.getElementsByClassName('place-to-insert')[0];
        place_to_insert.classList.add('norm-card');
        place_to_insert.style.height = `${window.absolute.offsetHeight - 20}px`;
        window.last_highlight.element = place_to_insert;
        //offsetTop = window.last_mouse_over_element.offsetTop;
        //offsetHeight = window.last_mouse_over_element.offsetHeight;
    }


    window.last_highlight.offsetTop = window.last_mouse_over_element.offsetTop;
    window.last_highlight.offsetHeight = window.last_mouse_over_element.offsetHeight;
    window.last_highlight.offsetLeft = window.last_mouse_over_element.offsetLeft;
    window.last_highlight.offsetWidth = window.last_mouse_over_element.offsetWidth;

}


let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let xOff = 0;
let yOff = 0;
let time_out = false;

function selectText(node) {


    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
}

window.timer_time_out = null;

function dragStart(e) {
    if (e.button === 0 && e.ctrlKey) {
        window.time_out = false;
        if (window.timer_time_out) {
            clearTimeout(window.timer_time_out);
        }
        window.timer_time_out = setTimeout(function () {
            window.time_out = true;
        }, 400);
        if (e.target.classList.contains('selectable-all')) {
            e.target.classList.remove('selectable-all');
        }
        console.log('opa');
        console.log(e);
        console.log('opa');
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        window.touched_element = e.target.closest('.task-block');
        console.log(window.touched_element);
        window.touch_card = e.target;
        //window.absolute = e.target;

        e.target.closest('.task-block').removeAttribute('onmouseover');
        e.target.closest('.task-block').removeEventListener('mouseover', mouseover_listener);

        let clone_node = e.target.cloneNode(true);
        clone_node.classList.add('absolute');

        clone_node.removeAttribute('onmouseover');
        clone_node.removeAttribute('onmousedown');
        clone_node.style.height = `${clone_node.offsetHeight - 20}px`;
        clone_node.style.width = `${e.target.offsetWidth - 20}px`;
        clone_node.classList.add('nice-font');
        window.event = null;
        xOff = e.offsetX;
        yOff = e.offsetY;

        document.body.appendChild(clone_node);

        clone_node.style.left = `${initialX - xOff}px`;
        clone_node.style.top = `${initialY - yOff}px`;
        window.absolute = clone_node;

        //clone_node.classList.add('absolute');
        //document.appendChild(clone_node);
        e.target.classList.add('hide');

        active = true;

    } else {

        if (!e.target.classList.contains('selectable-all')) {
            e.target.classList.add('selectable-all');
        } else {
            //e.target.classList.remove('selectable-all');
        }
        selectText(e.target);

    }

}


function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos - xOff + "px, " + yPos - yOff + "px, 0)";
}


//drag

function setBackground(image, xCenter, yCenter) {
    document.body.style.background = `url('${image}') ${xCenter} ${yCenter} no-repeat fixed`;
}

function removeElement(elementId) {
    // Removes an element from the document
    let element = elementId;
    if (typeof elementId !== typeof (null)) {
        element = document.getElementById(elementId);
    }
    element.parentNode.removeChild(element);
}

function closeColumn(ev) {

    removeElement(ev.closest('.card'));

}

function closeTaskInput(ev) {
    let card_container = ev.closest('.card-container');
    removeElement(ev.closest('.input_block'));
    card_container.innerHTML += window.strings.card_container_body_delete.t();
}

function saveTaskName(ev) {
    console.log(ev);
    if (!ev.shiftKey && ev.keyCode === 13 || !ev.type.localeCompare('click')) {


        let card = ev.target.closest('.card');
        let input = card.getElementsByClassName('textarea')[0];
        let title = input.value;

        title.replace(/^\s*\n/gm, "");
        if (isStringEmpty(title)) {
            title = "";
            console.log('go');
            input.value = "";
        }
        console.log(title);
        if (title !== "") {
            let id = kanbanManager.saveColumnCard(title, card.id);
            let card_container = ev.target.closest('.card-container');
            let input_block = card_container.getElementsByClassName('input_block')[0];
            removeElement(input_block);
            let cards_list = card_container.getElementsByClassName('cards_list')[0];
            cards_list.classList.add('card-list-normal');
            cards_list.classList.remove('card-list-with-input');
            cards_list.innerHTML += window.strings.card_body.t(id, title);

            card_container.innerHTML += window.strings.one_more_card_part.t();
        } else {
            alert('Заполните поле');
        }
    }
}


function openTaskInput(ev) {
    let card_container = ev.closest('.card-container');
    removeElement(ev);
    let cards_list = card_container.getElementsByClassName('cards_list')[0];
    cards_list.classList.add('card-list-with-input');
    cards_list.classList.remove('card-list-normal');
    card_container.innerHTML += window.strings.card_container_body_input_state.t();
}

function isStringEmpty(str) {
    return (!str || /^\s*$/.test(str));
}

function saveColumnName(ev) {
    if (!ev.shiftKey && ev.keyCode === 13 || !ev.type.localeCompare('click')) {
        let card = ev.target.closest('.card');

        let input = card.getElementsByClassName('textarea')[0];
        let title = input.value;
        console.log(title);
        title.replace(/^\s*\n/gm, "");
        if (isStringEmpty(title)) {
            title = "";
            console.log('go');
            input.value = "";
        }
        if (title !== "") {
            ev.target.closest('.card').id = kanbanManager.saveColumn(title);
            card.getElementsByClassName('card-container')[0].innerHTML = window.strings.column_name.t(title);
        } else {
            alert("Заполните поле")
        }
    }
}

function addElement(parentId, elementTag, elementId, html) {
    // Adds an element to the document
    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    newElement.innerHTML = html;
    p.appendChild(newElement);
}

class KanbanManager {
    constructor(kanbanTasks = []) {
        if (kanbanTasks.length === 0) {
            this.columns = 0;
            this.addColumn();
            this.columnArray = [];
            this.cardsArray = [];
            this.columnsData = {};
        }
    }

    writeLocal() {
        console.log('writelocal*******');
        window.localStorage.setItem('data', JSON.stringify({
            columns: this.columns,
            columnArray: this.columnArray,
            cardsArray: this.cardsArray,
            columnsData: this.columnsData
        }))
    }

    saveColumnCard(name, columnId) {
        this.cardsArray.push(name);
        let cardId = this.cardsArray.length - 1;
        let num = parseInt(columnId.split('_')[1]);

        if (!this.columnsData[num]) this.columnsData[num] = [];
        this.columnsData[num].push(cardId);
        this.writeLocal();
        return cardId;
    }

    moveColumnCard(id, oldColumnId, newColumnId, newPosition) {
        this.removeColumnCard(id, oldColumnId);
        this.appendColumnCard(id, newColumnId, newPosition);

        this.writeLocal();
    }

    removeColumnCard(id, columnId) {
        let num = parseInt(columnId.split('_')[1]);
        let card_id = parseInt(id.split('_')[1]);
        let index = this.columnsData[num].indexOf(card_id);
        if (!this.columnsData[num]) this.columnsData[num] = [];
        this.columnsData[num].splice(index, 1);
    }

    appendColumnCard(id, columnId, position) {
        let num = parseInt(columnId.split('_')[1]);
        let card_id = parseInt(id.split('_')[1]);
        let index = position;
        if (!this.columnsData[num]) this.columnsData[num] = [];
        this.columnsData[num].splice(index, 0, card_id);

    }

    saveColumn(name) {
        this.columnArray.push(name);
        this.writeLocal();
        return `column_${this.columnArray.length}`;
    }

    addColumn() {
        let columnButtonElement = window.strings.column_element.t();
        document.getElementById('columnBox').innerHTML += columnButtonElement;
        let column_element = document.getElementsByClassName("column");
        column_element = column_element[column_element.length - 1];
        /**TODO исправить не очень хорошее решение... **/
        column_element.addEventListener('click', () => {
            //console.log(ev);
            removeElement(column_element.getElementsByClassName('grey-text-color')[0]);
            let cardContainer = column_element.getElementsByClassName('card-container')[0];
            cardContainer.innerHTML += window.strings.card_container_body.t();
            this.addColumn();
        }, {once: true});


        console.log(this.columns)
    }
}


let variables = {
    backgroundPath: 'background.png',
    addCard: 'Добавить ещё одну карточку'

};

function lock_right_click(e) {
    e.preventDefault();
}

function autoExpandTextArea() {
    document.addEventListener('input', function (event) {
        if (event.target.tagName.toLowerCase() !== 'textarea') return;
        autoExpand(event.target);
    }, false);
}

function autoExpand(field) {

    field.style.height = 'inherit';


    let computed = window.getComputedStyle(field);


    let height = parseInt(computed.getPropertyValue('border-top-width'), 10)
        + parseInt(computed.getPropertyValue('padding-top'), 10)
        + field.scrollHeight
        + parseInt(computed.getPropertyValue('padding-bottom'), 10)
        + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    field.style.height = height + 'px';
}

function initPage() {
    setBackground(variables.backgroundPath, '20%', '60%');
    autoExpandTextArea();
    window.kanbanManager = new KanbanManager();
    document.onmousemove = mousemove_listener;
    document.onmouseup = up;

}

window.onload = function () {
    initPage();

};

function up(ev) {
    //console.log(ev);


    if (window.absolute) {
        window.absolute.classList.add('absolute-hide');
        console.log('up');
        console.log(window.touched_element);
        document.body.style.pointerEvents = "none";
        let highlight_cards = document.getElementsByClassName('norm-card');
        console.log(highlight_cards);
        if (highlight_cards.length !== 0 && window.time_out) {
            //console.log(window.touched_element.id);
            let touched_element = document.getElementById(window.touched_element.id);
            let clone_node = touched_element.cloneNode(true);
            let oldColumnId = touched_element.closest('.card').id;
            removeElement(touched_element);
            let x_column = highlight_cards[0].closest('.card');
            let list_possible_highlights = x_column.getElementsByClassName('place-to-insert');
            let count = 0;
            let position = -1;
            for (let element of list_possible_highlights) {
                if (element !== highlight_cards[0]) {
                    count += 1;
                } else {
                    position = count;
                    break;
                }
            }
            let card_list = x_column.getElementsByClassName('cards_list')[0];
            clone_node.getElementsByClassName('white-card')[0].classList.remove('hide');
            clone_node.setAttribute('onmouseover', "mouseover_listener(event)");
            clone_node.addEventListener('mouseover', mouseover_listener);
            if (position === -1) {
                console.log('append');

                card_list.appendChild(clone_node);
                kanbanManager.moveColumnCard(clone_node.id, oldColumnId, x_column.id, count + 1);
            } else {
                let x_task_blocks = x_column.getElementsByClassName('task-block');
                card_list.insertBefore(clone_node, x_task_blocks[position]);
                kanbanManager.moveColumnCard(clone_node.id, oldColumnId, x_column.id, position);
            }


        } else {

            //let white_card = window.touched_element.getElementsByClassName('white-card')[0];
            //console.log(window.touched_element.getElementsByClassName('white-card'));
            //console.log('white card');
            //console.log(JSON.stringify(white_card));
            document.getElementById(window.touched_element.id).getElementsByClassName('white-card')[0].classList.remove('hide'); //это из-за веселого бага)))
            document.getElementById(window.touched_element.id).setAttribute('onmouseover', "mouseover_listener(event)");
            document.getElementById(window.touched_element.id).addEventListener('mouseover', mouseover_listener);
            window.touch_card.classList.remove('hide');
            window.touch_card.classList.remove('hide');


        }
        removeHighlight();
        let absolute = window.absolute;
        window.absolute = null;
        setTimeout(function () {

            //removeElement(pipa);
            removeElement(absolute);
            ///window.touched_element.id
            window.last_mouse_over_element = null;
            window.touch_card = null;
            window.touched_element = null;
            window.absolute = null;
            document.body.style.pointerEvents = "auto";
        }, 200);


    }
}