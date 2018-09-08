import '../../bower_components/font-awesome/svg-with-js/js/fontawesome-all.js';
import '../../node_modules/blast-text/jquery.blast.min.js';
import '../../node_modules/jquery-tagcanvas/jquery.tagcanvas.min.js';
import Barba from 'barba.js';
import {TimeLineMax} from 'gsap';
import Draggable from 'gsap/Draggable';
import Splitter from 'split-html-to-chars';
import Swiper from 'swiper/dist/js/swiper.js';

let tl = new TimelineMax();

//active link menu
$('#menu > a').click(function() {
  $('#menu > a').removeClass('active-m');
  $(this).addClass('active-m');
});
  
//send mail
function send_mail() {
  $('#form').submit(function() {
    $.ajax({
      type: 'POST',
      url: 'mail.php',
      data: $(this).serialize()
    }).done(function() {
      console.log('goof');
    });
    return false;
  });
}

//draggable gallery
function draggable() {
  var wheel = Draggable.create('#nerdwheel-svg', {
    type: 'rotation',
    bounds:{minRotation:0, maxRotation:360},
    throwProps: true,
    edgeResistance: 1,
    onDrag: function() {
      var rot = wheel[0].rotation / 360;
      var decimal = rot % 1;
      var sliderLength = $('ul.gallery li').length;
      var tempIndex = Math.round(sliderLength * decimal);
      var index;

      if (rot < 0) {
        index = Math.abs(tempIndex);
      } else {
        index = sliderLength - tempIndex;
      }
      if (decimal === 0) {
        index = 0;
      }
      $('ul.gallery li.active-gl').removeClass('active-gl');
      $($('ul.gallery li')[index]).addClass('active-gl');
    }
  });
}

function tagcanvas() {
  try {
    TagCanvas.Start('myCanvas','tags',{
      textColour : '#08FDD8',
      outlineThickness : 0.5,
      outlineColour : '#fe0853',
      maxSpeed : 0.06,
      freezeActive:true,
      shuffleTags:true,
      shape:'sphere',
      zoom:0.8,
      noSelect:true,
      textFont:null,
      pinchZoom:true,
      freezeDecel:true,
      fadeIn:3000,
      initial: [0.3,-0.1],
      depth : 0.8
    });
  } catch(e) {
    // something went wrong, hide the canvas container
    // $('#tags-cloud').css('display' , 'none');
  }
}
//letter spliter
function letterSplit() {
  let els = document.querySelectorAll('.letter');
  [].forEach.call(els, function(el) {
    // outerHTML, thats *important*, no direct text nodes should be in parsed HTML 
    el.outerHTML = Splitter(el.outerHTML, '<span class="lt_split">$</span>');
  });
}
//wordp spliter
function wordSplit() {
  $('.word-split').blast({ delimiter: 'word', customClass: 'word_s'});
}

//animated letter/word
function animatedText() {
  $('.letter .lt_split,.word-split .word_s').mouseenter(function() {
    //$('.letter .lt_split').removeClass('animated rubberBand');
    $(this).addClass('animated rubberBand');
    setTimeout(function() {
      $('.word-split .word_s').removeClass('animated rubberBand');
      $('.letter .lt_split').removeClass('animated rubberBand');
    },1000);
  });
}

//animation TRIANGLES
function triangles() {
  var j = 0;   
  function changeClass() {
    $('.canvas').removeClass('figure' + j);
    j = (j===2)?1:j+1;     
    $('.canvas').addClass('figure' + j); 
  } 
  var gogo = setInterval(changeClass, 3000);
  setTimeout(changeClass, 500);
  $('.canvas').click(function(event) {
    clearInterval(gogo);
    changeClass();
    gogo = setInterval(changeClass, 3000);
  });
}


//portfolio
function portfolio() {
  if ($(window).width() > 530) {
    var swiper = new Swiper('.swiper-container',{slidesPerView: 2,spaceBetween: 30,freeMode: true,navigation:{nextEl: '.swiper-button-next',prevEl: '.swiper-button-prev',}});
  }else{
    var swiper = new Swiper('.swiper-container', {
      effect: 'cube',
      grabCursor: true,
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      },
      navigation:{nextEl: '.swiper-button-next',prevEl: '.swiper-button-prev'},
    });
  }
}

//active input (border-bottom)
function b_shadow() {
  $('.cnt-form input, .cnt-form textarea').focus(
    function() {
      $(this).parent('div').addClass('w-100');
    }).blur(
    function() {
      $(this).parent('div').removeClass('w-100');
    });
}  

