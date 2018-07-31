function smoothScroll (id) { // eslint-disable-line no-unused-vars
  var element = document.getElementById(id)
  window.scroll({ top: element.offsetTop - 75, left: 0, behavior: 'smooth' })
}

window.onscroll = function () { handleStickyNav() }
var nav = document.getElementById('nav')
var sticky = nav.offsetTop

function handleStickyNav () {
  if (window.pageYOffset >= sticky) {
    nav.classList.add('sticky-nav')
  } else {
    nav.classList.remove('sticky-nav')
  }
}
