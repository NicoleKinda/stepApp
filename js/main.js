var firebaseConfig = {
	apiKey: "AIzaSyCcFouJJEZu5zXBFRENlaHX3Sy70dtYbfU",
	authDomain: "stepapp-270e8.firebaseapp.com",
	projectId: "stepapp-270e8",
	storageBucket: "stepapp-270e8.appspot.com",
	messagingSenderId: "735809420642",
	appId: "1:735809420642:web:6ca5eab3097eaa2eb2403b",
	measurementId: "G-8ZPR5280QR"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let db = firebase.firestore();
let storage = firebase.storage();
let collectionArray = [];

(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

})(jQuery);

let mapContainer = document.getElementById('mapContainer');
mapboxgl.accessToken = 'pk.eyJ1Ijoibmljb2xla2luZGEiLCJhIjoiY2tzNzNweHEyMDd5ejJxb3pkanFxc2E5aiJ9.w7Eesp4pg5mhkadpSaHzZw';
let mapboxURL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibmljb2xla2luZGEiLCJhIjoiY2tzNzNweHEyMDd5ejJxb3pkanFxc2E5aiJ9.w7Eesp4pg5mhkadpSaHzZw';

var mymap = L.map(mapContainer, {
	editable: true,
	maxZoom: 15,
	zoomOffset: -1,
	center: [-1.253311, 36.827411]
}).setView([-1.253311, 36.827411], 11);
L.tileLayer(mapboxURL, {
	id: 'mapbox/streets-v11',
	attribution: 'Leaflet',
	attributionControl: 'Leaflet',
	accessToken: mapboxgl.accessToken
}).addTo(mymap);

console.log(mapboxgl.accessToken)

setTimeout(function () {
	mymap.invalidateSize();
}, 1000);

/*var helloPopup = L.popup().setContent('Hello World!');*/

L.easyButton('fa-sliders', function(btn, map){
	$('#sidebar').toggleClass('active');
	setTimeout(function () {
		mymap.invalidateSize();
	}, 500);
}).addTo(mymap);

db.collection("locations2").get().then((querySnapshot) => {
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		//console.log(doc.id, " => ", doc.data());

		collectionArray.push({
			id: doc.id,
			latitude: doc.data().latitude,
			longitude: doc.data().longitude,
			folderName: doc.data().folderName,
			phoneNumber: doc.data().phoneNumber,
			title: doc.data().title,
			closingTime: doc.data().closingTime,
			openTime: doc.data().openingTime,
			weblink: doc.data().weblink,
			description: doc.data().description,
			visitIndex: doc.data().visitIndex
		})
		let imageArray = [];

		if (doc.data().latitude && doc.data().longitude) {
			L.marker([doc.data().longitude, doc.data().latitude], {
				id: doc.id,
				latitude: doc.data().latitude,
				longitude: doc.data().longitude,
				folderName: doc.data().folderName,
				phoneNumber: doc.data().phoneNumber,
				title: doc.data().title,
				closingTime: doc.data().closingTime,
				openTime: doc.data().openingTime,
				weblink: doc.data().weblink,
				description: doc.data().description,
				visitIndex: doc.data().visitIndex
			}).addTo(mymap)
			.bindPopup(doc.data().title)
				.on('click', function (e){
					console.log('clicked marker', e.target.options);
					let foldername = e.target.options.folderName;
					let folderRef = storage.ref('locations/' + foldername);
					imageArray = [];
					folderRef.listAll()
						.then((res) => {
							res.prefixes.forEach((folderRef) => {
								// All the prefixes under listRef.
								// You may call listAll() recursively on them.
								/*console.log('res folder', folderRef.name);*/
								console.log('found folder '+ folderRef.name)
							});
							res.items.forEach((itemRef) => {
								// All the items under listRef.

								itemRef.getDownloadURL().then(function (urlObject) {

									imageArray.push({
										imageFolder: foldername,
										imageURL: urlObject,
										imageName: itemRef.name,
										imageBucket: itemRef.bucket
									})

									return imageArray;
								})
							});
							setTimeout(function () {
								setImages(imageArray);
							},2000)
						}).catch((error) => {
						// Uh-oh, an error occurred!
						console.log(error)
					});
				})
		}

	});
	console.log('collection', collectionArray);
});

L.control.custom({
	position: 'bottomleft',
	content : '<button class="btn btn-primary" onclick="startTour()">Start Tour</button>',
	classes : '',
	style   :
		{
			//margin: '0px 20px 20px 0',
			//padding: '0px',
		},
})
	.addTo(mymap);

let storageRef = storage.ref('locations/');
let url = '';
let folderNames = [];
let locationImages = [];

