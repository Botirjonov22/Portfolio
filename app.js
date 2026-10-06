document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -20px 0px" },
  );

  targets.forEach((t) => observer.observe(t));
});
(function(){
  var s = document.getElementById('pf-gallery'),
      t = s.querySelector('.pf-track'),
      sl = s.querySelectorAll('.pf-slide'),
      d = s.querySelector('.pf-dots'),
      v = s.querySelector('.pf-view'),
      i = 0, n = sl.length, x0 = null, tm;

  sl.forEach(function(_, k){
    var b = document.createElement('button');
    b.className = 'pf-dot';
    b.setAttribute('aria-label', (k+1) + '-rasm');
    b.onclick = function(){ go(k) };
    d.appendChild(b);
  });
  var dots = d.children;

  function go(k){
    i = (k + n) % n;
    t.style.transform = 'translateX(-' + i*100 + '%)';
    sl.forEach(function(e, j){
      e.classList.toggle('on', j === i);
      dots[j].classList.toggle('on', j === i);
    });
    auto();
  }
  function auto(){
    clearInterval(tm);
    tm = setInterval(function(){ go(i+1) }, 6000);
  }

  s.querySelector('.pf-prev').onclick = function(){ go(i-1) };
  s.querySelector('.pf-next').onclick = function(){ go(i+1) };

  v.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX }, {passive:true});
  v.addEventListener('touchend', function(e){
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  go(0);
})();