function initMap() {
    var basel = { lat: 47.558588, lng: 7.588966 };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: basel
    });
    
    map.addListener('click', function (e) {
        placeMarkerAndPanTo(e.latLng, map);
    });

    var marker = new google.maps.Marker({
        position: basel,
        map: map
    });
    marker.setLabel("Basel");
    saveMarker(marker);

    var marker = new google.maps.Marker({
        position: { lat: 49, lng: 10 },
        map: map
    });
    marker.setLabel("Basel 2");
    saveMarker(marker);
}

function placeMarkerAndPanTo(latLng, map) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
    //map.panTo(latLng);
    saveMarker(marker);
}

function saveMarker(marker) {
    if (marker != null) {
        var count = parseInt($("#markers").attr("count"));
        count = count + 1;

        var lat = marker.getPosition().lat().toString();
        var lng = marker.getPosition().lng().toString();
        $("#markers").append("<marker lat=\"" + lat + "\" lng=\"" + lng + "\" />");

        var name = marker.getLabel();
        if(name == null) {
            name = "";
        }
        $("tbody").append('<tr><th scope="row">' + count + '</th><td>' + name + '</td><td>' + lat + '</td><td>' + lng + '</td></tr>');

        $("#markers").attr("count", count);
    }
}