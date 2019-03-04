<template>
    <div>
        <div tabindex="0" @click="$refs.search.focus()" @focusin="hasFocus=true" class="vue-dynamic-select">
            <div v-if="showPlaceholder" class="placeholder" v-text="placeholder"></div>
            <div class="selected-option" v-for="option in selectedOptions" :key="option[optionValue]" v-text="option[optionText]" @click.prevent.stop="removeOption(option)" />
            <input autocomplete="off" class="search" ref="search" v-model="search" @keyup="moveToResults" @keydown="removeLastOption" />
            <i class="dropdown" />
            <div v-if="showResultList" ref="resultList" class="result-list">
                <div tabindex=0 ref="result" class="result" v-for="result in results" :key="result[optionValue]" v-html="highlight(result[optionText])" @click="addOption(result)" @keyup.prevent="navigateResults(result, $event)" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
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
        mounted() {
            // Load selected options from prop into the selected options array
            this.value.forEach(option => {
                if(this.options.find(o => o.id == option.id)) {
                    this.selectedOptions.push(this.options.find(o => o.id == option.id));
                } else {
                    this.selectedOptions.push(option);
                }
            })
            // Add onclick method to body to hide result list when component loses focus
            window.addEventListener("click", this.loseFocus)
        },
        destroyed() {
            window.removeEventListener("click", this.loseFocus)
        },
        computed: {
            results: function() {
                // Filter options on search text (if not empty, case insensitive) and when item isn't already selected (else return all options not selected)
                return this.search ? this.options.filter(o => {
                    return String(o[this.optionText]).toLowerCase().indexOf(this.search.toLowerCase()) > -1 && !this.selectedOptions.find(s => s[this.optionValue]==o[this.optionValue]);
                }) : this.options.filter(o => !this.selectedOptions.find(s => s[this.optionValue] == o[this.optionValue]));
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
                let index = this.selectedOptions.indexOf(option);
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
                    let next = this.$refs.resultList.children.item(this.selectedResult);
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
                    let matchPos = String(value).toLowerCase().indexOf(this.search.toLowerCase());
                    if(matchPos > -1) {
                        let matchStr = String(value).substr(matchPos, this.search.length);
                        value = String(value).replace(matchStr, '<span style="font-weight: bold; background-color: #efefef;">'+matchStr+'</span>');
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
</script>

<style scoped>
    .vue-dynamic-select {
        border: 1px solid #ced4da; 
        position: relative;
        padding: .375em .5em;
        border-radius: .25em;
        cursor: text;
        display: block;
    }
    .vue-dynamic-select i.dropdown {
        width: 0; 
        height: 0; 
        border-left: 4px solid transparent; 
        border-right: 4px solid transparent; 
        border-top: 4px solid; 
        float: right; 
        top: .75em; 
        opacity: .8; 
        cursor: pointer;
    }
    .vue-dynamic-select .placeholder {
        display: inline-block;
        color: #ccc;
    }
    .vue-dynamic-select .result-list {
        border: 1px solid #ced4da; 
        margin: calc(.375em - 1px) calc(-.5em - 1px);
        width: calc(100% + 2px);
        min-width: calc(100% + 2px);
        border-radius: 0 0 .25em .25em;
        cursor: pointer;
        position: absolute;
        z-index: 10;
        background-color: #fff;
    }
    .vue-dynamic-select .result-list .result {
        padding: .375em .75em;
        color: #333;
    }
    .vue-dynamic-select .result-list .result:hover, .vue-dynamic-select .result-list .result:focus {
        background-color: #efefef;
        outline: none;
    }
    .vue-dynamic-select .selected-option {
        display: inline-block;
        padding: .1em .25em;
        margin: .15em .35em .15em 0em;
        background-color: #efefef;
        font-size: .9em;
        border: 1px solid #c3c3c3;
        border-radius: .25em;
        cursor: pointer;
    }
    .vue-dynamic-select .search {
        border: none;
        width: 50px;
    }
    .vue-dynamic-select .search:focus {
        outline: none;
    }
</style>
