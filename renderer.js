$("#closeButton").on('click', () => {
    window.electron.sendClose();  
})

document.addEventListener("DOMContentLoaded", function () {
    (async () => {
        // const response = await window.electron.loadData();
        // console.log("in renderer: " + response);  
        // createTable(response);
        initSpotify("", "");
    })();
});

function createTable(data) {
    var table = document.getElementById('table');
    for (var i = 0; i < data.length; i++){
        var tr = document.createElement('tr');   

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');

        var text1 = document.createTextNode(data[i].id);
        var text2 = document.createTextNode(data[i].name);

        td1.appendChild(text1);
        td2.appendChild(text2);
        tr.appendChild(td1);
        tr.appendChild(td2);

        table.appendChild(tr);
    }
    document.body.appendChild(table);
}
