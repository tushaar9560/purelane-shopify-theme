/**
 * Purelane Shopify Theme Engine
 * Replicates purelane-homepage interactions with full Shopify Theme Editor resilience.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. SCROLL REVEAL OBSERVER
     ========================================================================== */
  var revealObserver = null;

  function initReveals(container) {
    var root = container || document;
    var revs = [].slice.call(root.querySelectorAll('.rv'));
    if (!revs.length) return;

    if ('IntersectionObserver' in window && !reduce) {
      if (!revealObserver) {
        revealObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              revealObserver.unobserve(entry.target);
            }
          });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
      }
      revs.forEach(function (el) {
        if (!el.classList.contains('in')) {
          revealObserver.observe(el);
        }
      });
    } else {
      revs.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ==========================================================================
     2. SCENE DEPTH & PARALLAX ENGINE
     ========================================================================== */
  var currentScene = 0;
  var rafId = null;
  var mouseX = 0, mouseY = 0;

  function setScene(n) {
    if (n === currentScene) return;
    currentScene = n;
    var scenes = [].slice.call(document.querySelectorAll('.scene'));
    var stage = document.getElementById('scenes');
    scenes.forEach(function (s, i) {
      s.classList.toggle('on', i + 1 === n);
    });
    if (stage) stage.setAttribute('data-d', String(n));
  }

  function pickScene() {
    var zones = [].slice.call(document.querySelectorAll('[data-scene]'));
    if (!zones.length) return;
    var focus = (window.scrollY || window.pageYOffset) + window.innerHeight * 0.5;
    var n = 1;
    for (var i = 0; i < zones.length; i++) {
      var z = zones[i];
      var top = 0, el = z;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
      }
      if (top <= focus) {
        n = parseInt(z.getAttribute('data-scene'), 10) || n;
      }
    }
    setScene(n);
  }

  function syncRail() {
    var railLinks = [].slice.call(document.querySelectorAll('.rail a'));
    if (!railLinks.length) return;
    var targets = railLinks.map(function (a) {
      var href = a.getAttribute('href');
      return href ? document.querySelector(href) : null;
    });
    var mid = (window.scrollY || window.pageYOffset) + window.innerHeight * 0.42;
    var idx = 0;
    targets.forEach(function (t, i) {
      if (t && t.offsetTop <= mid) idx = i;
    });
    railLinks.forEach(function (a, i) {
      a.classList.toggle('on', i === idx);
    });
  }

  function renderFrame() {
    rafId = null;
    var y = window.scrollY || window.pageYOffset;
    var hdr = document.getElementById('hdr');
    if (hdr) hdr.classList.toggle('up', y > 90);

    if (!reduce) {
      var wl = document.querySelectorAll('#water .wl');
      var depths = [0.05, 0.09, 0.03, 0.02];
      for (var i = 0; i < wl.length; i++) {
        var d = depths[i] || 0.05;
        wl[i].style.setProperty('--px', (mouseX * d * 130).toFixed(1) + 'px');
        wl[i].style.setProperty('--py', (-y * d + mouseY * d * 90).toFixed(1) + 'px');
      }

      var prod = document.getElementById('heroProd');
      if (prod) {
        var f = Math.min(y / 700, 1);
        prod.style.transform = 'translate3d(' + (mouseX * -16).toFixed(2) + 'px,' + (-f * 54 + mouseY * -10).toFixed(2) + 'px,0) scale(' + (1 - f * 0.06).toFixed(3) + ')';
        prod.style.opacity = (1 - f * 0.55).toFixed(3);
      }
    }

    syncRail();
    pickScene();
  }

  function requestFrame() {
    if (!rafId) rafId = requestAnimationFrame(renderFrame);
  }

  /* ==========================================================================
     3. HERO STAGE SLIDER (1 -> 2 -> 3 products)
     ========================================================================== */
  var heroTimer = null;

  function initHeroStage(container) {
    var root = container || document;
    var hstage = root.querySelector('#hstage');
    var hdotsContainer = root.querySelector('#hdots');
    if (!hstage || !hdotsContainer) return;

    var hs = [].slice.call(hstage.querySelectorAll('.hslide'));
    var hd = [].slice.call(hdotsContainer.querySelectorAll('button'));
    if (!hs.length) return;

    var hi = 0;

    function hgo(n) {
      hi = (n + hs.length) % hs.length;
      hs.forEach(function (s, i) { s.classList.toggle('on', i === hi); });
      hd.forEach(function (d, i) { d.classList.toggle('on', i === hi); });
    }

    function hplay() {
      if (!heroTimer && !reduce) {
        heroTimer = setInterval(function () { hgo(hi + 1); }, 3800);
      }
    }

    function hstop() {
      if (heroTimer) {
        clearInterval(heroTimer);
        heroTimer = null;
      }
    }

    hd.forEach(function (d, i) {
      d.onclick = function () {
        hstop();
        hgo(i);
        hplay();
      };
    });

    hstage.onmouseenter = hstop;
    hstage.onmouseleave = hplay;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          e.isIntersecting ? hplay() : hstop();
        });
      }, { threshold: 0.2 }).observe(hstage);
    } else {
      hplay();
    }
  }

  /* ==========================================================================
     4. PRODUCT ROTATOR (Ingredients / Proof Section)
     ========================================================================== */
  var rotTimer = null;

  function initRotator(container) {
    var root = container || document;
    var rot = root.querySelector('#rot');
    if (!rot) return;

    var rimgs = [].slice.call(rot.querySelectorAll('.frame .pimg'));
    var rdots = [].slice.call(rot.querySelectorAll('.dots i'));
    var rcapB = rot.querySelector('.cap b');
    var rcapS = rot.querySelector('.cap span');
    if (!rimgs.length) return;

    var ri = 0;

    function rstep() {
      rimgs[ri].classList.remove('on');
      if (rdots[ri]) rdots[ri].classList.remove('on');
      ri = (ri + 1) % rimgs.length;
      rimgs[ri].classList.add('on');
      if (rdots[ri]) rdots[ri].classList.add('on');
      if (rcapB) rcapB.innerHTML = rimgs[ri].getAttribute('data-name') || '';
      if (rcapS) rcapS.textContent = rimgs[ri].getAttribute('data-note') || '';
    }

    if (!reduce) {
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !rotTimer) {
            rotTimer = setInterval(rstep, 2900);
          } else if (!e.isIntersecting && rotTimer) {
            clearInterval(rotTimer);
            rotTimer = null;
          }
        });
      }, { threshold: 0.25 });
      rio.observe(rot);
    }
  }

  /* ==========================================================================
     5. AJAX CART INTEGRATION
     ========================================================================== */
  function updateCartBadge(count) {
    var dots = document.querySelectorAll('.navtools .dot, .cart-count-bubble span:first-child');
    dots.forEach(function (dot) {
      dot.textContent = count;
      dot.style.display = count > 0 ? '' : 'none';
    });
  }

  function initAjaxCart() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.purelane-add-to-cart-btn');
      if (!btn) return;
      e.preventDefault();

      var variantId = btn.getAttribute('data-variant-id');
      if (!variantId) return;

      var originalText = btn.innerHTML;
      btn.classList.add('is-loading');

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: parseInt(variantId, 10),
          quantity: 1
        })
      })
      .then(function (res) { return res.json(); })
      .then(function (item) {
        btn.classList.remove('is-loading');
        btn.innerHTML = 'Added &#10003;';
        setTimeout(function () {
          btn.innerHTML = originalText;
        }, 2200);

        // Fetch updated cart count
        fetch('/cart.js')
          .then(function (res) { return res.json(); })
          .then(function (cart) {
            updateCartBadge(cart.item_count);
            // If Dawn cart drawer exists, dispatch event
            document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
          });
      })
      .catch(function (err) {
        console.error('Add to cart failed:', err);
        btn.classList.remove('is-loading');
        btn.innerHTML = 'Error';
        setTimeout(function () { btn.innerHTML = originalText; }, 2000);
      });
    });
  }

  /* ==========================================================================
     6. INITIALIZATION & THEME EDITOR LIFECYCLE
     ========================================================================== */
  function initAll() {
    initReveals();
    initHeroStage();
    initRotator();
    initAjaxCart();
    requestFrame();

    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', requestFrame);

    if (!reduce && window.matchMedia('(min-width: 1024px)').matches) {
      window.addEventListener('mousemove', function (e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        requestFrame();
      }, { passive: true });
    }

    // #region agent log
    (function logPalette() {
      var body = getComputedStyle(document.body);
      var s1 = document.querySelector('.s1');
      var rail = document.querySelector('.comborail');
      var h1 = document.querySelector('.hero h1');
      var payload = {
        sessionId: '47304c',
        runId: 'post-fix',
        location: 'purelane-theme.js:initAll',
        message: 'palette and art probe',
        timestamp: Date.now(),
        data: {
          ink: body.getPropertyValue('--ink').trim(),
          paper: body.getPropertyValue('--paper').trim(),
          bodyBg: body.backgroundColor,
          bodyAttachment: body.backgroundAttachment,
          bodyHasGradient: document.body.classList.contains('gradient'),
          s1Bg: s1 ? getComputedStyle(s1).backgroundImage.slice(0, 160) : null,
          h1: h1 ? (h1.innerText || '').replace(/\s+/g, ' ').trim() : null,
          pimgCount: document.querySelectorAll('.card .pimg').length,
          cardImgCount: document.querySelectorAll('.card img').length,
          comboOverflow: rail ? getComputedStyle(rail).overflowX : null,
          comboCount: document.querySelectorAll('.combo').length
        }
      };
      payload.hypothesisId = 'A';
      fetch('http://127.0.0.1:7317/ingest/54be5e12-6d21-4405-a65a-d0ddbbeea765',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'47304c'},body:JSON.stringify(payload)}).catch(function(){});
      payload.hypothesisId = 'B';
      payload.message = 'shop card art probe';
      fetch('http://127.0.0.1:7317/ingest/54be5e12-6d21-4405-a65a-d0ddbbeea765',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'47304c'},body:JSON.stringify(payload)}).catch(function(){});
    })();
    // #endregion
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Shopify Theme Editor Events
  document.addEventListener('shopify:section:load', function (e) {
    initReveals(e.target);
    initHeroStage(e.target);
    initRotator(e.target);
    requestFrame();
  });

  document.addEventListener('shopify:section:reorder', function () {
    requestFrame();
  });
})();