storageRef.listAll()
	.then((res) => {
		res.prefixes.forEach((folderRef) => {
			// All the prefixes under listRef.
			// You may call listAll() recursively on them.
			/*console.log('res folder', folderRef.name);*/
			folderNames.push(folderRef.name);
		});

		folderNames.forEach(function (folder) {
			let folderRef = storage.ref('locations/' + folder)
			folderRef.listAll()
				.then((res) => {
					res.prefixes.forEach((folderRef) => {
						// All the prefixes under listRef.
						// You may call listAll() recursively on them.
						/*console.log('res folder', folderRef.name);*/
						console.log('found folder '+ folderRef.name)
					});
					res.items.forEach((itemRef) => {
						// All the items under listRef.

						itemRef.getDownloadURL().then(function (urlObject) {

							locationImages.push({
								imageFolder: folder,
								imageURL: urlObject,
								imageName: itemRef.name,
								imageBucket: itemRef.bucket
							})
						})
					});
					console.log('images', locationImages);
				}).catch((error) => {
				// Uh-oh, an error occurred!
				console.log(error)
			});
		})
	}).catch((error) => {
	// Uh-oh, an error occurred!
	console.log(error)
});


function setImages(imageArr) {
	console.log(imageArr);
	let finalURL = '';
	document.getElementById('carouselInner').innerHTML = '';
	document.getElementById('carouselIndicator').innerHTML = '';
	imageArr.forEach(function (image, index) {

		console.log('image', image)
		console.log('collection', collectionArray)
		collectionArray.forEach(function (collectionDocument) {
			if (image.imageFolder === collectionDocument.folderName) {
				console.log('collectionDocument', collectionDocument);
				/*document.getElementById('locationTitle').innerText = '';
				document.getElementById('closingTime').innerText = '';
				document.getElementById('openingTime').innerText = '';
				document.getElementById('descriptionBox').innerText = '';*/
				document.getElementById('locationTitle').innerText = collectionDocument.title;
				document.getElementById('openingTime').innerText = collectionDocument.openTime;
				document.getElementById('phoneNumber').innerText = collectionDocument.phoneNumber;
				document.getElementById('closingTime').innerText = collectionDocument.closingTime;
				document.getElementById('descriptionBox').innerText = collectionDocument.description;
			}
		})
		finalURL = finalURL + '<img src="'+ image.imageURL +'" onclick="showGallery()" data-target="#carouselExample" class="img-thumbnail contextImage" id="demoImage" alt="'+ image.imageName +'">';
		if (index === 0) {
			$('#carouselIndicator').append(
				'<li data-target="#carouselExample" data-slide-to="0" class="active"></li>'
			)
			$('#carouselInner').append(
				'<div class="carousel-item active">\n' +
				'                            <img class="d-block w-100" src="'+ image.imageURL +'" alt="'+ index +' slide">\n' +
				'                        </div>'
			)
		} else {
			$('#carouselIndicator').append(
				'<li data-target="#carouselExample" data-slide-to="'+ index +'"></li>'
			)
			$('#carouselInner').append(
				'<div class="carousel-item">\n' +
				'                            <img class="d-block w-100" src="'+ image.imageURL +'" alt="'+ index +' slide">\n' +
				'                        </div>'
			)
		}
	})

	$('#exampleModal').modal();
	console.log(finalURL);
	setContextImages(finalURL);
}

function showGallery() {
	$('#exampleModal').modal();
}

function setContextImages(imageCTX) {
	console.log('image' , imageCTX);
	$('.contextImage').remove();
	L.control.custom({
		position: 'bottomright',
		content : imageCTX,
		classes : '',
		style   :
			{
				margin: '0px 20px 20px 0',
				padding: '0px',
				width: '105px'
			},
	})
		.addTo(mymap);
}

function switchStyle() {
	if (document.getElementById('styleSwitch').checked) {
		document.getElementById('gallery').classList.add("custom");
		document.getElementById('exampleModal').classList.add("custom");
	} else {
		document.getElementById('gallery').classList.remove("custom");
		document.getElementById('exampleModal').classList.remove("custom");
	}
}

function startTour() {
	setAvatar();
	$('#tourModal').modal();
}
let avatarArray = [
	{
		avatar: 'Avatar-5.png',
		greeting: 'Yuh good man? '
	},{
		avatar: 'Avatar-8.png',
		greeting: 'so hi guys'
	},{
		avatar: 'Avatar-11.png',
		greeting: 'Konnichiwa'
	},{
		avatar: 'Avatar-12.png',
		greeting: 'Hey dude '
	},{
		avatar: 'Avatar-17.png',
		greeting: 'Namaste'
	},{
		avatar: 'Avatar-30.png',
		greeting: 'Arrrrr, are you ready kids? '
	},{
		avatar: 'Avatar-31.png',
		greeting: 'Jambo '
	},{
		avatar: 'Avatar-32.png',
		greeting: 'G\'day mate '
	},{
		avatar: 'Avatar-33.png',
		greeting: 'Yoh homey '
	},{
		avatar: 'Avatar-20.png',
		greeting: 'As-salaam \'alaykum'
	},
]

let avatarIndex = Math.floor(Math.random() * 10);
function setAvatar() {

	/*document.getElementsByClassName('avatarImage').src = 'images/avatars/' + avatarArray[avatarIndex].avatar;*/
	$('.avatarImage').attr('src', 'images/avatars/' + avatarArray[avatarIndex].avatar)
	document.getElementById('avatarGreeting').innerText = avatarArray[avatarIndex].greeting;
}
