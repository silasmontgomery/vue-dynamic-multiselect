# vue-dynamic-multiselect
A VueJS plugin that provides a searchable and reactive multiselect list component with no dependencies.

![alt text](https://raw.githubusercontent.com/silasmontgomery/vue-dynamic-multiselect/master/src/images/dynamic-multiselect.png "vue-dynamic-multiselect screenshot")

### Installation
```
npm install vue-dynamic-multiselect --save
```

### Import
```javascript
import DynamicMultiSelect from 'vue-dynamic-multiselect'

Vue.use(DynamicMultiSelect)
```

### Usage
```javascript
// Static options source (array)
<dynamic-multi-select 
    :options="objectArray"
    option-value="id"
    option-text="name"
    placeholder="type to search"
    v-model="selectedObjects" />

// Dynamic options source (ajax, etc)
<dynamic-multi-select 
    :options="objectArray"
    @search="onSearchEventHandler"
    option-value="id"
    option-text="name"
    placeholder="type to search"
    v-model="selectedObjects" />
```