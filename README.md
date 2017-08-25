autoComplete
======

输入框自动提示插件(A javascript plug-in for fuzzy query).

特色
-------
1. 支持上下方向键和回车键
2. 支持npm安装
3. 提示框样式配置功能强大(支持直接修改css)
4. 支持ajax请求数据和已有数据两种方式的调用
5. 不依赖jquery等其它库文件

Install
-------
方式一  

* npm install ykautocomplete
 
方式二  

* clone the repo: `git clone https://github.com/yy249357/autoComplete.git`.

Example
-----------

Here is a simple example.

**(用法一)已存在数据**
```html
<input type="text" id="test"/>
```
```js
autocomplete("#test", {
    number: 4,
    fuzzy: true,
    srcData: [
        'apple',
        'banana',
        'cherry',
        'dog',
        'eat',
        'frog',
        'grape',
        'orange',
        'lemon',
        'plum',
        'peach'
    ]
})
```

**(用法二)ajax请求数据**
```js
    autocomplete('#test', {
        fuzzy: false, 
        number: 6,
        srcData: function(callback){
            var ret = [], storage = []
            $.ajax({
                type: "post",
                url: "/web/home-msg/fuzzy-query",
                contentType : 'application/json; charset=UTF-8',
                data:JSON.stringify({
                    'iMsgType': $('#iMsgType').val(),
                    'vcTitle': $("#vcTitle").val()
                }),
                cache: false,
                dataType: 'json',
                success: function(res) {
                    var temp = res.data
                    for(var i=0; i<temp.length; ++i){
                        ret.push(temp[i].vcTitle)
                        storage.push(temp[i].vcMsgId)
                    }
                    callback(ret, storage)
                }
            })
        }
    })
```

API Document
--------

说明: 一个页面内始终只有一个弹窗框

**number: 显示的条数**

说明: 默认显示6条数据, 多余的数据会自动形成滚动条
例:
```
number: 10
```

**backgroundColor: 选中时当前行的背景色**

说明: 默认值为'#F7F2EB'(淡黄色)
例:
```
backgroundColor: 'yellowgreen'
```

**fuzzy: 是否开启前端模糊查询**

说明: 默认为开启。如果请求的数据是后端已经模糊查询过的,可以关闭。
例:
```
fuzzy: false
```

**lineHeight: 列表行高** 

说明: 单条数据显示的行高, 默认为20px
例:
```
lineHeight: 30
```

**width: 搜索结果框宽度**

说明: 默认自动和input输入框宽度相同
例:
```
width: 200
```

**ajaxCallback: 查询完成后的回调函数**

说明: 用在查询完成后, 刚选中完数据时的回调
例:
```js
ajaxCallback: function(){
    console.log('hello world!')
}
```

**callback(arg1, arg2): 处理返回数据的回调函数**

说明: 此函数放在ajax的success回调函数中, 作用是把数据传入插件函数中。
参数arg1表示要显示的列表数据, 参数arg2表示存储数据(可以存储普通字符串或json对象, 例如: 列表id等)。
例:
```js
srcData: function(callback){
    var ret = [], storage = []
    $.ajax({
        type: "get",
        url: "./data.json",
        dataType: "json",
        success: function(res) {
            var temp = res.data
            for(var i=0; i<temp.length; ++i){
                ret.push(temp[i].city)
                storage.push(temp[i].name)
            }
            callback(ret, storage)
        }
    })
},
// 获取存储数据
var storeData = document.querySelector('input').getAttribute('data');
```


