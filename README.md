# vue-dynamic-multiselect
A VueJS plugin that provides a searchable and reactive multiselect list component with no dependencies.

![alt text](https://raw.githubusercontent.com/silasmontgomery/vue-dynamic-multiselect/master/src/images/dynamic-multiselect.png "vue-dynamic-multiselect screenshot")

[View Online Demos](http://demos.reticent.net/vue-dynamic-multiselect)

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

NOTE: For more detailed usage see the examples folder.

### Properties
| Name         | Type   | Default | Description                         |
| ------------ | ------ | ------- | ------------------------------------------------------------------- |
| options      | Array  | [ ]     | Array of objects that will create the select list options           |
| option-value | String | id      | The object property used for the value of the select options        |
| option-text  | String | name    | The object property used for the display text of the select options |
| v-model      | Array  | [ ]     | Array used for fetching / storing the selected objects              |
| placeholder  | String | search  | String containing the text to be used as a placeholder              |

### Events
| Name   | Description                                                                 |
| ------ | --------------------------------------------------------------------------- |
| search | Triggered whenever search text changes. Value is the current search string. |
| input  | Triggered whenever the selected options change.                             |