//mobile menu
$('#click-menu').on('click', function() {
  $('#nav_bar').toggleClass('show');
});


//callback functions
letterSplit();
b_shadow();
send_mail();
wordSplit();
animatedText();
triangles();
draggable();
portfolio();
tagcanvas();
//if (document.location.href.indexOf('2.html') === -1) {} else {tagcanvas();}

//page  load BARBA.JS
var LoadTransition = Barba.BaseTransition.extend({
  start: function() {
    Promise
      .all([this.newContainerLoading, this.effectLoad()])
      .then(this.showNewPage.bind(this));
  },
  effectLoad: function() {
   	tl.to('#page' ,0.3, {scale: 0.9 , opacity: 0.5,ease: Power3.easeNone});
    tl.fromTo('#loader' ,0.7, {x: '-100%'}, {x: '0%',display: 'flex', ease: Power3.easeNone});
    tl.fromTo('#loader .line' , 0.5, {width: 0},{width: '100%', ease: Power0.easeNone});
    $('#nav_bar').removeClass('show');
  },
  showNewPage: function() {
  	var _this = this;
    var $el = $(this.newContainer);
    tl.fromTo($el, 0.5,{opacity: 0},{opacity: 1, onComplete: function() {
      if (document.location.href.indexOf('http://os-developer.zzz.com.ua/contact') === -1) {} else {initMap();b_shadow();}
      send_mail();
      letterSplit();
      wordSplit();
      animatedText();
      triangles();
      draggable();
      tagcanvas();
      portfolio();
	   _this.done();
  	}});
  }

});
Barba.Pjax.getTransition = function() {
  var transitionObj = LoadTransition;
  return transitionObj;
};
Barba.Pjax.start();


//map
function initMap() {
  var styles = [
    {
      'featureType': 'all',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#ffffff'
        }
      ]
    },
    {
      'featureType': 'all',
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'administrative',
      'elementType': 'geometry',
      'stylers': [
        {
          'visibility': 'on'
        },
        {
          'color': '#012621'
        },
        {
          'weight': 0.8
        }
      ]
    },
    {
      'featureType': 'administrative.country',
      'elementType': 'labels',
      'stylers': [
        {
          'color': '#012621'
        }
      ]
    },
    {
      'featureType': 'administrative.country',
      'elementType': 'labels.text',
      'stylers': [
        {
          'color': '#0c0000'
        }
      ]
    },
    {
      'featureType': 'administrative.province',
      'elementType': 'labels.text',
      'stylers': [
        {
          'color': '#012621'
        }
      ]
    },
    {
      'featureType': 'administrative.locality',
      'elementType': 'labels.text',
      'stylers': [
        {
          'color': '#012621'
        }
      ]
    },
    {
      'featureType': 'administrative.neighborhood',
      'elementType': 'labels.text',
      'stylers': [
        {
          'color': '#012621'
        }
      ]
    },
    {
      'featureType': 'landscape',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#06c5a9'
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'all',
      'stylers': [
        {
          'color': '#06c5a9'
        },
        {
          'lightness': -7
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'all',
      'stylers': [
        {
          'color': '#06c5a9'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#ffffff'
        },
        {
          'weight': 0.3
        },
        {
          'lightness': 10
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#047968'
        },
        {
          'lightness': '-7'
        }
      ]
    },
    {
      'featureType': 'road.arterial',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#06c5a9'
        },
        {
          'visibility': 'on'
        },
        {
          'lightness': -15
        }
      ]
    },
    {
      'featureType': 'road.local',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#06c5a9'
        },
        {
          'lightness': '7'
        }
      ]
    },
    {
      'featureType': 'transit',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#06c5a9'
        },
        {
          'lightness': -34
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#333739'
        }
      ]
    }
  ];
  var mapOptions = {
    center: new google.maps.LatLng(50.4473932,30.526286),
    zoom:5,
    disableDefaultUI: true,
    styles: styles
  };
  var map = new google.maps.Map(document.getElementById('map'),
    mapOptions);
  map.setOptions({styles: styles});
  var image = '../img/marker.png';
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(50.4473932,30.526286),
    animation: google.maps.Animation.DROP,
    icon: image

  });
  marker.setMap(map);
  google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
    $('.inf-map').addClass('animated fadeInUp');
    $('#map').css('opacity',1);
  });
}
