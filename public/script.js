function addNewTask(hash){
    fetch('http://localhost:8080/add/' + hash );
}

async function getStat(){
    const result = await  fetch('http://localhost:8080/stat' );
    const data = await result.json();
    return data;
}

function rebuildTable(data){
    const tableBody = document.getElementById('table-body');

    while ( tableBody.lastChild)
        tableBody.removeChild(tableBody.lastChild);

    data.forEach( row => {
        const tr = document.createElement('tr');
        Object.entries(row).forEach( ([key, value ]) => {
            const td = document.createElement('td');
            if(value !== null && value.length !== 0){
                td.append(document.createTextNode(value))
            }else{
                td.append(document.createTextNode('-'))
            }
            tr.append(td);
        })
        tableBody.append(tr);
    })
}

const form = document.getElementById('add-job');
const input = document.getElementById('hash-input');

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    addNewTask(input.value);
})

setInterval( async () => {
    const data = await getStat();
    console.log(data);
    rebuildTable(data);
},1000)





