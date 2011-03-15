/************************************
 * Add Or Switch Stylesheet
 * This only works with browsers that support localStorage
 *
 * This has been updated to use localStorage instead of cookies
 * Original code by Molokoloco at https://github.com/molokoloco/FRAMEWORK (it was called styleSwitch)
 *
 * Plugin that loads (at the first demand) and switches stylesheets:
 * Manage links to change style
 * Add stylesheet to head, if not exist
 * If already exist, switch style with the disabled attribute
 * Prevent changing styles who are not related to theme : No modification on styles without id attribute
 * Prevent changing other styles who are not related to theme
 * Stock and autoload user style preference, with localStorage

<head>
  <link rel="stylesheet" type="text/css" media="all" href="css/styles.css" id="themeDefault"/>
</head>
<body>
  <ul>
    <li><a href="javascript:void(0);" rel="css/styles.css" class="styler">Original</a></li>
    <li><a href="javascript:void(0);" rel="css/style_light.css" class="styler">Blanc</a></li>
    <li><a href="javascript:void(0);" rel="css/style_dark.css" class="styler">Sombre</a></li>
  </ul>
</body>

// JS USE CASE
  $('a.styler').styler(); // When the user clicks, then the rel stylesheet will be swapped in
  $.styler('swap', 'css/styles.css'); // Direct style change with JS call
*/

(function($) {
  var methods = {
    // disable any of the stylesheets that match
    disable: function(disabled) {
      setTimeout(
        function() {
          $(disabled).each(function() {
            $(this).attr('disabled', 'disabled');
          });
        },
        250
      );
    },
    //Pass a path to the style to load
    load: function(path) {
      $('head').append('<link rel="stylesheet" class="styler" type="text/css" href="' + path + '"/>')
    },
    swap: function(path) {
      var exists = false;
      var disabled = [];
      $.fn.styler('styles').each(function() {
        // Find out if the style that we're trying to swap in is already in the head tag
        if (path == $(this).attr('href')) {
          $(this).removeAttr('disabled');
          exists = true;
        } else {
          // Because the stylesheet in the head is not a stylesheet we want to load, add this stylesheet into the disabled array so that we can disable it later
          disabled.push(this);
        }
      });
      if (exists == false) $.fn.styler('load', path); // The stylesheet we're trying to swap in isn't in the head, so let's load it.
      $.fn.styler('disable', disabled); // let's disable all the stylesheets in the disabled array
      localStorage['jquery.styler.style'] = path; //Save the active stylesheet in the localStorage
    },
    // init is what is applied to links. It will load the rel attribute of the link
    init: function() {
      if (localStorage['jquery.styler.style']) {
        var isSet = false;
        // get each of the styles in the header
        $.fn.styler('styles').each(function() {
          // if the current style is the same one as any of the styles in the header, then make isSet = true
          if (localStorage['jquery.styler.style'] == $(this).attr('href')) isSet = true;
        });
        // if the current style is not in the head tag, then we load it in.
        if (isSet == false) $.fn.styler('swap', localStorage['jquery.styler.style'])
      }
      return $(this).click(function (event) {
        event.preventDefault();
        $.fn.styler('swap', $(this).attr('rel'));
        $(this).blue();
      });
    },
    // returns the styles that are already in the header that can be governed by styler (it has the styler class)
    styles: function() {
      return $('link.styler[rel*=style]')
    }
  };

  $.fn.styler = function(method) {
    // Method calling logic
    if (methods[method]) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.styler');
    }
  };
})(jQuery);
