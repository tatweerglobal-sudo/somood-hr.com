// Google Translate Widget Integration
(function() {
  // Prevent duplicate insertion
  if (document.getElementById('google-translate-script')) return;

  // Insert Google Translate element wrapper if not exists
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'ar,en,fr',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');
  };

  var gtDiv = document.createElement('div');
  gtDiv.id = 'google_translate_element';
  gtDiv.style.display = 'none';
  document.body.appendChild(gtDiv);

  var s = document.createElement('script');
  s.id = 'google-translate-script';
  s.type = 'text/javascript';
  s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(s);

  // Styling to hide Google banner and customize language bar
  var style = document.createElement('style');
  style.innerHTML = `
    .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon, .goog-te-banner-frame { display: none !important; }
    body { top: 0px !important; }
    .skiptranslate iframe { display: none !important; }
    #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
    .goog-text-highlight { background: none !important; box-shadow: none !important; }
    .lang-switcher-btn {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-weight: 600;
      font-size: 14px;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background 0.2s;
    }
  `;
  document.head.appendChild(style);

  // Global language changer function
  window.changeSiteLanguage = function(langCode) {
    // Set cookie for Google Translate
    var domain = window.location.hostname;
    document.cookie = "googtrans=/auto/" + langCode + "; path=/; domain=" + domain;
    document.cookie = "googtrans=/auto/" + langCode + "; path=/;";
    
    // Also trigger select element if present
    var select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }
    
    // Auto reload if translation cookie changed
    window.location.reload();
  };

  // Bind to existing language switcher links
  document.addEventListener('DOMContentLoaded', function() {
    // Look for language links
    document.querySelectorAll('.wpml-ls-item a, a[title*="Arabic"], a[title*="Ar"], a[title*="En"], a[title*="Fr"]').forEach(function(el) {
      var txt = (el.innerText || el.textContent || '').trim().toLowerCase();
      var title = (el.getAttribute('title') || '').toLowerCase();
      var href = el.getAttribute('href') || '';
      
      var targetLang = '';
      if (txt.includes('ar') || title.includes('ar') || title.includes('عرب') || href.includes('/ar')) {
        targetLang = 'ar';
      } else if (txt.includes('fr') || title.includes('fr') || title.includes('fran') || href.includes('/fr')) {
        targetLang = 'fr';
      } else if (txt.includes('en') || title.includes('en') || title.includes('إنجل') || title.includes('engl')) {
        targetLang = 'en';
      }

      if (targetLang) {
        el.addEventListener('click', function(e) {
          // If using client-side translation engine
          window.changeSiteLanguage(targetLang);
        });
      }
    });
  });
})();
