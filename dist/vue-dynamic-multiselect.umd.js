(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.DynamicMultiSelect = {})));
}(this, (function (exports) { 'use strict';

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script = {
        props: {
            placeholder: {
                type: String, 
                default: 'search',
                required: false
            },
            options: {
                type: Array, 
                default: function() {
                    return []
                },
                required: true
            },
            optionValue: {
                type: String, 
                default: 'id',
                required: true
            },
            optionText: {
                type: String, 
                default: 'name',
                required: true
            },
            value: {
                type: Array,
                default: function() {
                    return []
                },
                required: false
            }
        },
        data: function() {
            return {
                hasFocus: false,
                search: null,
                selectedOptions: [],
                selectedResult: 0
            };
        },
        mounted: function mounted() {
            var this$1 = this;

            // Load selected options from prop into the selected options array
            this.value.forEach(function (option) {
                if(this$1.options.find(function (o) { return o.id == option.id; })) {
                    this$1.selectedOptions.push(this$1.options.find(function (o) { return o.id == option.id; }));
                } else {
                    this$1.selectedOptions.push(option);
                }
            });
            // Add onclick method to body to hide result list when component loses focus
            window.addEventListener("click", this.loseFocus);
        },
        destroyed: function destroyed() {
            window.removeEventListener("click", this.loseFocus);
        },
        computed: {
            results: function() {
                var this$1 = this;

                // Filter options on search text (if not empty, case insensitive) and when item isn't already selected (else return all options not selected)
                return this.search ? this.options.filter(function (o) { return ( o[this$1.optionText].toLowerCase().indexOf(this$1.search.toLowerCase()) > -1 && !this$1.selectedOptions.find(function (s) { return s[this$1.optionValue]==o[this$1.optionValue]; })); } ) : this.options.filter(function (o) { return !this$1.selectedOptions.find(function (s) { return s[this$1.optionValue] == o[this$1.optionValue]; }); });
            },
            showResultList: function() {
                return this.hasFocus && this.results.length > 0;
            },
            showPlaceholder: function() {
                return !this.hasFocus && this.selectedOptions.length == 0;
            }
        },
        watch: {
            hasFocus: function(hasFocus) {
                // Clear the search box when component loses focus
                window.removeEventListener("keydown", this.stopScroll);
                if(hasFocus) {
                    window.addEventListener("keydown", this.stopScroll);
                    this.$refs.search.focus();
                } else {
                    this.search = null;
                    this.selectedResult = 0;
                    this.$refs.search.blur();
                }
            },
            selectedOptions: function() {
                // Provide selected options array to parent
                this.$emit('input', this.selectedOptions);
            },
            search: function() {
                // Provide search text to parent (for ajax fetching, etc)
                this.$emit('search', this.search);
            }
        },
        methods: {
            addOption: function(option) {
                this.selectedOptions.push(option);
                this.search = null;
                this.selectedResult = 0;
            },
            removeOption: function(option) {
                // Remove option from selected options
                var index = this.selectedOptions.indexOf(option);
                this.selectedOptions.splice(index, 1);
            },
            removeLastOption: function(event) {
                // Remove last selected option if user hits backspace on empty search field
                if(event.keyCode === 8 && (this.search == null || this.search == '')) {
                    this.selectedOptions.pop();
                }
            },
            moveToResults: function(event) {
                // Move down to first result if user presses down arrow (from search field)
                if(event.keyCode === 40) {
                    if(this.$refs.result.length > 0) {
                        this.$refs.resultList.children.item(0).focus();
                    }
                }
            },
            navigateResults: function(option, event) {
                // Add option to selected items on enter key
                if(event.keyCode === 13) {
                    this.addOption(option);
                    this.$refs.search.focus();
                // Move up or down options in result list with up or down arrow keys
                } else if(event.keyCode === 40 || event.keyCode === 38) {
                    if(event.keyCode === 40) {
                        this.selectedResult++;
                    } else if(event.keyCode === 38) {
                        this.selectedResult--;
                    }
                    var next = this.$refs.resultList.children.item(this.selectedResult);
                    if(next) {
                        next.focus();
                    } else {
                        this.selectedResult = 0;
                        this.$refs.search.focus();
                    }
                }
            },
            highlight: function(value) {
                // Highlights the part of each result that matches the search text
                if(this.search) {
                    var matchPos = value.toLowerCase().indexOf(this.search.toLowerCase());
                    if(matchPos > -1) {
                        var matchStr = value.substr(matchPos, this.search.length);
                        value = value.replace(matchStr, '<span style="font-weight: bold; background-color: #efefef;">'+matchStr+'</span>');
                    }
                }

                return value;
            },
            stopScroll: function(event) {
                if(event.keyCode === 40 || event.keyCode === 38) {
                    event.preventDefault();
                }
            },
            loseFocus: function(event) {
                if(!event.target.classList.contains('vue-dynamic-select') && (event.target.parentElement && !event.target.parentElement.classList.contains('vue-dynamic-select'))) {
                    this.hasFocus = false;
                }
            }
        }
    }

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
    /* server only */
    , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
      } // Vue.extend constructor export interop.


      var options = typeof script === 'function' ? script.options : script; // render functions

      if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true; // functional template

        if (isFunctionalTemplate) {
          options.functional = true;
        }
      } // scopedId


      if (scopeId) {
        options._scopeId = scopeId;
      }

      var hook;

      if (moduleIdentifier) {
        // server build
        hook = function hook(context) {
          // 2.3 injection
          context = context || // cached call
          this.$vnode && this.$vnode.ssrContext || // stateful
          this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
          // 2.2 with runInNewContext: true

          if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
            context = __VUE_SSR_CONTEXT__;
          } // inject component styles


          if (style) {
            style.call(this, createInjectorSSR(context));
          } // register component module identifier for async chunk inference


          if (context && context._registeredComponents) {
            context._registeredComponents.add(moduleIdentifier);
          }
        }; // used by ssr in case component is cached and beforeCreate
        // never gets called


        options._ssrRegister = hook;
      } else if (style) {
        hook = shadowMode ? function () {
          style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
        } : function (context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook) {
        if (options.functional) {
          // register for functional component in vue file
          var originalRender = options.render;

          options.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context);
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = options.beforeCreate;
          options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }

      return script;
    }

    var normalizeComponent_1 = normalizeComponent;

    var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
    function createInjector(context) {
      return function (id, style) {
        return addStyle(id, style);
      };
    }
    var HEAD = document.head || document.getElementsByTagName('head')[0];
    var styles = {};

    function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = {
        ids: new Set(),
        styles: []
      });

      if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;

        if (css.map) {
          // https://developer.chrome.com/devtools/docs/javascript-debugging
          // this makes source maps inside style tags work properly in Chrome
          code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

          code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
        }

        if (!style.element) {
          style.element = document.createElement('style');
          style.element.type = 'text/css';
          if (css.media) { style.element.setAttribute('media', css.media); }
          HEAD.appendChild(style.element);
        }

        if ('styleSheet' in style.element) {
          style.styles.push(code);
          style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
        } else {
          var index = style.ids.size - 1;
          var textNode = document.createTextNode(code);
          var nodes = style.element.childNodes;
          if (nodes[index]) { style.element.removeChild(nodes[index]); }
          if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
        }
      }
    }

    var browser = createInjector;

    /* script */
    var __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", [
        _c(
          "div",
          {
            staticClass: "vue-dynamic-select",
            attrs: { tabindex: "0" },
            on: {
              click: function($event) {
                return _vm.$refs.search.focus()
              },
              focusin: function($event) {
                _vm.hasFocus = true;
              }
            }
          },
          [
            _vm.showPlaceholder
              ? _c("div", {
                  staticClass: "placeholder",
                  domProps: { textContent: _vm._s(_vm.placeholder) }
                })
              : _vm._e(),
            _vm._v(" "),
            _vm._l(_vm.selectedOptions, function(option) {
              return _c("div", {
                key: option[_vm.optionValue],
                staticClass: "selected-option",
                domProps: { textContent: _vm._s(option[_vm.optionText]) },
                on: {
                  click: function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    return _vm.removeOption(option)
                  }
                }
              })
            }),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.search,
                  expression: "search"
                }
              ],
              ref: "search",
              staticClass: "search",
              attrs: { autocomplete: "off" },
              domProps: { value: _vm.search },
              on: {
                keyup: _vm.moveToResults,
                keydown: _vm.removeLastOption,
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.search = $event.target.value;
                }
              }
            }),
            _vm._v(" "),
            _c("i", { staticClass: "dropdown" }),
            _vm._v(" "),
            _vm.showResultList
              ? _c(
                  "div",
                  { ref: "resultList", staticClass: "result-list" },
                  _vm._l(_vm.results, function(result) {
                    return _c("div", {
                      key: result[_vm.optionValue],
                      ref: "result",
                      refInFor: true,
                      staticClass: "result",
                      attrs: { tabindex: "0" },
                      domProps: {
                        innerHTML: _vm._s(_vm.highlight(result[_vm.optionText]))
                      },
                      on: {
                        click: function($event) {
                          return _vm.addOption(result)
                        },
                        keyup: function($event) {
                          $event.preventDefault();
                          return _vm.navigateResults(result, $event)
                        }
                      }
                    })
                  }),
                  0
                )
              : _vm._e()
          ],
          2
        )
      ])
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      var __vue_inject_styles__ = function (inject) {
        if (!inject) { return }
        inject("data-v-238a9e44_0", { source: "\n.vue-dynamic-select[data-v-238a9e44] {\n    border: 1px solid #ced4da; \n    position: relative;\n    padding: .375em .5em;\n    border-radius: .25em;\n    cursor: text;\n    display: block;\n}\n.vue-dynamic-select i.dropdown[data-v-238a9e44] {\n    width: 0; \n    height: 0; \n    border-left: 4px solid transparent; \n    border-right: 4px solid transparent; \n    border-top: 4px solid; \n    float: right; \n    top: .75em; \n    opacity: .8; \n    cursor: pointer;\n}\n.vue-dynamic-select .placeholder[data-v-238a9e44] {\n    display: inline-block;\n    color: #ccc;\n}\n.vue-dynamic-select .result-list[data-v-238a9e44] {\n    border: 1px solid #ced4da; \n    margin: calc(.375em - 1px) calc(-.5em - 1px);\n    width: calc(100% + 2px);\n    min-width: calc(100% + 2px);\n    border-radius: 0 0 .25em .25em;\n    cursor: pointer;\n    position: absolute;\n    z-index: 10;\n    background-color: #fff;\n}\n.vue-dynamic-select .result-list .result[data-v-238a9e44] {\n    padding: .375em .75em;\n    color: #333;\n}\n.vue-dynamic-select .result-list .result[data-v-238a9e44]:hover, .vue-dynamic-select .result-list .result[data-v-238a9e44]:focus {\n    background-color: #efefef;\n    outline: none;\n}\n.vue-dynamic-select .selected-option[data-v-238a9e44] {\n    display: inline-block;\n    padding: .1em .25em;\n    margin: .15em .35em .15em 0em;\n    background-color: #efefef;\n    font-size: .9em;\n    border: 1px solid #c3c3c3;\n    border-radius: .25em;\n    cursor: pointer;\n}\n.vue-dynamic-select .search[data-v-238a9e44] {\n    border: none;\n    width: 50px;\n}\n.vue-dynamic-select .search[data-v-238a9e44]:focus {\n    outline: none;\n}\n", map: {"version":3,"sources":["/home/smontgomery/Projects/vue-dynamic-multiselect/src/DynamicMultiSelect.vue"],"names":[],"mappings":";AAiLA;IACA,yBAAA;IACA,kBAAA;IACA,oBAAA;IACA,oBAAA;IACA,YAAA;IACA,cAAA;AACA;AACA;IACA,QAAA;IACA,SAAA;IACA,kCAAA;IACA,mCAAA;IACA,qBAAA;IACA,YAAA;IACA,UAAA;IACA,WAAA;IACA,eAAA;AACA;AACA;IACA,qBAAA;IACA,WAAA;AACA;AACA;IACA,yBAAA;IACA,4CAAA;IACA,uBAAA;IACA,2BAAA;IACA,8BAAA;IACA,eAAA;IACA,kBAAA;IACA,WAAA;IACA,sBAAA;AACA;AACA;IACA,qBAAA;IACA,WAAA;AACA;AACA;IACA,yBAAA;IACA,aAAA;AACA;AACA;IACA,qBAAA;IACA,mBAAA;IACA,6BAAA;IACA,yBAAA;IACA,eAAA;IACA,yBAAA;IACA,oBAAA;IACA,eAAA;AACA;AACA;IACA,YAAA;IACA,WAAA;AACA;AACA;IACA,aAAA;AACA","file":"DynamicMultiSelect.vue","sourcesContent":["<template>\n    <div>\n        <div tabindex=\"0\" @click=\"$refs.search.focus()\" @focusin=\"hasFocus=true\" class=\"vue-dynamic-select\">\n            <div v-if=\"showPlaceholder\" class=\"placeholder\" v-text=\"placeholder\"></div>\n            <div class=\"selected-option\" v-for=\"option in selectedOptions\" :key=\"option[optionValue]\" v-text=\"option[optionText]\" @click.prevent.stop=\"removeOption(option)\" />\n            <input autocomplete=\"off\" class=\"search\" ref=\"search\" v-model=\"search\" @keyup=\"moveToResults\" @keydown=\"removeLastOption\" />\n            <i class=\"dropdown\" />\n            <div v-if=\"showResultList\" ref=\"resultList\" class=\"result-list\">\n                <div tabindex=0 ref=\"result\" class=\"result\" v-for=\"result in results\" :key=\"result[optionValue]\" v-html=\"highlight(result[optionText])\" @click=\"addOption(result)\" @keyup.prevent=\"navigateResults(result, $event)\" />\n            </div>\n        </div>\n    </div>\n</template>\n\n<script>\n    export default {\n        props: {\n            placeholder: {\n                type: String, \n                default: 'search',\n                required: false\n            },\n            options: {\n                type: Array, \n                default: function() {\n                    return []\n                },\n                required: true\n            },\n            optionValue: {\n                type: String, \n                default: 'id',\n                required: true\n            },\n            optionText: {\n                type: String, \n                default: 'name',\n                required: true\n            },\n            value: {\n                type: Array,\n                default: function() {\n                    return []\n                },\n                required: false\n            }\n        },\n        data: function() {\n            return {\n                hasFocus: false,\n                search: null,\n                selectedOptions: [],\n                selectedResult: 0\n            };\n        },\n        mounted() {\n            // Load selected options from prop into the selected options array\n            this.value.forEach(option => {\n                if(this.options.find(o => o.id == option.id)) {\n                    this.selectedOptions.push(this.options.find(o => o.id == option.id));\n                } else {\n                    this.selectedOptions.push(option);\n                }\n            })\n            // Add onclick method to body to hide result list when component loses focus\n            window.addEventListener(\"click\", this.loseFocus)\n        },\n        destroyed() {\n            window.removeEventListener(\"click\", this.loseFocus)\n        },\n        computed: {\n            results: function() {\n                // Filter options on search text (if not empty, case insensitive) and when item isn't already selected (else return all options not selected)\n                return this.search ? this.options.filter(o => ( o[this.optionText].toLowerCase().indexOf(this.search.toLowerCase()) > -1 && !this.selectedOptions.find(s => s[this.optionValue]==o[this.optionValue])) ) : this.options.filter(o => !this.selectedOptions.find(s => s[this.optionValue] == o[this.optionValue]));\n            },\n            showResultList: function() {\n                return this.hasFocus && this.results.length > 0;\n            },\n            showPlaceholder: function() {\n                return !this.hasFocus && this.selectedOptions.length == 0;\n            }\n        },\n        watch: {\n            hasFocus: function(hasFocus) {\n                // Clear the search box when component loses focus\n                window.removeEventListener(\"keydown\", this.stopScroll);\n                if(hasFocus) {\n                    window.addEventListener(\"keydown\", this.stopScroll);\n                    this.$refs.search.focus();\n                } else {\n                    this.search = null;\n                    this.selectedResult = 0;\n                    this.$refs.search.blur();\n                }\n            },\n            selectedOptions: function() {\n                // Provide selected options array to parent\n                this.$emit('input', this.selectedOptions);\n            },\n            search: function() {\n                // Provide search text to parent (for ajax fetching, etc)\n                this.$emit('search', this.search);\n            }\n        },\n        methods: {\n            addOption: function(option) {\n                this.selectedOptions.push(option);\n                this.search = null;\n                this.selectedResult = 0;\n            },\n            removeOption: function(option) {\n                // Remove option from selected options\n                let index = this.selectedOptions.indexOf(option);\n                this.selectedOptions.splice(index, 1);\n            },\n            removeLastOption: function(event) {\n                // Remove last selected option if user hits backspace on empty search field\n                if(event.keyCode === 8 && (this.search == null || this.search == '')) {\n                    this.selectedOptions.pop();\n                }\n            },\n            moveToResults: function(event) {\n                // Move down to first result if user presses down arrow (from search field)\n                if(event.keyCode === 40) {\n                    if(this.$refs.result.length > 0) {\n                        this.$refs.resultList.children.item(0).focus();\n                    }\n                }\n            },\n            navigateResults: function(option, event) {\n                // Add option to selected items on enter key\n                if(event.keyCode === 13) {\n                    this.addOption(option);\n                    this.$refs.search.focus();\n                // Move up or down options in result list with up or down arrow keys\n                } else if(event.keyCode === 40 || event.keyCode === 38) {\n                    if(event.keyCode === 40) {\n                        this.selectedResult++;\n                    } else if(event.keyCode === 38) {\n                        this.selectedResult--;\n                    }\n                    let next = this.$refs.resultList.children.item(this.selectedResult);\n                    if(next) {\n                        next.focus();\n                    } else {\n                        this.selectedResult = 0;\n                        this.$refs.search.focus();\n                    }\n                }\n            },\n            highlight: function(value) {\n                // Highlights the part of each result that matches the search text\n                if(this.search) {\n                    let matchPos = value.toLowerCase().indexOf(this.search.toLowerCase());\n                    if(matchPos > -1) {\n                        let matchStr = value.substr(matchPos, this.search.length);\n                        value = value.replace(matchStr, '<span style=\"font-weight: bold; background-color: #efefef;\">'+matchStr+'</span>');\n                    }\n                }\n\n                return value;\n            },\n            stopScroll: function(event) {\n                if(event.keyCode === 40 || event.keyCode === 38) {\n                    event.preventDefault();\n                }\n            },\n            loseFocus: function(event) {\n                if(!event.target.classList.contains('vue-dynamic-select') && (event.target.parentElement && !event.target.parentElement.classList.contains('vue-dynamic-select'))) {\n                    this.hasFocus = false;\n                }\n            }\n        }\n    }\n</script>\n\n<style scoped>\n    .vue-dynamic-select {\n        border: 1px solid #ced4da; \n        position: relative;\n        padding: .375em .5em;\n        border-radius: .25em;\n        cursor: text;\n        display: block;\n    }\n    .vue-dynamic-select i.dropdown {\n        width: 0; \n        height: 0; \n        border-left: 4px solid transparent; \n        border-right: 4px solid transparent; \n        border-top: 4px solid; \n        float: right; \n        top: .75em; \n        opacity: .8; \n        cursor: pointer;\n    }\n    .vue-dynamic-select .placeholder {\n        display: inline-block;\n        color: #ccc;\n    }\n    .vue-dynamic-select .result-list {\n        border: 1px solid #ced4da; \n        margin: calc(.375em - 1px) calc(-.5em - 1px);\n        width: calc(100% + 2px);\n        min-width: calc(100% + 2px);\n        border-radius: 0 0 .25em .25em;\n        cursor: pointer;\n        position: absolute;\n        z-index: 10;\n        background-color: #fff;\n    }\n    .vue-dynamic-select .result-list .result {\n        padding: .375em .75em;\n        color: #333;\n    }\n    .vue-dynamic-select .result-list .result:hover, .vue-dynamic-select .result-list .result:focus {\n        background-color: #efefef;\n        outline: none;\n    }\n    .vue-dynamic-select .selected-option {\n        display: inline-block;\n        padding: .1em .25em;\n        margin: .15em .35em .15em 0em;\n        background-color: #efefef;\n        font-size: .9em;\n        border: 1px solid #c3c3c3;\n        border-radius: .25em;\n        cursor: pointer;\n    }\n    .vue-dynamic-select .search {\n        border: none;\n        width: 50px;\n    }\n    .vue-dynamic-select .search:focus {\n        outline: none;\n    }\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__ = "data-v-238a9e44";
      /* module identifier */
      var __vue_module_identifier__ = undefined;
      /* functional template */
      var __vue_is_functional_template__ = false;
      /* style inject SSR */
      

      
      var DynamicMultiSelect = normalizeComponent_1(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        browser,
        undefined
      )

    // Declare install function executed by Vue.use()
    function install(Vue) {
    	if (install.installed) { return; }
    	install.installed = true;
    	Vue.component('DynamicMultiSelect', DynamicMultiSelect);
    }

    // Create module definition for Vue.use()
    var plugin = {
    	install: install,
    };

    // Auto-install when vue is found (eg. in browser via <script> tag)
    var GlobalVue = null;
    if (typeof window !== 'undefined') {
    	GlobalVue = window.Vue;
    } else if (typeof global !== 'undefined') {
    	GlobalVue = global.Vue;
    }
    if (GlobalVue) {
    	GlobalVue.use(plugin);
    }

    exports.install = install;
    exports.default = DynamicMultiSelect;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
