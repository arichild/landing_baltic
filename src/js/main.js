$( document ).ready(function() {
  // popup
  $(document).on("click", ".mfp-link", function () {
    var a = $(this);

    $.magnificPopup.open({
      items: { src: a.attr("data-href") },
      type: "ajax",
      overflowY: "scroll",
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in',
      ajax: {
        tError: "Error. Not valid url",
      },
      callbacks: {
        open: function () {
          setTimeout(function(){
            $('.mfp-wrap').addClass('not_delay');
            $('.mfp-popup').addClass('not_delay');
          },700);
        }
      },

      callbacks: {
        open: function() {
          document.documentElement.style.overflow = 'hidden'
        },

        close: function() {
          document.documentElement.style.overflow = ''
        }
      }
    });
    return false;
  });



  // validate
  $.validator.messages.required = 'Пожалуйста, введите данные';

  jQuery.validator.addMethod("lettersonly", function(value, element) {
    return this.optional(element) || /^([а-яё ]+|[a-z ]+)$/i.test(value);
  }, "Поле может состоять из букв и пробелов, без цифр");

  jQuery.validator.addMethod("phone", function (value, element) {
    if (value.startsWith('+375')) {
      return /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){12}(\s*)?$/i.test(value);
    } else if (value.startsWith('+7')) {
      return /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){11}(\s*)?$/i.test(value);
    } else {
      return /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){11,14}(\s*)?$/i.test(value);
    }
  }, "Введите полный номер");



  // imask
  let phone = document.querySelectorAll('.phone-mask')

  if(phone.length) {
    phone.forEach(element => {
      IMask(element, {
        mask: [
          {
            mask: '+{375} (00) 000-00-00',
            startsWith: '375',
            overwrite: true,
            lazy: false,
            placeholderChar: '_',
          },
          {
            mask: '+{48} (000) 000-000',
            startsWith: '48',
            overwrite: true,
            lazy: false,
            placeholderChar: '_',
          },
          {
            mask: '+{7} (000) 000-00-00',
            startsWith: '7',
            overwrite: true,
            lazy: false,
            placeholderChar: '_',
          },
          {
            mask: '+0000000000000',
            startsWith: '',
            country: 'unknown'
          }
        ],

        dispatch: function (appended, dynamicMasked) {
          var number = (dynamicMasked.value + appended).replace(/\D/g, '');

          return dynamicMasked.compiledMasks.find(function (m) {
            return number.indexOf(m.startsWith) === 0;
          });
        }
      })
    });
  }

  function heightAuto(element, nameClass) {
    setTimeout(() => {
      const visibleEl = element.querySelectorAll('.is-visible')
      let heights = []

      visibleEl.forEach(el => {
        let height = el.querySelector(`.${nameClass}`).offsetHeight

        heights.push(height)
    });

      const maxHeight = Math.max(...heights)
      const list = element.querySelector('.splide__list')

      list.style.height = maxHeight + 'px'
    }, 1);
  }

  if($('.splide.activity-slider')) {
    new Splide( '.splide.activity-slider', {
      pagination: false,
      gap: 20,
      perPage: 4,

      breakpoints: {
        1366: {
          perPage: 3,
        },
        1024: {
          perPage: 2,
        },
        768: {
          arrows: false,
          pagination: true
        },
        576: {
          perPage: 1,
        },
      }
    }).mount();
  }

  if($('.splide.info-slider')) {
    new Splide( '.splide.info-slider', {
      pagination: false,
      gap: 0,
      perPage: 4,
      arrows: false,
      type   : 'loop',
      drag   : 'free',
      autoScroll: {
        speed: 1,
      },

      breakpoints: {
        1366: {
          perPage: 3,
        },
        1024: {
          perPage: 2,
        },
        576: {
          perPage: 1,
        },
      }
    }).mount( window.splide.Extensions);
  }

  if($('.splide.advantage-slider')) {
    const sliderBlock = document.querySelector('.splide.advantage-slider')
    const slider = new Splide( '.splide.advantage-slider', {
      pagination: false,
      gap: 20,
      perPage: 2,

      breakpoints: {
        // 1366: {
        //   perPage: 3,
        // },
        // 1024: {
        //   perPage: 2,
        // },
        768: {
          arrows: false,
          pagination: true
        },
        576: {
          perPage: 1,
        },
      }
    });

    slider.on('mounted moved', () => {
      heightAuto(sliderBlock, 'advantage-card')
    });
    slider.mount()
  }

  if($('.splide.business-slider')) {
    new Splide( '.splide.business-slider', {
      pagination: false,
      arrows: false,
      gap: 100,
      perPage: 3,
      // drag: false,

      breakpoints: {
        1366: {
          gap: 60,
          // fixedWidth : '280px',
        },

        1024: {
          gap: 20
        },
        // 1024: {
        //   perPage: 2,
        // },
        // 768: {
        //   arrows: false,
        //   pagination: true
        // },
        576: {
          perPage: 1,
          pagination: true,
          gap: 0,
        },
      }
    }).mount();
  }

  $(".ui-tel").intlTelInput({
    initialCountry: 'PL',
    autoHideDialCode: false,
    autoPlaceholder: "aggressive",
    nationalMode: false,
    separateDialCode: false,
    hiddenInput: "full_number",
  });

  $(".ui-tel").each(function () {
    let hiddenInput = $(this).attr('name');
    $("input[name="+hiddenInput+"-country-code]").val($(this).val());
  });

  $(".ui-tel").on("countrychange", function() {
    let hiddenInput = $(this).attr("name");
    $("input[name="+hiddenInput+"-country-code]").val(this.value);
  });
});


function showPopup(src) {
  $.magnificPopup.open({
    items: { src: src },
    type: 'ajax',
    overflowY: 'scroll',
    removalDelay: 300,
    mainClass: 'my-mfp-zoom-in',
    ajax: {
      tError: 'Ошибка. <a href="%url%">Контент</a> не может быть загружен',
    },
    callbacks: {
      open: function () {
        setTimeout(function () {
          $('.mfp-wrap').addClass('not_delay');
          $('.white-popup').addClass('not_delay');
        }, 700);
      }
    },
  });
}