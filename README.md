autoComplete
======

A javascript plug-in for fuzzy query.

Install
-------
方式一  

* npm install ykautocomplete
 
方式二  

* clone the repo: `git clone https://github.com/yy249357/autoComplete.git`.

Example
-----------

Here is a simple example.

**测试数据**
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

**ajax请求**
```js
    autocomplete('#vcTitle', {
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

说明: 默认显示6条 
例:
```
number: 10
```

**fuzzy: 是否开启前端模糊查询**

说明: 默认为开启。如果请求的数据是后端已经模糊查询过的,可以关闭。
例:
```
fuzzy: false
```

**lineHeight: 列表行高** 

说明: 默认为20px
例:
```
lineHeight: 30
```

**width: 搜索结果框宽度**

说明: 默认和input输入框宽度相同
例:
```
width: 200
```

**callback(arg1, arg2): 处理返回数据的回调函数**

说明: 参数arg1表示要显示的列表数据, 参数arg2表示存储数据(可以存储普通字符串或json对象, 例如: 列表id等)。
例:
```js
// 获取存储数据
var storeData = document.querySelector('input').getAttribute('data');
```


