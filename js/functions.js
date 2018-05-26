//VARIABLES
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

var map;
var markers = [];

//FUNCTIONS
function initMap() {
    map = new google.maps.Map(document.getElementById('map'));

    map.addListener('click', function (e) {
        createMarker("", e.latLng.lat(), e.latLng.lng());
    });

    loadDefault();
}

function createMarker(name, lat, lng) {
    var id = getNextMarkerId();

    var marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        label: id,
        map: map
    });
    //map.panTo(latLng);

    markers.push(marker);

    var html = "";
    html += '<tr>';
    html += '   <th id="row' + markers.length + '" scope="row">' + markers.length + '</th>';
    html += '   <td>' + id + '</td>';
    html += '   <td><input type="text" class="form-control" maxlen="20" value="' + name + '" /></td>';
    html += '   <td>' + lat + '</td>';
    html += '   <td>' + lng + '</td>';
    html += '   <td><button class="btn btn-danger remove" tabindex="-1">Remove</button></td>';
    html += '</tr>';
    $("tbody").append(html);
}

function getNextMarkerId() {
    return labels[labelIndex++ % labels.length];
}

function loadDefault() {
    $.ajax({
        type: "GET",
        url: "citydata/CityCoordinates.csv",
        dataType: "text",
        success: function (data) { processData(data); }
    });
}

function processData(data) {
    removeAllMarkers();

    var allTextLines = data.split(/\r\n|\n/);

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');

        createMarker(data[1], parseFloat(data[2]), parseFloat(data[3]));
    }

    map.setCenter({ lat: 36, lng: 69 })
    map.setZoom(3);
}

function renumberRows() {
    var number = 1;

    $('tbody').children('tr').each(function () {
        var th = $(this).children('th');
        $(th).attr('id', 'row' + number);
        $(th).html(number);

        number++;
    });
}

function removeMarker(rowId) {
    var id = rowId.substring(3);
    var marker = markers[id - 1];
    marker.setMap(null);
    markers.splice(id - 1, 1);
}

function removeAllMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    labelIndex = 0;

    $('tbody').empty();
}
