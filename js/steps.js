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
                            console.log('urlObject', urlObject, folder)


                            const result = folder.replace(/([A-Z])/g, " $1");
                            const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
                            console.log(finalResult);

                            $('#galleryRow').append(
                                '<div class="col-xl-3 col-lg-4 col-md-6 mb-4">\n' +
                                '                        <div class="bg-white rounded shadow-sm"><img src="'+ urlObject +'" alt="" class="img-fluid card-img-top">\n' +
                                '                            <div class="p-4">\n' +
                                '                                <h5> <a href="#" class="text-dark">'+ finalResult +'</a></h5>\n' +
                                '                                <div class="d-flex align-items-center justify-content-between rounded-pill bg-light px-3 py-2 mt-4">\n' +
                                '                                    <p class="small mb-0"><i class="fa fa-picture-o mr-2"></i><span class="font-weight-bold">JPG</span></p>\n' +
                                '                                    <div class="badge badge-danger px-3 rounded-pill font-weight-normal">New</div>\n' +
                                '                                </div>\n' +
                                '                            </div>\n' +
                                '                        </div>\n' +
                                '                    </div>'
                            )

                            /*locationImages.push({
                                imageFolder: folder,
                                imageURL: urlObject,
                                imageName: itemRef.name,
                                imageBucket: itemRef.bucket
                            })*/
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


/*function setImages(imageArr) {
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
                /!*document.getElementById('locationTitle').innerText = '';
                document.getElementById('closingTime').innerText = '';
                document.getElementById('openingTime').innerText = '';
                document.getElementById('descriptionBox').innerText = '';*!/
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
}*/
