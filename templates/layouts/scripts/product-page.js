var multipleCardCarousel = document.querySelector(
    "#carousel-cards"
  );
  if (window.matchMedia("(min-width: 768px)").matches) {
    var carousel = new bootstrap.Carousel(multipleCardCarousel, {
      interval: false,
    });
    var carouselWidth = $(".carousel-cards-inner")[0].scrollWidth;
    var cardWidth = $(".carousel-cards-item").width();
    var scrollPosition = 0;
    $("#carousel-cards .carousel-control-next").on("click", function () {
      if (scrollPosition < carouselWidth - cardWidth * 4) {
        scrollPosition += cardWidth;
        $("#carousel-cards .carousel-cards-inner").animate(
          { scrollLeft: scrollPosition },
          600
        );
      }
    });
    $("#carousel-cards .carousel-control-prev").on("click", function () {
      if (scrollPosition > 0) {
        scrollPosition -= cardWidth;
        $("#carousel-cards .carousel-cards-inner").animate(
          { scrollLeft: scrollPosition },
          600
        );
      }
    });
  } else {
    $(multipleCardCarousel).addClass("slide");
  }