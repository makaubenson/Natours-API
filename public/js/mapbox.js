/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoibWFrYXViZW5zb24iLCJhIjoiY2xhZHM4MWF0MGxnajNwb3kydnl5bTg5MyJ9.-IrnMRVYrDm4bxTc5KBawA';


var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/makaubenson/cladt725c000d14pd5z1t1gf6',
  scrollZoom: false
//   center:[-188.113491,34.111745],
//   zoom:10,
//   interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    //Create Marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add Marker
    new mapboxgl.Marker({
        element: el,
        anchor:'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    //Add Popup
    new mapboxgl.Popup({
        offset: 30
    }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);

    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top:200,
        bottom:150,
        left:100,
        right:100
    }
   
});